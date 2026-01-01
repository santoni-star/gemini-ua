# Налаштування Gemini CLI (команда `/settings`)

Керуйте своїм досвідом роботи з Gemini CLI за допомогою команди `/settings`.
Команда `/settings` відкриває діалогове вікно для перегляду та редагування всіх
ваших налаштувань Gemini CLI, включаючи інтерфейс користувача, гарячі клавіші та
функції доступності.

Ваші налаштування Gemini CLI зберігаються у файлі `settings.json`. Окрім
використання команди `/settings`, ви також можете редагувати їх вручну за
наступними шляхами:

- **Налаштування користувача**: `~/.gemini/settings.json`
- **Налаштування робочого простору**: `ваш-проект/.gemini/settings.json`

Примітка: Налаштування робочого простору мають пріоритет над налаштуваннями
користувача.

## Довідник налаштувань

Нижче наведено список усіх доступних налаштувань, згрупованих за категоріями та
впорядкованих так, як вони з'являються в інтерфейсі.

### Загальні (General)

| Назва в інтерфейсі              | Параметр                           | Опис                                                                      | За замовчуванням |
| ------------------------------- | ---------------------------------- | ------------------------------------------------------------------------- | ---------------- |
| Preview Features (e.g., models) | `general.previewFeatures`          | Увімкнути попередні функції (наприклад, моделі в попередньому перегляді). | `false`          |
| Vim Mode                        | `general.vimMode`                  | Увімкнути клавіші Vim.                                                    | `false`          |
| Disable Auto Update             | `general.disableAutoUpdate`        | Вимкнути автоматичні оновлення.                                           | `false`          |
| Enable Prompt Completion        | `general.enablePromptCompletion`   | Увімкнути автодоповнення підказок ШІ під час введення.                    | `false`          |
| Debug Keystroke Logging         | `general.debugKeystrokeLogging`    | Увімкнути налагоджувальний журнал натискань клавіш у консоль.             | `false`          |
| Session Retention               | `general.sessionRetention`         | Налаштування автоматичного очищення сесій. За замовчуванням вимкнено.     | `undefined`      |
| Enable Session Cleanup          | `general.sessionRetention.enabled` | Увімкнути автоматичне очищення сесій.                                     | `false`          |

### Вивід (Output)

| Назва в інтерфейсі | Параметр        | Опис                                            | За замовчуванням |
| ------------------ | --------------- | ----------------------------------------------- | ---------------- |
| Output Format      | `output.format` | Формат виводу CLI. Може бути `text` або `json`. | `text`           |

### Інтерфейс (UI)

| Назва в інтерфейсі             | Параметр                                 | Опис                                                                 | За замовчуванням |
| ------------------------------ | ---------------------------------------- | -------------------------------------------------------------------- | ---------------- |
| Hide Window Title              | `ui.hideWindowTitle`                     | Приховати рядок заголовка вікна.                                     | `false`          |
| Show Status in Title           | `ui.showStatusInTitle`                   | Показувати статус та "думки" Gemini CLI у заголовку вікна терміналу. | `false`          |
| Hide Tips                      | `ui.hideTips`                            | Приховати поради в інтерфейсі.                                       | `false`          |
| Hide Banner                    | `ui.hideBanner`                          | Приховати банер програми.                                            | `false`          |
| Hide Context Summary           | `ui.hideContextSummary`                  | Приховати підсумок контексту (GEMINI.md, сервери MCP) над вводом.    | `false`          |
| Hide CWD                       | `ui.footer.hideCWD`                      | Приховати шлях до поточної робочої директорії у футері.              | `false`          |
| Hide Sandbox Status            | `ui.footer.hideSandboxStatus`            | Приховати індикатор статусу пісочниці у футері.                      | `false`          |
| Hide Model Info                | `ui.footer.hideModelInfo`                | Приховати назву моделі та використання контексту у футері.           | `false`          |
| Hide Context Window Percentage | `ui.footer.hideContextPercentage`        | Приховує відсоток залишку вікна контексту.                           | `true`           |
| Hide Footer                    | `ui.hideFooter`                          | Приховати нижній колонтитул (футер).                                 | `false`          |
| Show Memory Usage              | `ui.showMemoryUsage`                     | Відображати інформацію про використання пам'яті.                     | `false`          |
| Show Line Numbers              | `ui.showLineNumbers`                     | Показувати номери рядків у чаті.                                     | `false`          |
| Show Citations                 | `ui.showCitations`                       | Показувати цитати для згенерованого тексту в чаті.                   | `false`          |
| Use Full Width                 | `ui.useFullWidth`                        | Використовувати всю ширину терміналу для виводу.                     | `true`           |
| Use Alternate Screen Buffer    | `ui.useAlternateBuffer`                  | Використовувати альтернативний буфер екрана для збереження історії.  | `true`           |
| Disable Loading Phrases        | `ui.accessibility.disableLoadingPhrases` | Вимкнути фрази завантаження для кращої доступності.                  | `false`          |
| Screen Reader Mode             | `ui.accessibility.screenReader`          | Рендерити вивід простим текстом для зчитувачів екрана.               | `false`          |

