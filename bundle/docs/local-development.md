# Посібник з локальної розробки

Цей посібник містить інструкції щодо налаштування та використання функцій для
локальної розробки, зокрема налагоджувального трасування.

## Трасування розробки (Development tracing)

Трасування розробки (dev traces) — це траси OpenTelemetry (OTel), які
допомагають налагоджувати код, фіксуючи такі події, як виклики моделей,
планувальник інструментів, виклики самих інструментів тощо.

Ці траси є дуже детальними і призначені саме для розуміння поведінки агента. За
замовчуванням вони вимкнені.

Щоб увімкнути їх, встановіть змінну середовища `GEMINI_DEV_TRACING=true` при
запуску CLI.

### Перегляд трас

Ви можете переглядати траси за допомогою Jaeger або інтерфейсу Genkit Developer
UI.

#### Використання Genkit

1.  **Запустіть сервер телеметрії Genkit:**

    ```bash
    npm run telemetry -- --target=genkit
    ```

    Ви отримаєте URL, зазвичай `http://localhost:4000`.

2.  **Запустіть Gemini CLI з трасуванням:** В іншому терміналі:

    ```bash
    GEMINI_DEV_TRACING=true gemini-ua
    ```

3.  **Перегляньте траси:** Відкрийте вказаний URL у браузері та перейдіть на
    вкладку **Traces**.

#### Використання Jaeger

1.  **Запустіть колектор телеметрії:**

    ```bash
    npm run telemetry -- --target=local
    ```

    Це завантажить та запустить Jaeger та OTEL-колектор. Посилання на інтерфейс:
    `http://localhost:16686`.

2.  **Запустіть Gemini CLI:**
    ```bash
    GEMINI_DEV_TRACING=true gemini-ua
    ```

Для отримання детальнішої інформації дивіться
[документацію з телеметрії](./cli/telemetry.md).

### Додавання трасування у свій код

Ви можете використовувати функцію `runInDevTraceSpan`, щоб обгорнути будь-яку
ділянку коду для відстеження.

Приклад:

```typescript
import { runInDevTraceSpan } from '@google/gemini-cli-core';

await runInDevTraceSpan({ name: 'назва-моєї-траси' }, async ({ metadata }) => {
  metadata.input = { key: 'дані' };

  try {
    const output = await performOperation();
    metadata.output = output;
    return output;
  } catch (e) {
    metadata.error = e;
    throw e;
  }
});
```
