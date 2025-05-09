import { PrismaClient } from '@prisma/client';
import { randomBytes, scrypt } from 'node:crypto';

const prisma = new PrismaClient();

const hashPassword = async (password) => {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex');
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
};

async function main() {
  try {
    console.log('Iniciando proceso de seeding...');

    // Crear usuario de prueba
    console.log('Creando/actualizando usuario admin...');
    const hashedPassword = await hashPassword('certamen123');
    const admin = await prisma.usuario.upsert({
      where: { username: 'admin' },
      update: {
        password: hashedPassword,
        name: 'Administrador'
      },
      create: {
        username: 'admin',
        name: 'Administrador',
        password: hashedPassword
      }
    });
    console.log('Usuario admin procesado:', admin.username);

    // Crear recordatorios de ejemplo solo si no existen
    console.log('Verificando recordatorios existentes...');
    const recordatoriosExistentes = await prisma.recordatorio.count();
    
    if (recordatoriosExistentes === 0) {
      console.log('Creando recordatorios iniciales...');
      const recordatorios = await Promise.all([
        prisma.recordatorio.create({
          data: {
            content: 'Completar la documentación del proyecto',
            important: true
          }
        }),
        prisma.recordatorio.create({
          data: {
            content: 'Revisar pull requests pendientes',
            important: false
          }
        }),
        prisma.recordatorio.create({
          data: {
            content: 'Preparar presentación para la reunión de equipo',
            important: true
          }
        })
      ]);
      console.log('Recordatorios creados:', recordatorios.length);
    } else {
      console.log('Los recordatorios ya existen, omitiendo creación');
    }

    const totalRecordatorios = await prisma.recordatorio.count();
    console.log('Total de recordatorios en la base de datos:', totalRecordatorios);

  } catch (error) {
    console.error('Error durante el seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('Conexión a la base de datos cerrada');
  }
}

main();