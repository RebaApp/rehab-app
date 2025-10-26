# 🤝 Руководство по вкладу в проект РЕБА

Спасибо за интерес к проекту РЕБА! Мы приветствуем любой вклад в развитие платформы.

## 🚀 Быстрый старт

1. **Fork** репозитория
2. **Clone** вашу копию: `git clone https://github.com/YOUR_USERNAME/rehab-app.git`
3. **Создайте ветку**: `git checkout -b feature/amazing-feature`
4. **Внесите изменения** и закоммитьте: `git commit -m 'Add amazing feature'`
5. **Push** в вашу ветку: `git push origin feature/amazing-feature`
6. **Создайте Pull Request**

## 📋 Типы вкладов

### 🐛 Исправление ошибок
- Создайте Issue с описанием проблемы
- Используйте шаблон "Bug Report"
- Приложите скриншоты и логи

### ✨ Новые функции
- Обсудите идею в Discussions
- Создайте Issue с описанием функции
- Следуйте архитектуре проекта

### 📚 Документация
- Улучшение README
- Добавление комментариев в код
- Создание руководств пользователя

### 🧪 Тестирование
- Написание unit тестов
- E2E тестирование
- Тестирование производительности

## 🎯 Стандарты кода

### TypeScript
```typescript
// ✅ Хорошо
interface User {
  id: string;
  email: string;
  name: string;
}

// ❌ Плохо
const user = { id: 1, email: "test", name: "test" };
```

### React Native
```typescript
// ✅ Хорошо
const ProfileScreen: React.FC<ProfileScreenProps> = memo(({ user }) => {
  return <View style={styles.container}>...</View>;
});

// ❌ Плохо
function ProfileScreen(user) {
  return <div>...</div>;
}
```

### Стили
```typescript
// ✅ Хорошо
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: responsivePadding(16),
  },
});

// ❌ Плохо
const styles = {
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
};
```

## 🔍 Процесс ревью

1. **Автоматические проверки** - CI/CD pipeline
2. **Code review** - минимум 2 аппрува
3. **Тестирование** - все тесты должны проходить
4. **Документация** - обновление при необходимости

## 📝 Коммиты

Используйте конвенцию [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: добавить авторизацию через Яндекс
fix: исправить ошибку в ProfileScreen
docs: обновить README
style: форматирование кода
refactor: рефакторинг store
test: добавить тесты для authService
```

## 🏷️ Создание Issues

### Шаблон для багов
```markdown
## 🐛 Описание ошибки
Краткое описание проблемы

## 🔄 Шаги воспроизведения
1. Перейти в '...'
2. Нажать на '...'
3. Увидеть ошибку

## 📱 Окружение
- OS: iOS/Android
- Версия: 0.72
- Устройство: iPhone/Android

## 📸 Скриншоты
Приложите скриншоты если возможно
```

### Шаблон для функций
```markdown
## ✨ Описание функции
Краткое описание новой функции

## 🎯 Проблема
Какую проблему решает эта функция?

## 💡 Предлагаемое решение
Как вы предлагаете реализовать?

## 🔄 Альтернативы
Какие альтернативы рассматривались?
```

## 🎉 Признание

Все участники будут упомянуты в:
- README файле
- Release notes
- Специальной странице благодарностей

## ❓ Вопросы?

Если у вас есть вопросы, создайте Discussion или напишите в Telegram: @reba_support

---

**Спасибо за ваш вклад в РЕБА! 🚀**
