import { Draft } from "@prisma/client";

export type Option = {
    id: string;
    label: string;
    value: string;
};  

export type Question = {
    id: string;
    type: any;
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

export type DraftClientDto = {
    id?: string;
    userEmail?: string;
    formId: string;
    answers: Record<string, unknown>;
    createdAt: Date;
    updatedAt?: Date;
};

export interface IFormsRepository {
    getForm(id: string): Promise<Form | null>;
    getDraft(id: string): Promise<DraftDto | null>;
    saveDraft(params: {
        formId: string;
        answers: Answer[];
        version: number;
        submitted: boolean;
        lastHash?: string | null;
    }): Promise<void>;
}

interface DraftDto extends Draft {
    answers: Answer[];
}

export interface IFormsService {
    getForm(id: string): Promise<Form | null>;
    getDraft(formId: string): Promise<DraftDto | null>;
    autosaveDraft(params: {
        formId: string;
        answers: Answer[];
        version: number;
        lastHash?: string | null;
    }): Promise<void>;
    submitDraft(params: {
        formId: string;
        answers: Answer[];
        version: number;
        lastHash?: string | null;
    }): Promise<void>;
}