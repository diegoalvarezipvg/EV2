import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default {
  listarRecordatorios: async () => {
    const recordatorios = await prisma.recordatorio.findMany();
    
    return recordatorios.sort((a, b) => {
      if (a.important !== b.important) {
        return b.important - a.important;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  obtenerRecordatorio: async (id) => {
    return await prisma.recordatorio.findUnique({
      where: { id }
    });
  },

  crearRecordatorio: async (data) => {
    return await prisma.recordatorio.create({
      data: {
        content: data.content.trim(),
        important: data.important || false
      }
    });
  },

  actualizarRecordatorio: async (id, data) => {
    const recordatorio = await prisma.recordatorio.findUnique({
      where: { id }
    });

    if (!recordatorio) return null;

    const updateData = {};
    
    if (data.content !== undefined) {
      updateData.content = data.content.trim();
    }
    
    if (data.important !== undefined) {
      updateData.important = data.important;
    }

    if (Object.keys(updateData).length === 0) {
      return recordatorio;
    }

    return await prisma.recordatorio.update({
      where: { id },
      data: updateData
    });
  },

  eliminarRecordatorio: async (id) => {
    const recordatorio = await prisma.recordatorio.findUnique({
      where: { id }
    });

    if (!recordatorio) return false;

    await prisma.recordatorio.delete({
      where: { id }
    });

    return true;
  }
};