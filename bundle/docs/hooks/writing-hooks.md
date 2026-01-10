# Написання хуків для Gemini CLI

Цей посібник проведе вас через процес створення хуків: від простого логування до
складного асистента робочого процесу.

## Швидкий старт

Створимо простий хук, який записує назву кожного інструменту, що виконується.

### Крок 1: Скрипт хука

Створіть папку та файл скрипта:

```bash
mkdir -p .gemini/hooks
cat > .gemini/hooks/log-tools.sh << 'EOF'
#!/usr/bin/env bash
input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name')
echo "[$(date)] Виконано інструмент: $tool_name" >> .gemini/tool-log.txt
echo "Записано: $tool_name"
EOF
chmod +x .gemini/hooks/log-tools.sh
```

### Крок 2: Налаштування

Додайте конфігурацію у `.gemini/settings.json`:

```json
{
  "hooks": {
    "AfterTool": [
      {
        "matcher": "*",
        "hooks": [
          {
            "name": "tool-logger",
            "type": "command",
            "command": "$GEMINI_PROJECT_DIR/.gemini/hooks/log-tools.sh"
          }
        ]
      }
    ]
  }
}
```

## Практичні приклади

### Безпека: Блокування секретів

Заборонити збереження файлів, що містять ключі API або паролі.

```bash
#!/usr/bin/env bash
input=$(cat)
content=$(echo "$input" | jq -r '.tool_input.content // ""')

if echo "$content" | grep -qE 'api_key|password|secret'; then
  echo '{"decision":"deny","reason":"Виявлено потенційний секрет!"}' >&2
  exit 2
fi
exit 0
```

### Автоматичне тестування

Запускати тести після кожної зміни коду.

```bash
#!/usr/bin/env bash
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path')

if [[ "$file_path" =~ \.ts$ ]]; then
  npx vitest run "${file_path%.ts}.test.ts" --silent
fi
```

## Переваги використання хуків

1.  **Точність моделі:** Ви можете фільтрувати список інструментів, залишаючи
    лише релевантні завданню.
2.  **Швидкість:** Менша кількість інструментів у контексті пришвидшує
    відповідь.
3.  **Економія:** Менше токенів витрачається на опис непотрібних інструментів.
4.  **Пам'ять між сесіями:** Використовуйте `SessionStart` та `SessionEnd` для
    збереження знань про проект.
