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
    questionId: number;
    answer: unknown;
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
    return prisma?.form.findUnique(
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
    return prisma?.draft.findUnique({ where: { id } });
}

export function saveDraft(params: {
  formId: string;
  answers: Record<string, string>;
  version: number;
  submitted: boolean;
  lastHash?: string | null;
}) {
return prisma?.draft.upsert({
    where: { formId: params.formId },
    update: {
      answers: params.answers,
      version: params.version,
      submitted: params.submitted,
      lastHash: params.lastHash ?? null,
    },
    create: {
      formId: params.formId,
      answers: params.answers,
      version: params.version,
      submitted: params.submitted,
      lastHash: params.lastHash ?? null,
    },
  });
}