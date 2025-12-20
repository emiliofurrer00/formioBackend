import { prisma } from "./prisma";

export type Option = {
    id: string;
    label: string;
    value: string;
};  

export type Question = {
    id: string;
    type: 'text' | 'textarea' | 'multi' | 'single';
    heading: string;
    createdAt: Date;
    updatedAt?: Date;
    options?: Array<Option>;
};

export type Form = {
    id: string;
    title: string;
    questions: Array<Question>;
    createdAt: Date;
    updatedAt?: Date;
};

export type Answer = {
    questionId: string;
    draftId: string;
    value: string;
    createdAt: Date;
    updatedAt?: Date;
};

export type Draft = {
    id?: string;
    userEmail?: string;
    formId: string;
    answers: Record<string, unknown>;
    createdAt: Date;
    updatedAt?: Date;
};

export async function getForm(id: string) {
    return prisma.form.findUnique(
        { 
            where: { id },
            include: {
                questions: {
                    orderBy: { order: "asc" },
                    include: {
                        choices: { orderBy: { order: "asc" } }
                    }
                }
            }
        });
}

export async function getDraft(id: string) {
    return prisma.draft.findUnique({ where: { id }, include: { answers: true } });
}

export async function saveDraft(params: {
  formId: string;
  answers: Answer[];
  version: number;
  submitted: boolean;
  lastHash?: string | null;
}) {
    return prisma.$transaction(async (tx) => {
        const draft = await tx?.draft.upsert({
            where: { formId: params.formId },
            update: {
                version: params.version,
                submitted: params.submitted,
                lastHash: params.lastHash ?? null,
            },
            create: {
                formId: params.formId,
                version: params.version,
                submitted: params.submitted,
                lastHash: params.lastHash ?? null,
            },
        });

        if(params.answers.length > 0) {
            await Promise.all(params.answers.map(async (answer) => {
                await tx.answer.upsert({
                    where: {
                        draftId_questionId: {
                            draftId: draft.id,
                            questionId: answer.questionId,
                        }
                    },
                    update: {
                        value: answer.value,
                        updatedAt: new Date(),
                    },
                    create: {
                        draftId: draft.id,
                        questionId: answer.questionId,
                        value: answer.value,
                        createdAt: new Date(),
                    },
                });
            }));
        }

         return tx.draft.findUnique({
            where: { id: draft.id },
            include: {
                answers: true, // or `answers: true` depending on your relation field name
            },
        });
    });
}