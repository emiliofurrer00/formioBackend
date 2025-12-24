import { Request, Response, NextFunction } from "express";
import { HttpError } from "../lib/errors";

export function ErrorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction){
    console.log('Error handler caught an error:', err);
    if (err instanceof HttpError){
        const { code, message, details } = err;
        const errorJson = { error: code, message, details };
        return res.status(err.status).json(errorJson);
    }
    console.error("Unhandled error:", err);
    return res.status(500).json({ error: { code: "INTERNAL", message: "Internal server error" } });
}