import { PrismaClient } from '@prisma/client'
import { randomBytes, scrypt } from 'node:crypto';

const prisma = new PrismaClient();

const generateToken = () => randomBytes(48).toString('hex');

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
    return await prisma.usuario.findFirstOrThrow({
      where: { token }
    }).catch(() => null);
  },

  loginUser: async (username, password) => {
    if (!username || !password) return null;
    
    try {
      const user = await prisma.usuario.findUniqueOrThrow({
        where: { username }
      });

      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) return null;

      const token = generateToken();
      
      const updatedUser = await prisma.usuario.update({
        where: { id: user.id },
        data: { token },
        select: {
          username: true,
          name: true,
          token: true
        }
      });

      return updatedUser;
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  },

  logoutUser: async (token) => {
    if (!token) return false;
    
    try {
      await prisma.usuario.updateMany({
        where: { token },
        data: { token: null }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
};