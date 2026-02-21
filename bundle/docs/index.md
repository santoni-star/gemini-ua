# Документація Gemini CLI

Gemini CLI надає потужність моделей Gemini безпосередньо у ваш термінал. Використовуйте його
для аналізу коду, автоматизації завдань і створення робочих процесів із контекстом локального проєкту.

## Встановлення

```bash
npm install -g @google/gemini-cli
```

## Початок роботи

Приступайте до роботи з Gemini CLI.

- **[Швидкий старт](./get-started/index.md):** Ваш перший сеанс із Gemini CLI.
- **[Встановлення](./get-started/installation.md):** Як встановити Gemini CLI
  на вашій системі.
- **[Автентифікація](./get-started/authentication.md):** Інструкції з налаштування для
  особистих і корпоративних облікових записів.
- **[Приклади](./get-started/examples.md):** Практичні приклади використання Gemini CLI.
- **[Шпаргалка](./cli/cli-reference.md):** Швидка довідка з основних команд і параметрів.

## Використання Gemini CLI

Орієнтовані на користувача посібники та навчальні матеріали для щоденних робочих процесів розробки.

- **[Керування файлами](./cli/tutorials/file-management.md):** Як працювати з
  локальними файлами та каталогами.
- **[Керування контекстом і пам'яттю](./cli/tutorials/memory-management.md):**
  Керування постійними інструкціями та фактами.
- **[Виконання команд оболонки](./cli/tutorials/shell-commands.md):** Безпечне виконання
  системних команд.
- **[Керування сеансами та історією](./cli/tutorials/session-management.md):**
  Відновлення, керування та перемотування розмов.
- **[Планування завдань із todos](./cli/tutorials/task-planning.md):** Використання todos для
  складних робочих процесів.
- **[Вебпошук і отримання даних](./cli/tutorials/web-tools.md):** Пошук і
  отримання вмісту з вебу.
- **[Початок роботи з навичками](./cli/tutorials/skills-getting-started.md):**
  Початок роботи зі спеціалізованою експертизою.

## Функції

Технічна довідкова документація для кожної можливості Gemini CLI.

- **[/about](./cli/commands.md#about):** Про Gemini CLI.
- **[/auth](./get-started/authentication.md):** Автентифікація.
- **[/bug](./cli/commands.md#bug):** Повідомити про помилку.
- **[/chat](./cli/commands.md#chat):** Історія чату.
- **[/clear](./cli/commands.md#clear):** Очистити екран.
- **[/compress](./cli/commands.md#compress):** Стиснути контекст.
- **[/copy](./cli/commands.md#copy):** Копіювати вивід.
- **[/directory](./cli/commands.md#directory-or-dir):** Керування робочим простором.
- **[/docs](./cli/commands.md#docs):** Відкрити документацію.
- **[/editor](./cli/commands.md#editor):** Вибрати редактор.
- **[/extensions](./extensions/index.md):** Керування розширеннями.
- **[/help](./cli/commands.md#help-or):** Показати довідку.
- **[/hooks](./hooks/index.md):** Хуки.
- **[/ide](./ide-integration/index.md):** Інтеграція з IDE.
- **[/init](./cli/commands.md#init):** Ініціалізувати контекст.
- **[/mcp](./tools/mcp-server.md):** MCP-сервери.
- **[/memory](./cli/commands.md#memory):** Керування пам'яттю.
- **[/model](./cli/model.md):** Вибір моделі.
- **[/policies](./cli/commands.md#policies):** Керування політиками.
- **[/privacy](./cli/commands.md#privacy):** Повідомлення про конфіденційність.
- **[/quit](./cli/commands.md#quit-or-exit):** Вийти з CLI.
- **[/restore](./cli/checkpointing.md):** Відновити файли.
- **[/resume](./cli/commands.md#resume):** Відновити сеанс.
- **[/rewind](./cli/rewind.md):** Перемотування.
- **[/settings](./cli/settings.md):** Налаштування.
- **[/setup-github](./cli/commands.md#setup-github):** Налаштування GitHub.
- **[/shells](./cli/commands.md#shells-or-bashes):** Керування процесами.
- **[/skills](./cli/skills.md):** Навички агента.
- **[/stats](./cli/commands.md#stats):** Статистика сеансу.
- **[/terminal-setup](./cli/commands.md#terminal-setup):** Комбінації клавіш термінала.
- **[/theme](./cli/themes.md):** Теми.
- **[/tools](./cli/commands.md#tools):** Список інструментів.
- **[/vim](./cli/commands.md#vim):** Режим Vim.
- **[Activate skill (інструмент)](./tools/activate-skill.md):** Внутрішній механізм для
  завантаження експертних процедур.
- **[Ask user (інструмент)](./tools/ask-user.md):** Внутрішня діалогова система для
  уточнення.
- **[Checkpointing](./cli/checkpointing.md):** Автоматичні знімки сеансу.
- **[File system (інструмент)](./tools/file-system.md):** Технічні деталі для локальних
  файлових операцій.
- **[Headless mode](./cli/headless.md):** Програмний і скриптовий інтерфейс.
- **[Internal documentation (інструмент)](./tools/internal-docs.md):** Технічний
  довідник з функцій CLI.
- **[Memory (інструмент)](./tools/memory.md):** Деталі зберігання для постійних фактів.
- **[Model routing](./cli/model-routing.md):** Автоматичне резервне перемикання.
- **[Plan mode (експериментально)](./cli/plan-mode.md):** Використання безпечного режиму
  тільки для читання для планування складних змін.
- **[Sandboxing](./cli/sandbox.md):** Ізоляція виконання інструментів.
- **[Shell (інструмент)](./tools/shell.md):** Детальні параметри системного виконання.
- **[Telemetry](./cli/telemetry.md):** Деталі метрик використання та продуктивності.
- **[Todo (інструмент)](./tools/todos.md):** Специфікація відстеження прогресу.
- **[Token caching](./cli/token-caching.md):** Оптимізація продуктивності.
- **[Web fetch (інструмент)](./tools/web-fetch.md):** Деталі отримання та вилучення URL.
- **[Web search (інструмент)](./tools/web-search.md):** Технічні деталі інтеграції
  з Пошуком Google.

## Конфігурація

Налаштування та параметри кастомізації для Gemini CLI.

- **[Користувацькі команди](./cli/custom-commands.md):** Персоналізовані скорочення.
- **[Корпоративна конфігурація](./cli/enterprise.md):** Контроль професійного середовища.
- **[Файли ігнорування (.geminiignore)](./cli/gemini-ignore.md):** Довідник шаблонів виключень.
- **[Конфігурація моделі](./cli/generation-settings.md):** Точне налаштування параметрів генерації,
  таких як температура та бюджет мислення.
- **[Контекст проєкту (GEMINI.md)](./cli/gemini-md.md):** Технічна ієрархія файлів контексту.
- **[Налаштування](./cli/settings.md):** Повний довідник з конфігурації.
- **[Перевизначення системного запиту](./cli/system-prompt.md):** Логіка заміни інструкцій.
- **[Теми](./cli/themes.md):** Технічний посібник з персоналізації UI.
- **[Довірені теки](./cli/trusted-folders.md):** Логіка дозволів безпеки.

## Довідка

Глибока технічна документація та специфікації API.

- **[Огляд архітектури](./architecture.md):** Системний дизайн і компоненти.
- **[Довідник команд](./cli/commands.md):** Детальний посібник з slash-команд.
- **[Довідник з конфігурації](./get-started/configuration.md):** Налаштування та
  змінні середовища.
- **[Основні поняття](./core/concepts.md):** Фундаментальна термінологія та
  визначення.
- **[Комбінації клавіш](./cli/keyboard-shortcuts.md):** Поради щодо продуктивності.
- **[Механізм політик](./core/policy-engine.md):** Тонке керування виконанням.

## Ресурси

Підтримка, історія випусків і юридична інформація.

- **[Поширені запитання](./faq.md):** Відповіді на поширені запитання.
- **[Журнали змін](./changelogs/index.md):** Основні та помітні зміни.
- **[Квоти та ціни](./quota-and-pricing.md):** Деталі обмежень і білінгу.
- **[Умови та конфіденційність](./tos-privacy.md):** Офіційні повідомлення та умови.
