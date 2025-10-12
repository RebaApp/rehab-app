const express = require('express');
const fetch = require('node-fetch');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;
const CACHE_DIR = path.join(__dirname, 'cache');
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 дней в миллисекундах

// Создаем директорию кэша если её нет
async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating cache directory:', error);
  }
}

// Генерируем ETag на основе URL
function generateETag(url) {
  return crypto.createHash('md5').update(url).digest('hex');
}

// Получаем путь к файлу в кэше
function getCachePath(url) {
  const hash = generateETag(url);
  return path.join(CACHE_DIR, `${hash}.jpg`);
}

// Проверяем, существует ли файл в кэше и не устарел ли он
async function isCacheValid(cachePath) {
  try {
    const stats = await fs.stat(cachePath);
    const now = Date.now();
    return (now - stats.mtime.getTime()) < CACHE_DURATION;
  } catch (error) {
    return false;
  }
}

// Загружаем изображение из интернета
async function fetchImage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
        'Accept': 'image/*'
      },
      timeout: 10000 // 10 секунд таймаут
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('Response is not an image');
    }

    return {
      buffer: await response.buffer(),
      contentType,
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag')
    };
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}

// Сохраняем изображение в кэш
async function saveToCache(cachePath, imageData) {
  try {
    await fs.writeFile(cachePath, imageData.buffer);
    console.log(`Image cached: ${cachePath}`);
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

// Загружаем изображение из кэша
async function loadFromCache(cachePath) {
  try {
    const buffer = await fs.readFile(cachePath);
    return buffer;
  } catch (error) {
    console.error('Error loading from cache:', error);
    return null;
  }
}

// Middleware для CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Основной роут для проксирования изображений
app.get('/proxy/:encodedUrl', async (req, res) => {
  try {
    const encodedUrl = req.params.encodedUrl;
    const originalUrl = decodeURIComponent(encodedUrl);
    
    // Проверяем, что URL безопасный (только Dropbox)
    if (!originalUrl.includes('dropboxusercontent.com')) {
      return res.status(400).json({ error: 'Only Dropbox URLs are allowed' });
    }

    const cachePath = getCachePath(originalUrl);
    const etag = generateETag(originalUrl);
    
    // Проверяем ETag в запросе
    const clientETag = req.headers['if-none-match'];
    if (clientETag === etag) {
      return res.status(304).end();
    }

    // Проверяем кэш
    if (await isCacheValid(cachePath)) {
      console.log('Serving from cache:', originalUrl);
      const cachedImage = await loadFromCache(cachePath);
      
      if (cachedImage) {
        res.set({
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=604800, immutable', // 7 дней
          'ETag': etag,
          'X-Cache': 'HIT'
        });
        return res.send(cachedImage);
      }
    }

    // Загружаем изображение из интернета
    console.log('Fetching from internet:', originalUrl);
    const imageData = await fetchImage(originalUrl);
    
    // Сохраняем в кэш
    await saveToCache(cachePath, imageData);
    
    // Отправляем изображение
    res.set({
      'Content-Type': imageData.contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=604800, immutable', // 7 дней
      'ETag': etag,
      'X-Cache': 'MISS',
      'Last-Modified': imageData.lastModified || new Date().toUTCString()
    });
    
    res.send(imageData.buffer);
    
  } catch (error) {
    console.error('Proxy error:', error);
    
    // Отправляем fallback изображение
    const fallbackPath = path.join(__dirname, 'fallback.jpg');
    try {
      const fallbackImage = await fs.readFile(fallbackPath);
      res.set({
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600', // 1 час для fallback
        'X-Cache': 'FALLBACK'
      });
      res.send(fallbackImage);
    } catch (fallbackError) {
      res.status(500).json({ error: 'Image not available' });
    }
  }
});

// Роут для очистки кэша
app.delete('/cache', async (req, res) => {
  try {
    const files = await fs.readdir(CACHE_DIR);
    let deletedCount = 0;
    
    for (const file of files) {
      if (file.endsWith('.jpg')) {
        await fs.unlink(path.join(CACHE_DIR, file));
        deletedCount++;
      }
    }
    
    res.json({ 
      message: `Cleared ${deletedCount} cached images`,
      deletedCount 
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

// Роут для статистики кэша
app.get('/cache/stats', async (req, res) => {
  try {
    const files = await fs.readdir(CACHE_DIR);
    let totalSize = 0;
    let validFiles = 0;
    
    for (const file of files) {
      if (file.endsWith('.jpg')) {
        const filePath = path.join(CACHE_DIR, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
        
        if (await isCacheValid(filePath)) {
          validFiles++;
        }
      }
    }
    
    res.json({
      totalFiles: files.filter(f => f.endsWith('.jpg')).length,
      validFiles,
      totalSizeBytes: totalSize,
      totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
      cacheDir: CACHE_DIR
    });
  } catch (error) {
    console.error('Cache stats error:', error);
    res.status(500).json({ error: 'Failed to get cache stats' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Запуск сервера
async function startServer() {
  await ensureCacheDir();
  
  app.listen(PORT, () => {
    console.log(`Image proxy server running on port ${PORT}`);
    console.log(`Cache directory: ${CACHE_DIR}`);
    console.log(`Cache duration: ${CACHE_DURATION / 1000 / 60 / 60 / 24} days`);
  });
}

// Обработка ошибок
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer().catch(console.error);

module.exports = app;


