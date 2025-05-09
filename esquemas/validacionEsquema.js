import { object, string, boolean, minLength, maxLength, optional, pipe } from 'valibot';

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