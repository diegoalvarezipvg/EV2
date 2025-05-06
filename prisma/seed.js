import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Verificar si ya existe el usuario admin
    const existingAdmin = await prisma.usuario.findUnique({
      where: { username: 'admin' }
    });

    if (!existingAdmin) {
      // Crear el usuario administrador
      const adminUser = await prisma.usuario.create({
        data: {
          username: 'admin',
          name: 'Gustavo Alfredo Marín Sáez',
          // Usar la misma contraseña que en el archivo original
          password: '1b6ce880ac388eb7fcb6bcaf95e20083:341dfbbe86013c940c8e898b437aa82fe575876f2946a2ad744a0c51501c7dfe6d7e5a31c58d2adc7a7dc4b87927594275ca235276accc9f628697a4c00b4e01'
        }
      });

      console.log('Usuario administrador creado:', adminUser);
    } else {
      console.log('El usuario administrador ya existe');
    }
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });