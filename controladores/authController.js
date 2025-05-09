import usuarioRepo from '../repositorios/usuarioRepo.js';

export const login = async (req, res) => {
  const { username, password } = req.validatedBody;

  const user = await usuarioRepo.loginUser(username, password);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  res.setHeader('x-authorization', user.token);
  res.status(200).json({
    username: user.username,
    name: user.name,
    token: user.token
  });
};

export const logout = async (req, res) => {
  const token = req.headers['x-authorization'];
  
  const success = await usuarioRepo.logoutUser(token);
  if (!success) {
    return res.status(401).json({ error: 'Token inválido' });
  }
  
  res.status(204).send();
};