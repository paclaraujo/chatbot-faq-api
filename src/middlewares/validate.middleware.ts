import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}

export function validateParams(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.params);
    next();
  };
}

export function validateQuery(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.query);
    next();
  };
}
