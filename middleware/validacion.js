import { safeParse, ValiError } from 'valibot';

const handleValidationError = (res, issues) => {
  return res.status(400).json({
    error: 'Error de validación',
    details: issues.map(issue => ({
      path: issue.path?.map(p => p.key).join('.') || '',
      message: issue.message,
      type: issue.type
    }))
  });
};

const handleError = (res, error) => {
  console.error('Error de validación:', error);
  
  if (error instanceof ValiError) {
    return handleValidationError(res, error.issues);
  }

  return res.status(500).json({
    error: 'Error interno en la validación',
    details: error instanceof Error ? error.message : 'Ocurrió un error inesperado durante la validación'
  });
};

const createValidator = (schema, dataPath, resultKey) => {
  return (req, res, next) => {
    try {
      const data = dataPath === 'body' ? req.body : req.params[dataPath];
      const result = safeParse(schema, data);

      if (!result.success) {
        return handleValidationError(res, result.issues);
      }
      
      req[resultKey] = result.output;
      next();
    } catch (error) {
      handleError(res, error);
    }
  };
};

export const validarBody = (schema) => {
  return createValidator(schema, 'body', 'validatedBody');
};

export const validarParams = (schema) => {
  return createValidator(schema, 'params', 'validatedParams');
};

export const validarQuery = (schema) => {
  return createValidator(schema, 'query', 'validatedQuery');
};
