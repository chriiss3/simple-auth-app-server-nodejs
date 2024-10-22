import { ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

const validateData = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: err.errors.map((err) => err.message) });
    }
  }
};

export default validateData;
