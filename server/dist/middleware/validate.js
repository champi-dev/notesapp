import { ZodError } from 'zod';
export const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        try {
            const data = schema.parse(req[source]);
            req[source] = data;
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                res.status(400).json({
                    error: {
                        message: 'Validation failed',
                        code: 'VAL_001',
                        details: errors,
                    },
                });
                return;
            }
            next(error);
        }
    };
};
//# sourceMappingURL=validate.js.map