### IDE

| Назва в інтерфейсі | Параметр      | Опис                              | За замовчуванням |
| ------------------ | ------------- | --------------------------------- | ---------------- |
| IDE Mode           | `ide.enabled` | Увімкнути режим інтеграції з IDE. | `false`          |

### Модель (Model)

| Назва в інтерфейсі      | Параметр                     | Опис                                                                            | За замовчуванням |
| ----------------------- | ---------------------------- | ------------------------------------------------------------------------------- | ---------------- |
| Max Session Turns       | `model.maxSessionTurns`      | Максимальна кількість обмінів повідомленнями у сесії. -1 — без обмежень.        | `-1`             |
| Compression Threshold   | `model.compressionThreshold` | Поріг використання контексту, при якому запускається стиснення (наприклад 0.2). | `0.2`            |
| Skip Next Speaker Check | `model.skipNextSpeakerCheck` | Пропустити перевірку наступного мовця.                                          | `true`           |

### Контекст (Context)

| Назва в інтерфейсі                   | Параметр                                          | Опис                                                                                                      | За замовчуванням |
| ------------------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------- |
| Memory Discovery Max Dirs            | `context.discoveryMaxDirs`                        | Максимальна кількість каталогів для пошуку файлів пам'яті.                                                | `200`            |
| Load Memory From Include Directories | `context.loadMemoryFromIncludeDirectories`        | Керує тим, як `/memory refresh` завантажує файли GEMINI.md. Якщо true — скануються всі включені каталоги. | `false`          |
| Respect .gitignore                   | `context.fileFiltering.respectGitIgnore`          | Враховувати файли .gitignore при пошуку.                                                                  | `true`           |
| Respect .geminiignore                | `context.fileFiltering.respectGeminiIgnore`       | Враховувати файли .geminiignore при пошуку.                                                               | `true`           |
| Enable Recursive File Search         | `context.fileFiltering.enableRecursiveFileSearch` | Увімкнути функцію рекурсивного пошуку файлів при автодоповненні посилань @.                               | `true`           |
| Disable Fuzzy Search                 | `context.fileFiltering.disableFuzzySearch`        | Вимкнути нечіткий пошук при пошуку файлів.                                                                | `false`          |

### Інструменти (Tools)

| Назва в інтерфейсі               | Параметр                             | Опис                                                                          | За замовчуванням |
| -------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------- | ---------------- |
| Enable Interactive Shell         | `tools.shell.enableInteractiveShell` | Використовувати node-pty для інтерактивної оболонки.                          | `true`           |
| Show Color                       | `tools.shell.showColor`              | Показувати кольори у виводі оболонки.                                         | `false`          |
| Auto Accept                      | `tools.autoAccept`                   | Автоматично приймати безпечні виклики інструментів (тільки для читання).      | `false`          |
| Use Ripgrep                      | `tools.useRipgrep`                   | Використовувати ripgrep для пошуку вмісту файлів (швидше).                    | `true`           |
| Enable Tool Output Truncation    | `tools.enableToolOutputTruncation`   | Увімкнути обрізання великих виводів інструментів.                             | `true`           |
| Tool Output Truncation Threshold | `tools.truncateToolOutputThreshold`  | Обрізати вивід, якщо він перевищує вказану кількість символів. -1 — вимкнути. | `10000`          |
| Tool Output Truncation Lines     | `tools.truncateToolOutputLines`      | Кількість рядків, які слід залишати при обрізанні виводу.                     | `100`            |

### Безпека (Security)

| Назва в інтерфейсі            | Параметр                                        | Опис                                                          | За замовчуванням |
| ----------------------------- | ----------------------------------------------- | ------------------------------------------------------------- | ---------------- |
| Disable YOLO Mode             | `security.disableYoloMode`                      | Вимкнути режим YOLO (автосхвалення), навіть якщо він заданий. | `false`          |
| Blocks extensions from Git    | `security.blockGitExtensions`                   | Блокувати встановлення та завантаження розширень із Git.      | `false`          |
| Folder Trust                  | `security.folderTrust.enabled`                  | Відстежувати, чи увімкнена довіра до папок.                   | `false`          |
| Allowed Environment Variables | `security.environmentVariableRedaction.allowed` | Змінні середовища, які завжди дозволені (без приховування).   | `[]`             |
| Blocked Environment Variables | `security.environmentVariableRedaction.blocked` | Змінні середовища, які завжди будуть приховані (redacted).    | `[]`             |

### Експериментальні (Experimental)

| Назва в інтерфейсі                  | Параметр                                                | Опис                                                            | За замовчуванням |
| ----------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------- | ---------------- |
| Enable Codebase Investigator        | `experimental.codebaseInvestigatorSettings.enabled`     | Увімкнути агента Codebase Investigator.                         | `true`           |
| Codebase Investigator Max Num Turns | `experimental.codebaseInvestigatorSettings.maxNumTurns` | Максимальна кількість обмінів для агента Codebase Investigator. | `10`             |
