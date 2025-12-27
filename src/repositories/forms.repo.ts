import { PrismaClient } from "@prisma/client";
import { Answer } from "../types/forms.types";

export function createFormsRepo(prisma: PrismaClient){
    async function getForm(id: string) {
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
     async function getDraft(id: string) {
            return prisma.draft.findUnique({ where: { formId: id }, include: { answers: true } });
    }
     async function saveDraft(params: {
            formId: string;
            answers: Answer[];
            version: number;
            submitted: boolean;
            lastHash?: string | null;
        }) {
            return prisma.$transaction(async (tx: any) => {
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
                const parsedAnswers = Object.values(params?.answers || {});
                console.log("Parsed Answers:", parsedAnswers);
                console.log("Draft ID:", draft.id);
                if(parsedAnswers.length > 0) {
                    await Promise.all(parsedAnswers.map(async (answer) => {
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
    return { getForm, getDraft, saveDraft };
}