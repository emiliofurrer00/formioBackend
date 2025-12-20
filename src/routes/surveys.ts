import { Request, Response, Router } from "express";
import { getDraft, getForm, saveDraft } from "../lib/store";
import z from "zod";

export const formsRouter = Router();

formsRouter.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const form = getForm(id);
    if (!form) return new HttpError(404, 'Form not found', "FORM_NOT_FOUND");

    const draft = getDraft(id);

    res.json({
        form,
        draft: draft ? {
            id: draft.id,
            userEmail: draft.userEmail,
            formId: draft.formId,
            answers: draft.answers,
            createdAt: draft.createdAt,
            updatedAt: draft.updatedAt
        } : null,
    });
});

const SaveDraftReqBody = z.object({
    userEmail: z.string().email().optional(),
    answers: z.record(z.string(), z.unknown()),
    formId: z.string()
});

formsRouter.post("/:id/submit", (req: Request, res: Response) => {
    const { id } = req.params;
    const parsedBody = SaveDraftReqBody.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ error: 'Invalid request body', details: z.treeifyError(parsedBody.error) });
    }

    let existingDraft = getDraft(id);

    // Create new draft if none exists
    if (!existingDraft) {
        existingDraft = {
            id: crypto.randomUUID(),
            formId: id,
            answers: parsedBody.data.answers,
            userEmail: parsedBody.data.userEmail,
            createdAt: new Date()
        };
        saveDraft(existingDraft);
        return res.status(201).json({ draft: existingDraft });
    }
    // Update existing draft
    existingDraft.answers = parsedBody.data.answers;
    existingDraft.userEmail = parsedBody.data.userEmail;
    existingDraft.updatedAt = new Date();
    const savedDraft = saveDraft(existingDraft);
    res.json({ draft: savedDraft });
});