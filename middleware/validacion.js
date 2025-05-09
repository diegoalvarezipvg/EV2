import { safeParse } from 'valibot';

export const validarEsquema = (schema) => {
  return (req, res, next) => {
    try {
      const result = safeParse(schema, req.body);
      
      if (!result.success) {
        return res.status(400).json({
          error: 'Error de validación',
          details: result.issues.map(issue => ({
            path: issue.path?.map(p => p.key).join('.') || '',
            message: issue.message
          }))
        });
      }
      
      req.validatedBody = result.output;
      next();
    } catch (error) {
      console.error('Error de validación:', error);
      return res.status(500).json({
        error: 'Error interno en la validación',
        details: error.message || 'Ocurrió un error inesperado durante la validación'
      });
    }
  };
};
