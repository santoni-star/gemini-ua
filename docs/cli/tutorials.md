# Навчальні посібники (Tutorials)

Ця сторінка містить покрокові інструкції для роботи з Gemini CLI.

## Налаштування сервера Model Context Protocol (MCP)

> [!CAUTION] Перед використанням стороннього сервера MCP переконайтеся, що ви
> довіряєте його джерелу та розумієте інструменти, які він надає. Ви
> використовуєте сторонні сервери на свій власний страх і ризик.

Цей посібник демонструє, як налаштувати сервер MCP на прикладі
[сервера GitHub MCP](https://github.com/github/github-mcp-server). Він надає
інструменти для роботи з репозиторіями GitHub, як-от створення issue або
коментування PR.

### Попередні вимоги

Перед початком переконайтеся, що у вас встановлено:

- **Docker:** Встановіть та запустіть [Docker](https://www.docker.com/).
- **GitHub Personal Access Token (PAT):** Створіть новий
  [classic](https://github.com/settings/tokens/new) або
  [fine-grained](https://github.com/settings/personal-access-tokens/new) токен з
  необхідними правами доступу.

### Посібник

#### 1. Налаштуйте сервер MCP у `settings.json`

У кореневому каталозі вашого проекту відкрийте файл
[`.gemini/settings.json`](../get-started/configuration.md). Додайте блок
конфігурації `mcpServers`:

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

#### 2. Встановіть ваш токен GitHub

> [!CAUTION] Використання токена з широкими правами доступу до приватних
> репозиторіїв може призвести до витоку інформації. Рекомендуємо використовувати
> "fine-grained" токени з обмеженим доступом.

Збережіть токен у змінну середовища:

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN="ваш_реальний_токен_тут"
```

#### 3. Запустіть Gemini CLI та перевірте з'єднання

При запуску Gemini CLI автоматично запустить сервер GitHub MCP у фоновому
режимі. Тепер ви можете використовувати звичайну мову для запитів:

```text
> "знайди всі відкриті issue, призначені на мене в репозиторії 'foo/bar', і розстав їх за пріоритетом"
```
