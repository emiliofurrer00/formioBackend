import request from "supertest";
import { createApp } from "../src/app";
import { expect, it, describe } from "vitest";

describe("health", () => {
    it("GET /health should return ok true", async () => {
        const app = createApp();
        const response = await request(app).get("/health");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ok: true });
    });
});