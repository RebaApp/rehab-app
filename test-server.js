const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Статические файлы
app.use(express.static('public'));

// Главная страница
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>REBA - Тест авторизации</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .container { max-width: 600px; margin: 0 auto; }
            .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
            .success { background: #d4edda; color: #155724; }
            .error { background: #f8d7da; color: #721c24; }
            .info { background: #d1ecf1; color: #0c5460; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 REBA - Тест авторизации</h1>
            
            <div class="status success">
                ✅ Сервер запущен на порту ${PORT}
            </div>
            
            <div class="status info">
                📋 Конфигурация Яндекс OAuth:
                <ul>
                    <li>Client ID: b08282bbc8e8435d88e7c02b2098496f</li>
                    <li>Client Secret: ba5c7710a1fa4cd58ecccbacc514c890</li>
                    <li>Redirect URI: reba://auth</li>
                </ul>
            </div>
            
            <div class="status info">
                🔧 Для тестирования авторизации:
                <ol>
                    <li>Откройте приложение в симуляторе</li>
                    <li>Перейдите во вкладку "Профиль"</li>
                    <li>Нажмите "Вход"</li>
                    <li>Нажмите "Войти через Яндекс"</li>
                </ol>
            </div>
            
            <div class="status error">
                ⚠️ Проблема: Node.js v22 несовместим с Expo
                <br>Решение: Используйте Node.js v18 или запустите через Docker
            </div>
        </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log('📱 Откройте приложение в симуляторе для тестирования авторизации');
});

