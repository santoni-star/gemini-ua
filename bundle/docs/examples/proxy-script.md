# Приклад проксі-скрипта

Нижче наведено приклад проксі-скрипта, який можна використовувати зі змінною
середовища `GEMINI_SANDBOX_PROXY_COMMAND`. Цей скрипт дозволяє лише `HTTPS`
з'єднання з `example.com:443` та відхиляє всі інші запити.

```javascript
#!/usr/bin/env node

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Приклад проксі-сервера, який слухає на порту 8877 і дозволяє лише HTTPS з'єднання з example.com.
// Встановіть `GEMINI_SANDBOX_PROXY_COMMAND=scripts/example-proxy.js`, щоб запустити проксі разом із пісочницею.
// Перевірте через `curl https://example.com` всередині пісочниці.

import http from 'node:http';
import net from 'node:net';
import { URL } from 'node:url';
import console from 'node:console';

const PROXY_PORT = 8877;
const ALLOWED_DOMAINS = ['example.com', 'googleapis.com'];
const ALLOWED_PORT = '443';

const server = http.createServer((req, res) => {
  // Відхиляти всі запити, крім CONNECT для HTTPS
  console.log(
    `[PROXY] Відхилення не-CONNECT запиту для: ${req.method} ${req.url}`,
  );
  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('Метод не дозволено');
});

server.on('connect', (req, clientSocket, head) => {
  // req.url буде у форматі "hostname:port" для CONNECT запиту.
  const { port, hostname } = new URL(`http://${req.url}`);

  console.log(`[PROXY] Перехоплено CONNECT запит для: ${hostname}:${port}`);

  if (
    ALLOWED_DOMAINS.some(
      (domain) => hostname == domain || hostname.endsWith(`.${domain}`),
    ) &&
    port === ALLOWED_PORT
  ) {
    console.log(`[PROXY] Дозвіл підключення до ${hostname}:${port}`);

    // Встановлення TCP-з'єднання з оригінальним призначенням.
    const serverSocket = net.connect(port, hostname, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      // Створення тунелю шляхом перенаправлення даних.
      serverSocket.write(head);
      serverSocket.pipe(clientSocket);
      clientSocket.pipe(serverSocket);
    });

    serverSocket.on('error', (err) => {
      console.error(
        `[PROXY] Помилка підключення до призначення: ${err.message}`,
      );
      clientSocket.end(`HTTP/1.1 502 Bad Gateway\r\n\r\n`);
    });
  } else {
    console.log(`[PROXY] Заборона підключення до ${hostname}:${port}`);
    clientSocket.end('HTTP/1.1 403 Forbidden\r\n\r\n');
  }

  clientSocket.on('error', (err) => {
    // Це може статися, якщо клієнт розірве з'єднання.
    console.error(`[PROXY] Помилка сокета клієнта: ${err.message}`);
  });
});

server.listen(PROXY_PORT, () => {
  const address = server.address();
  console.log(`[PROXY] Проксі слухає на ${address.address}:${address.port}`);
  console.log(
    `[PROXY] Дозвіл HTTPS з'єднань з доменами: ${ALLOWED_DOMAINS.join(', ')}`,
  );
});
```
