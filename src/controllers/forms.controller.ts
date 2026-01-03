import { NextFunction, Request, Response } from "express";
import { IFormsService } from "../types/forms.types";
import { HttpError } from "../lib/errors";
import z from "zod";

const AnswerSchema = z.object({
    questionId: z.string(),
    draftId: z.string(),
    value: z.string(),
});

const SaveDraftReqBody = z.object({
    userEmail: z.email().optional(),
    answers: z.record(z.string(), AnswerSchema),
    formId: z.string()
});

export function createFormsController(formsService: IFormsService) {
    async function getForm(req: Request, res: Response, next: NextFunction) {
        try {
            const formId = req.params.id;
            const form = await formsService.getForm(formId);
            if (!form) throw new HttpError(404, 'Form not found', "FORM_NOT_FOUND");
            const draft = await formsService.getDraft(formId);
            return res.json({ form, draft });
        } catch (error) {
            next(error);
        }
    }

    async function autosaveDraft(req: Request, res: Response, _next: NextFunction) {
        const parsedBody = SaveDraftReqBody.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ error: 'Invalid request body', details: z.treeifyError(parsedBody.error) });
        }
        const formId = req.params.id;
        const { answers, version, lastHash } = req.body;
        await formsService.autosaveDraft({ formId, answers, version, lastHash });
        return res.status(200).json({ message: "Draft autosaved successfully" });
    }

    async function submitDraft(req: Request, res: Response, _next: NextFunction) {
        const parsedBody = SaveDraftReqBody.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ error: 'Invalid request body', details: z.treeifyError(parsedBody.error) });
        }
        const { id } = req.params;
        const { answers, version, lastHash } = req.body;
        await formsService.submitDraft({ formId: id, answers, version, lastHash });
        return res.status(200).json({ message: "Draft submitted successfully" });

    }

    return { getForm, autosaveDraft, submitDraft };
}