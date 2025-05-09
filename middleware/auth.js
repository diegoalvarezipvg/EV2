import usuarioRepo from '../repositorios/usuarioRepo.js';

export const verifyAuth = async (req, res, next) => {
  const token = req.headers['x-authorization'];
  
  if (!token) {
    return res.status(401).json({ error: 'No se proporcionó token' });
  }
  
  const user = await usuarioRepo.getUserByToken(token);
  
  if (!user) {
    return res.status(401).json({ error: 'Token inválido' });
  }
  
  req.user = user;
  next();
};