import { ZodError } from "zod";
const validateData = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ error: err.errors.map((err) => err.message) });
        }
    }
};
export default validateData;
