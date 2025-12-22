import { asyncHandler } from "../middleware/asyncHandler";
import { createFormsRepo } from "../repositories/forms.repo";
import { prisma } from "../lib/prisma";
import { createFormsService } from "../services/forms.service";
import { createFormsController } from "../controllers/forms.controller";
import { Router } from "express";

const formsRepo = createFormsRepo(prisma);
const formsService = createFormsService(formsRepo);
const formsController = createFormsController(formsService);

const { getForm, autosaveDraft, submitDraft } = formsController;

export const formsRouter = Router();

formsRouter.get("/:id", asyncHandler(getForm));
formsRouter.post("/:id/autosave", asyncHandler(autosaveDraft));
formsRouter.post("/:id/submit", asyncHandler(submitDraft));