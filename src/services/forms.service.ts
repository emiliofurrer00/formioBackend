import type { Answer, IFormsRepository } from "../types/forms.types";

export function createFormsService(repo: IFormsRepository){
    function getForm(id: string) {
        return repo.getForm(id);
    }

    function getDraft(formId: string) {
        return repo.getDraft(formId);
    }

    function autosaveDraft(params: {
        formId: string;
        answers: Answer[];
        version: number;
        lastHash?: string | null;
    }) {
        return repo.saveDraft({
            formId: params.formId,
            answers: params.answers,
            version: params.version,
            submitted: false,
            lastHash: params.lastHash,
        });
    }

    function submitDraft(params: {
        formId: string;
        answers: Answer[];
        version: number;
        lastHash?: string | null;
    }) {
        return repo.saveDraft({
            formId: params.formId,
            answers: params.answers,
            version: params.version,
            submitted: true,
            lastHash: params.lastHash,
        });
    }

    return { getForm, getDraft, autosaveDraft, submitDraft };
}