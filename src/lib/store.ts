export type Question = {
    id: string;
    type: 'text' | 'textarea' | 'multi' | 'single';
    heading: string;
};

export type Form = {
    id: string;
    title: string;
    questions: Array<Question>;
};

const forms = new Map<string, Form>();

forms.set('1', {
    id: '1',
    title: 'Seeded Form',
    questions: [
        {
            id: "1",
            type: 'text',
            heading: 'this is a sample question',
        }
    ]
});

export function getForm(id: string): Form | undefined {
    return forms.get(id);
}