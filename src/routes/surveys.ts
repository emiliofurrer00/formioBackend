import { Request, Response, Router } from "express";
import { getForm } from "../lib/store";

export const formsRouter = Router();

formsRouter.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const form = getForm(id);
    if (!form) return new HttpError(404, 'Form not found', "FORM_NOT_FOUND");

    res.json({
        form
    });
});