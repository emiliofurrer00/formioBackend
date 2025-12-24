import express from "express";
import type { Request, Response } from "express"
import { requestLogger } from "./middleware/logger";
import { formsRouter } from "./routes/forms.routes";
import { ErrorHandler } from "./middleware/errorHandler";
import cors from "cors";

export function createApp(){
    const app = express();
    app.use(cors({ origin: ['http://localhost:3000','https://formio-client-rho.vercel.app'] }))
    app.use(express.json());
    app.use(requestLogger);
    
    // Adding routers
    app.use('/forms', formsRouter);
    
    app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));
    
    // Error Handling Middleware
    app.use(ErrorHandler);
    return app;
}