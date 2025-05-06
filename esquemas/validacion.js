import { object, string, boolean, minLength, maxLength, optional, safeParse, pipe } from 'valibot';

export const loginSchema = object({
  username: pipe(
    string('El nombre de usuario debe ser texto'),
    minLength(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    maxLength(50, 'El nombre de usuario no puede exceder los 50 caracteres')
  ),
  password: pipe(
    string('La contraseña debe ser texto'),
    minLength(6, 'La contraseña debe tener al menos 6 caracteres'),
    maxLength(100, 'La contraseña no puede exceder los 100 caracteres')
  ),
  remember: optional(boolean('El campo recordar debe ser un valor booleano'))
});

export const recordatorioCreacionSchema = object({
  content: pipe(
    string('El contenido debe ser texto'),
    minLength(1, 'El contenido es requerido'),
    maxLength(200, 'El contenido no puede exceder los 200 caracteres')
  ),
  important: optional(boolean('El campo importante debe ser un valor booleano')),
});

export const recordatorioActualizacionSchema = object({
  content: optional(
    pipe(
      string('El contenido debe ser texto'),
      minLength(1, 'El contenido no puede estar vacío'),
      maxLength(200, 'El contenido no puede exceder los 200 caracteres')
    )
  ),
  important: optional(boolean('El campo importante debe ser un valor booleano')),
});

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

// Esquema para validar parámetros de consulta (query params)
export const validarQueryParams = (schema) => {
  return (req, res, next) => {
    try {
      const result = safeParse(schema, req.query);
      
      if (!result.success) {
        return res.status(400).json({
          error: 'Parámetros de consulta inválidos',
          details: result.issues.map(issue => ({
            path: issue.path?.map(p => p.key).join('.') || '',
            message: issue.message
          }))
        });
      }
      
      req.validatedQuery = result.output;
      next();
    } catch (error) {
      console.error('Error de validación en query params:', error);
      return res.status(500).json({
        error: 'Error interno en la validación',
        details: error.message || 'Ocurrió un error inesperado durante la validación'
      });
    }
  };
};

// Esquema para validar parámetros de ruta (route params)
export const validarRouteParams = (schema) => {
  return (req, res, next) => {
    try {
      const result = safeParse(schema, req.params);
      
      if (!result.success) {
        return res.status(400).json({
          error: 'Parámetros de ruta inválidos',
          details: result.issues.map(issue => ({
            path: issue.path?.map(p => p.key).join('.') || '',
            message: issue.message
          }))
        });
      }
      
      req.validatedParams = result.output;
      next();
    } catch (error) {
      console.error('Error de validación en route params:', error);
      return res.status(500).json({
        error: 'Error interno en la validación',
        details: error.message || 'Ocurrió un error inesperado durante la validación'
      });
    }
  };
};