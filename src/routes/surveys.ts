import { Request, Response, Router } from "express";
import { getDraft, getForm, saveDraft } from "../lib/store";
import z from "zod";
import { HttpError } from "../lib/errors";
import { asyncHandler } from "../lib/asyncHandler";

export const formsRouter = Router();

formsRouter.get("/:id", asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const form = await getForm(id);
    console.log('Fetched form:', form);
    if (!form) throw new HttpError(404, 'Form not found', "FORM_NOT_FOUND");

    const draft = await getDraft(id);

    res.json({
        form,
        draft: draft ? {
            id: draft.id,
            userEmail: "test@gmail.com",
            formId: draft.formId,
            answers: draft.answers,
            createdAt: draft.createdAt,
            updatedAt: draft.updatedAt
        } : null,
    });
}));

const AnswerSchema = z.object({
    questionId: z.string(),
    draftId: z.string(),
    value: z.string(),
});

const SaveDraftReqBody = z.object({
    userEmail: z.string().email().optional(),
    answers: z.record(z.string(), AnswerSchema),
    formId: z.string()
});

formsRouter.post("/:id/submit", asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parsedBody = SaveDraftReqBody.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ error: 'Invalid request body', details: z.treeifyError(parsedBody.error) });
    }

    let existingDraft = await getDraft(id);
    const parsedAnswers = Object.values(parsedBody.data.answers);

    // Create new draft if none exists
    if (!existingDraft) {
        const newDraft = {
            id: crypto.randomUUID(),
            formId: id,
            //userEmail: parsedBody.data.userEmail,
            createdAt: new Date(),
            answers: parsedAnswers,
            version: 1,
            submitted: true,
            lastHash: null,
        };
        saveDraft(newDraft as any);
        return res.status(201).json({ draft: existingDraft });
    }
    // Update existing draft
    const savedDraft = saveDraft({... existingDraft, answers: parsedAnswers, updatedAt: new Date() } as any);
    return res.json({ draft: savedDraft });
}));