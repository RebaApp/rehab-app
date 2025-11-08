/**
 * Скрипт для применения индексов к локальной БД
 * 
 * Использование:
 *   cd server
 *   node apply-indexes.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function applyIndexes() {
  console.log('🚀 Начинаем применение индексов...\n');

  try {
    // Читаем SQL файл
    const sqlPath = path.join(__dirname, 'prisma/migrations/add_indexes.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ Файл миграции не найден:', sqlPath);
      process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Разделяем SQL на отдельные команды
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => {
        // Убираем пустые строки и комментарии
        return cmd && 
               !cmd.startsWith('--') && 
               cmd.length > 0 &&
               !cmd.match(/^\s*$/);
      });
    
    console.log(`📋 Найдено команд: ${commands.length}\n`);

    // Применяем каждую команду
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      // Пропускаем COMMENT команды (они могут не поддерживаться)
      if (command.toUpperCase().startsWith('COMMENT')) {
        console.log(`⏭️  Пропущено (комментарий): ${command.substring(0, 60)}...`);
        continue;
      }

      try {
        await prisma.$executeRawUnsafe(command);
        
        // Извлекаем название индекса для красивого вывода
        const indexMatch = command.match(/CREATE INDEX.*?"(\w+)"/i);
        const indexName = indexMatch ? indexMatch[1] : 'индекс';
        
        console.log(`✅ [${i + 1}/${commands.length}] Применен: ${indexName}`);
      } catch (error) {
        // Если индекс уже существует (IF NOT EXISTS), это нормально
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate key')) {
          console.log(`ℹ️  [${i + 1}/${commands.length}] Уже существует: ${command.match(/CREATE INDEX.*?"(\w+)"/i)?.[1] || 'индекс'}`);
        } else {
          console.error(`❌ [${i + 1}/${commands.length}] Ошибка:`, error.message);
          console.error(`   Команда: ${command.substring(0, 100)}...`);
        }
      }
    }
    
    console.log('\n✅ Все индексы успешно применены!');
    console.log('\n📊 Проверка индексов...\n');

    // Проверяем созданные индексы
    const centersIndexes = await prisma.$queryRaw`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'centers'
      AND indexname LIKE '%_idx'
      ORDER BY indexname;
    `;

    const reviewsIndexes = await prisma.$queryRaw`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'reviews'
      AND indexname LIKE '%_idx'
      ORDER BY indexname;
    `;

    console.log('📋 Индексы для таблицы centers:');
    if (centersIndexes.length > 0) {
      centersIndexes.forEach(idx => {
        console.log(`   ✅ ${idx.indexname}`);
      });
    } else {
      console.log('   ⚠️  Индексы не найдены');
    }

    console.log('\n📋 Индексы для таблицы reviews:');
    if (reviewsIndexes.length > 0) {
      reviewsIndexes.forEach(idx => {
        console.log(`   ✅ ${idx.indexname}`);
      });
    } else {
      console.log('   ⚠️  Индексы не найдены');
    }

    console.log('\n🎉 Готово! Индексы применены и проверены.');

  } catch (error) {
    console.error('\n❌ Критическая ошибка:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем
applyIndexes();


