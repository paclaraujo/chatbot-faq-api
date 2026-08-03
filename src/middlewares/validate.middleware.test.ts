import { describe, expect, it, vi } from "vitest";
import { z, ZodError } from "zod";
import { mockRequest, mockResponse } from "../test-utils/http";
import { validateBody, validateParams, validateQuery } from "./validate.middleware";

const schema = z.object({ name: z.string().trim().min(1) });

describe("validateBody", () => {
  it("calls next() and replaces req.body with the parsed data when valid", () => {
    const req = mockRequest({ body: { name: "  ok  " } });
    const next = vi.fn();

    validateBody(schema)(req, mockResponse(), next);

    expect(req.body).toEqual({ name: "ok" });
    expect(next).toHaveBeenCalledOnce();
  });

  it("throws a ZodError instead of calling next() when invalid", () => {
    const req = mockRequest({ body: { name: "" } });
    const next = vi.fn();

    expect(() => validateBody(schema)(req, mockResponse(), next)).toThrow(ZodError);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("validateParams", () => {
  it("calls next() when params are valid", () => {
    const req = mockRequest({ params: { name: "ok" } });
    const next = vi.fn();

    validateParams(schema)(req, mockResponse(), next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("throws a ZodError when params are invalid", () => {
    const req = mockRequest({ params: {} });
    const next = vi.fn();

    expect(() => validateParams(schema)(req, mockResponse(), next)).toThrow(ZodError);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("validateQuery", () => {
  it("calls next() when the query is valid", () => {
    const req = mockRequest({ query: { name: "ok" } });
    const next = vi.fn();

    validateQuery(schema)(req, mockResponse(), next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("throws a ZodError when the query is invalid", () => {
    const req = mockRequest({ query: {} });
    const next = vi.fn();

    expect(() => validateQuery(schema)(req, mockResponse(), next)).toThrow(ZodError);
    expect(next).not.toHaveBeenCalled();
  });
});
