/**
 * Prisma Client Singleton
 * 
 * Создает единственный экземпляр PrismaClient для всего приложения.
 * Это предотвращает утечки соединений и обеспечивает правильный connection pooling.
 * 
 * Использование:
 *   const prisma = require('./utils/prisma');
 *   const users = await prisma.user.findMany();
 */

const { PrismaClient } = require('@prisma/client');

// Создаем единственный экземпляр PrismaClient
const prisma = new PrismaClient({
  // Логирование запросов в development режиме
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
  
  // Настройки connection pooling
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Обработка graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Обработка ошибок подключения
prisma.$on('error', (e) => {
  console.error('Prisma Client Error:', e);
});

module.exports = prisma;


