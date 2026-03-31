// Reference: https://github.com/FaztWeb/nodejs-jest-supertest/blob/master/tests/index.spec.js
// https://www.dennisokeeffe.com/blog/2023-10-27-testing-express-apps-with-jest-and-supertest

import request from "supertest";
import app from "../server.js";

describe("GET /api/comandas/:id", () => {
    test("should respond with a 404 status code when the id is invalid", async () => {
        const response = await request(app).get("/api/comandas/ORD-0000").send();
        expect(response.statusCode).toBe(404);
    });
});

describe("POST /comandas", () => {
    describe("given a correct structure", () => {
        const newComandas = {
            "cliente": { "nombre": "Ana", "email": "ana@mail.com" },
            "direccion": { "calle": "Carrer Major 1", "cp": "08400", "ciudad": "Granollers" },
            "items": [
                { "camisetaId": "TSH01", "talla": "M", "color": "negro", "cantidad": 2 },
                { "camisetaId": "TSH02", "talla": "L", "color": "gris", "cantidad": 1 }
            ]
        };

        // should respond with a 201 code
        test("should respond with a 201 status code", async () => {
            const response = await request(app).post("/api/comandas/").send(newComandas);
            expect(response.statusCode).toBe(201);
        });

        // should respond a json as a content type
        test("should have a Content-Type: application/json header", async () => {
            const response = await request(app).post("/api/comandas/").send(newComandas);
            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json")
            );
        });

        // shoud respond with a json object containing the new task with an id
        test("should respond with an task ID", async () => {
            const response = await request(app).post("/api/comandas/").send(newComandas);
            expect(response.body.comandas.id).toBeDefined();
        });
    });

    describe("when the camisetaId is missing or incorrect", () => {
        // should respond with a 400 code
        test("shoud respond with a 400 status code", async () => {
            const body = {
                "cliente": { "nombre": "Ana", "email": "ana@mail.com" },
                "direccion": { "calle": "Carrer Major 1", "cp": "08400", "ciudad": "Granollers" },
                "items": [
                    { "camisetaId": "TSH50", "talla": "M", "color": "negro", "cantidad": 2 },
                    { "camisetaId": "QwErTy", "talla": "L", "color": "gris", "cantidad": 1 }
                ]
            };

            const response = await request(app).post("/api/comandas/").send(body);
            expect(response.statusCode).toBe(400);
        });
    });
});