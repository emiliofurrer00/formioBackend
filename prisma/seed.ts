import { PrismaClient, QuestionType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$transaction(async(tx) => {
      await tx.form.upsert({
          where: { id: "demo" },
          update: {},
          create: {
              id: "demo",
              title: "Patient Intake (Demo)",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        
        // Clean up for deterministic migrations
        await tx.choice.deleteMany({
            where: { question: { formId: "demo" } }
        })

        await tx.question.deleteMany({
            where: { formId: "demo" }
        })

        await tx.question.createMany({
            data: [
                { id: "q1", formId: "demo", type: QuestionType.text, heading: "Full name", order: 1 },
                { id: "q2", formId: "demo", type: QuestionType.textarea, heading: "Symptoms", order: 2 },
                { id: "q3", formId: "demo", type: QuestionType.single, heading: "Preferred contact", order: 3 },
            ],
        });

        await tx.choice.createMany({
            data: [
                { questionId: "q3", label: "Email", value: "email", order: 1 },
                { questionId: "q3", label: "Phone", value: "phone", order: 2 },
            ],
        });
    });
}
    
    main()
    .then(async () => {
        await prisma.$disconnect();
    })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
