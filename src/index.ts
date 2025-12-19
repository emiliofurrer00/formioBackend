import express from "express";
import type { NextFunction, Request, Response } from "express"
import { requestLogger } from "./lib/logger";
import { formsRouter } from "./routes/surveys";

const app = express();
app.use(express.json());
app.use(requestLogger);

// Adding routers
app.use('/forms', formsRouter);

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));

const PORT = 3001;

// Error Handling
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError){
        const { code, message, details } = err;
        const errorJson = { error: code, message, details };
        return res.status(err.status).json(errorJson);
    }
});

app.listen(PORT, () => console.log(`API listening on http://localhost:3001`));

