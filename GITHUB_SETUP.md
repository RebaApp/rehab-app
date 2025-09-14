# Настройка GitHub репозитория

## Шаги для создания репозитория на GitHub:

1. **Перейдите на GitHub.com** и войдите в свой аккаунт

2. **Создайте новый репозиторий:**
   - Нажмите кнопку "New" или "+" в правом верхнем углу
   - Выберите "New repository"
   - Название репозитория: `reba-app`
   - Описание: `REBA - Мобильное приложение для поиска реабилитационных центров`
   - Выберите "Public" или "Private" по желанию
   - НЕ добавляйте README, .gitignore или лицензию (они уже есть)
   - Нажмите "Create repository"

3. **Подключите локальный репозиторий к GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/reba-app.git
   git branch -M main
   git push -u origin main
   ```

   Замените `YOUR_USERNAME` на ваш GitHub username.

## Альтернативный способ через GitHub CLI:

Если хотите установить GitHub CLI:
```bash
# macOS
brew install gh

# Затем авторизуйтесь
gh auth login

# Создайте репозиторий
gh repo create reba-app --public --description "REBA - Мобильное приложение для поиска реабилитационных центров"

# Подключите и отправьте код
git remote add origin https://github.com/YOUR_USERNAME/reba-app.git
git push -u origin main
```

## После создания репозитория:

1. **Скопируйте URL репозитория** для дальнейшего использования
2. **Обновите README.md** если нужно добавить ссылку на репозиторий
3. **Настройте GitHub Pages** если планируете хостить веб-версию

## Структура репозитория:

```
reba-app/
├── App.js                 # Основной компонент
├── firebaseConfig.js      # Конфигурация Firebase
├── package.json           # Зависимости
├── app.json              # Конфигурация Expo
├── README.md             # Документация
├── .gitignore            # Игнорируемые файлы
├── assets/               # Изображения и иконки
└── components/           # Дополнительные компоненты
```
