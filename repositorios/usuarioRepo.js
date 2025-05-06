import { PrismaClient } from '@prisma/client'
import { randomBytes, scrypt } from 'node:crypto';

const prisma = new PrismaClient();

const generateToken = () => {
  return randomBytes(48).toString('hex');
};

const verifyPassword = async (password, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hashedPassword.split(':');
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex') === key);
    });
  });
};

export default {
  getUserByToken: async (token) => {
    if (!token) return null;
    return await prisma.usuario.findFirst({
      where: { token }
    });
  },

  loginUser: async (username, password) => {
    if (!username || !password) return null;
    
    const user = await prisma.usuario.findUnique({
      where: { username }
    });

    if (!user) return null;

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) return null;

    const token = generateToken();
    
    const updatedUser = await prisma.usuario.update({
      where: { id: user.id },
      data: { token }
    });

    return {
      username: updatedUser.username,
      name: updatedUser.name,
      token: updatedUser.token
    };
  },

  logoutUser: async (token) => {
    if (!token) return false;
    
    const user = await prisma.usuario.findFirst({
      where: { token }
    });

    if (!user) return false;

    await prisma.usuario.update({
      where: { id: user.id },
      data: { token: null }
    });

    return true;
  }
};