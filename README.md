# Employee Management Platform

**Employee Management Platform** — це B2B SaaS додаток для управління співробітниками, змінами, чатом та payroll. Побудований з використанням Flutter + Supabase + Riverpod за принципами Clean Architecture.

## 📋 Опис

Платформа дозволяє компаніям:
- ✅ Керувати змінами співробітників (shifts)
- ✅ Комунікувати в захищеному чаті (company-isolated)
- ✅ Створювати опитування (polls)
- ✅ Керувати задачами (tasks — premium)
- ✅ Обробляти payroll (premium)
- ✅ Отримувати аналітику (enterprise)

## 💰 Тарифи (PLN)

| План | Ціна | Співробітники | Фічі |
|------|------|---------------|------|
| **Starter** | 299 zł/міс | до 50 | auth, chat, shifts, polls |
| **Growth** | 499 zł + 4.99 zł/employee | до 50 + extra | + calls, payroll, tasks |
| **Enterprise** | 999 zł + 2.99 zł/employee | до 300 + extra | + analytics, audit log, E2EE |

## 🏗 Архітектура

```
lib/
├── core/                      # Ядро додатку
│   ├── config/                # Feature flags, конфігурація
│   ├── di/                    # Dependency Injection (Riverpod)
│   ├── errors/                # AppError hierarchy
│   ├── offline/               # Offline-first sync
│   ├── router/                # GoRouter configuration
│   └── utils/                 # Result type, Base Repository
│
├── features/                  # Feature modules (Clean Architecture)
│   ├── auth/                  # Authentication
│   ├── shifts/                # Shift management
│   ├── chat/                  # Team chat (RLS isolated)
│   ├── billing/               # Subscription & billing
│   ├── payroll/               # Payroll (premium)
│   ├── tasks/                 # Task management (premium)
│   └── analytics/             # Analytics (enterprise)
│
└── packages/                  # Internal packages
    └── supabase_client_wrapper/
```

### Кожен feature має структуру:
```
features/<name>/
├── data/
│   ├── datasources/           # API calls (Supabase/HTTP)
│   ├── repositories/          # Repository implementations
│   └── models/                # JSON models (freezed)
├── domain/
│   ├── entities/              # Business entities (pure)
│   ├── repositories/          # Abstract interfaces
│   └── usecases/              # Business logic
└── presentation/
    ├── providers/             # Riverpod providers
    ├── screens/               # UI screens
    └── widgets/               # Reusable widgets
```

## 🔐 Безпека

### Supabase RLS (Row Level Security)

Кожна таблиця захищена RLS policies:

```sql
-- Chat isolation: користувачі бачать тільки повідомлення своєї компанії
CREATE POLICY "chat_isolation_select" ON messages
    FOR SELECT
    USING (
        company_id = (
            SELECT company_id FROM profiles WHERE id = auth.uid()
        )
    );
```

### Billing Stats View

Розробник бачить **тільки агреговану статистику** для billing:

```sql
CREATE VIEW billing_stats AS
SELECT
    c.id as company_id,
    c.name as company_name,
    c.plan_tier,
    COUNT(DISTINCT p.id) as employee_count,  -- ТІЛЬКИ кількість
    ...
FROM companies c
LEFT JOIN profiles p ON p.company_id = c.id
GROUP BY ...;
```

**Ніяких імен, контактів, повідомлень — тільки кількість співробітників для виставлення рахунків.**

## 🚀 Швидкий старт

### 1. Клонуйте репозиторій
```bash
cd employee_platform
```

### 2. Встановіть залежності
```bash
flutter pub get
```

### 3. Запустіть code generation
```bash
dart run build_runner build --delete-conflicting-outputs
```

### 4. Налаштуйте Supabase

Створіть `.env` файл:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Застосуйте SQL migrations
```bash
# У Supabase Dashboard -> SQL Editor
# Скопіюйте вміст supabase/migrations/001_initial_schema.sql
```

### 6. Запустіть додаток
```bash
flutter run
```

## 📦 Генерація коду

Проект використовує code generation для:
- **Riverpod** (`@riverpod`)
- **Freezed** (immutable models)
- **JSON Serializable**

```bash
# Watch mode (auto-generate)
dart run build_runner watch

# Single build
dart run build_runner build --delete-conflicting-outputs
```

## 🧪 Тестування

```bash
# Unit tests
flutter test

# Integration tests
flutter test integration_test/
```

## 📱 Платформи

- ✅ Android
- ✅ iOS
- 🔄 Web (PWA)
- 🔄 Desktop (майбутнє)

## 🔧 Технології

| Категорія | Технологія |
|-----------|-----------|
| **Framework** | Flutter 3.x |
| **State** | Riverpod 2.x |
| **Routing** | GoRouter 14.x |
| **Backend** | Supabase |
| **Offline** | Isar DB |
| **Models** | Freezed + JSON Serializable |
| **Functional** | fpdart (Result/Either) |

## 📄 Ліцензія

Private — всі права захищені.

## 👥 Команда

Розроблено для польського/європейського ринку B2B SaaS.

---

**Build with ❤️ using Flutter + Supabase**
