export type Question = {
    id: string;
    type: 'text' | 'textarea' | 'multi' | 'single';
    heading: string;
    createdAt: Date;
    updatedAt?: Date;
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

const forms = new Map<string, Form>();
const drafts = new Array<Draft>();

forms.set('1', {
    id: '1',
    title: 'Seeded Form',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
        {
            id: "1",
            type: 'text',
            heading: 'this is a sample question',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]
});

export function getForm(id: string): Form | undefined {
    return forms.get(id);
}

export function getDraft(id: string): Draft | undefined {
    return drafts.find((draft => draft.formId === id));
}

export function saveDraft(draft: Draft): Draft {
    const existingIndex = drafts.findIndex(d => d.id === draft.id);
    if (existingIndex >= 0) {
        drafts[existingIndex] = { ...draft, updatedAt: new Date() };
        return drafts[existingIndex];
    } else {
        const newDraft = { ...draft, id: crypto.randomUUID(), createdAt: new Date() };
        drafts.push(newDraft);
        return newDraft;
    }
}