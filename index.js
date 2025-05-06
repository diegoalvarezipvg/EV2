import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client';
import authRoutes from './rutas/authRoutes.js';
import recordatorioRoutes from './rutas/recordatorioRoutes.js';

// Inicializar la aplicación Express
const app = express();
const prisma = new PrismaClient();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rutas de la API
app.get("/", (req, res) => {
    res.send("API de Recordatorios - Evaluación 2");
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de recordatorios
app.use("/api/reminders", recordatorioRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3300;
app.listen(PORT, async () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    
    // Verificar la conexión a la base de datos
    try {
        await prisma.$connect();
        console.log('Conexión a la base de datos establecida correctamente');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        process.exit(1);
    }
});

// Cerrar la conexión de Prisma al finalizar
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});