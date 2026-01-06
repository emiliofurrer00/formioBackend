import { NextFunction, Request, Response } from "express";
import { IFormsService } from "../types/forms.types";
import { HttpError } from "../lib/errors";
import z from "zod";

const AnswerSchema = z.object({
    questionId: z.string(),
    draftId: z.string(),
    value: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
});

const SaveDraftReqBody = z.object({
    userEmail: z.email().optional(),
    answers: z.array(AnswerSchema),
    formId: z.string(),
    version: z.number(),
    lastHash: z.string().nullable().optional(),
});

export function createFormsController(formsService: IFormsService) {
    async function getForm(req: Request, res: Response, next: NextFunction) {
        try {
            const formId = req.params.id;
            const form = await formsService.getForm(formId);
            if (!form) throw new HttpError(404, 'Form not found', "FORM_NOT_FOUND");
            const draft = await formsService.getDraft(formId);
            // TODO: Refactor into separate util function out of controller logic. Put it in service layer?
            const answerCount = draft?.answers?.length;
            const percentageComplete = answerCount ? form.questions.length * 100 / draft?.answers?.length : 0;
            return res.json({ form, draft: {...draft, percentageComplete } });
        } catch (error) {
            next(error);
        }
    }

    async function autosaveDraft(req: Request, res: Response, next: NextFunction) {
        try {

            const parsedBody = SaveDraftReqBody.safeParse(req.body);
            if (!parsedBody.success) {
                return res.status(400).json({ error: 'Invalid request body', details: z.treeifyError(parsedBody.error) });
            }
            const formId = req.params.id;
            const { answers, version, lastHash } = parsedBody.data;
            await formsService.autosaveDraft({ formId, answers, version, lastHash });
            return res.status(200).json({ message: "Draft autosaved successfully" });
        } catch (error) {
            next(error);
        }
    }

    async function submitDraft(req: Request, res: Response, next: NextFunction) {
        try {

            const parsedBody = SaveDraftReqBody.safeParse(req.body);
            if (!parsedBody.success) {
                return res.status(400).json({ error: 'Invalid request body', details: z.treeifyError(parsedBody.error) });
            }
            const { id } = req.params;
            const { answers, version, lastHash } = req.body;
            await formsService.submitDraft({ formId: id, answers, version, lastHash });
            return res.status(200).json({ message: "Draft submitted successfully" });
        }
        catch (error) {
            next(error);
        }
    }

    return { getForm, autosaveDraft, submitDraft };
}