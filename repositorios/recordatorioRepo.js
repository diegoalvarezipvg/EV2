import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default {
  listarRecordatorios: async () => {
    return await prisma.recordatorio.findMany({
      orderBy: [
        { important: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  },

  obtenerRecordatorio: async (id) => {
    return await prisma.recordatorio.findUniqueOrThrow({
      where: { id }
    });
  },

  crearRecordatorio: async (data) => {
    return await prisma.recordatorio.create({
      data: {
        content: data.content.trim(),
        important: data.important ?? false
      }
    });
  },

  actualizarRecordatorio: async (id, data) => {
    const updateData = {
      ...(data.content !== undefined && { content: data.content.trim() }),
      ...(data.important !== undefined && { important: data.important })
    };

    if (Object.keys(updateData).length === 0) {
      return await prisma.recordatorio.findUniqueOrThrow({
        where: { id }
      });
    }

    return await prisma.recordatorio.update({
      where: { id },
      data: updateData
    });
  },

  eliminarRecordatorio: async (id) => {
    try {
      await prisma.recordatorio.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }
};