import express from "express";
import type { NextFunction, Request, Response } from "express"
import { requestLogger } from "./lib/logger";
import { formsRouter } from "./routes/surveys";
import { HttpError } from "../src/lib/errors";
// set up cors
import cors from "cors";


const app = express();
app.use(cors({ origin: ['http://localhost:3000','https://formio-client-rho.vercel.app'] }))
app.use(express.json());
app.use(requestLogger);

// Adding routers
app.use('/forms', formsRouter);

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));

// Error Handling
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.log('Error handler caught an error:', err);
    if (err instanceof HttpError){
        const { code, message, details } = err;
        const errorJson = { error: code, message, details };
        return res.status(err.status).json(errorJson);
    }
    console.error("Unhandled error:", err);
    return res.status(500).json({ error: { code: "INTERNAL", message: "Internal server error" } });
});

const PORT = Number(process.env.PORT || 3001);

app.listen(PORT, "0.0.0.0", () => console.log(`API listening on PORT ${PORT}`));

