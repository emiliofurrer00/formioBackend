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
            updatedAt: new Date(),
            options: []
        },
        {
            id: "2",
            type: 'textarea',
            heading: 'this is another sample question',
            createdAt: new Date(),
            updatedAt: new Date(),
            options: []
        },
        {
            id: "3",
            type: 'single',
            heading: 'this is a multiple choice question',
            createdAt: new Date(),
            updatedAt: new Date(),
            options: [{ id: "1", label: "Option 1", value: "option1" }, { id: "2", label: "Option 2", value: "option2" }]
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