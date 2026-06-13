# PRD: Halyk HR Service Portal
**Версия:** 1.0  
**Дата:** Июнь 2026  
**Статус:** Передаётся в разработку  
**Владелец:** Департамент управления персоналом (ДУП), Халык Банк

---

## 1. Что строим и зачем

### Проблема

Сотрудники группы компаний Халык Банк подают HR-заявки по email, в мессенджерах и устно. Нет единой точки входа, нет трекинга статуса, нет SLA-метрик. HR-специалисты тратят время на ручной роутинг и напоминания вместо работы с людьми.

### Цель

Создать единый веб-портал HR-сервисов, через который любой сотрудник может подать заявку, отследить её статус, а HR-команда — управлять очередью и измерять SLA.

### Что уже готово (прототип в репозитории)

В репозитории находится **React-прототип** (`src/App.jsx`) — полнофункциональное SPA без бэкенда:

| Экран | Что сделано |
|---|---|
| Главная | Быстрые действия (4 сервиса), последние заявки |
| Каталог | 8 сервисов, 5 категорий, поиск, фильтры по категориям |
| Форма заявки | Ввод данных, проверка документов, сабмит |
| Мои заявки | Список заявок с бейджами статусов |
| Детали заявки | Workflow-бар (7 шагов), детали, комментарии |
| Аналитика | 4 KPI-карточки, топ-5 сервисов с bar chart |

**Стек прототипа:** React 18, CSS-in-JS (inline styles), без UI-библиотек, без бэкенда.  
**Данные:** хардкод в `App.jsx`, state через `useState`.

Прототип используется для валидации UI/UX с командой ДУП. Его нужно развить в production-систему.

---

## 2. Пользователи

| Роль | Кто | Приоритет | Что делает на портале |
|---|---|---|---|
| Сотрудник | Любой сотрудник группы | P0 | Подаёт заявки, смотрит статус |
| Руководитель | Line manager | P0 | Подаёт заявки за себя и команду, согласует |
| HR-специалист | ДУП / HR SC | P0 | Принимает заявки, меняет статусы, назначает |
| HR-аналитик | ДУП Analytics | P1 | Смотрит дашборд SLA и KPI |
| Системный администратор | IT / ДУП | P1 | Управляет пользователями, компаниями |

---

## 3. Экраны и функции

### 3.1 Главная (`/`)

| Функция | Статус | Приоритет |
|---|---|---|
| Приветствие с именем пользователя | ✓ В прототипе (хардкод «Фируза») | P0 |
| Быстрые действия — топ-4 сервиса | ✓ В прототипе | P0 |
| Последние 3 заявки пользователя | ✓ В прототипе (mock-данные) | P0 |
| Уведомления (новый статус заявки) | Нужно добавить | P1 |
| Персонализация быстрых действий | Нужно добавить | P2 |

### 3.2 Каталог HR-сервисов (`/catalog`)

| Функция | Статус | Приоритет |
|---|---|---|
| Карточки сервисов (8 шт.) | ✓ В прототипе | P0 |
| Фильтр по категориям (pill-кнопки) | ✓ В прототипе | P0 |
| Поиск по названию и категории | ✓ В прототипе | P0 |
| Управление каталогом из admin-панели | Нужно добавить | P1 |
| Добавление новых сервисов через CMS | Нужно добавить | P1 |

**Текущие категории сервисов:**
- Кадровое администрирование (Заявка на отпуск, Перевод, Справка с места работы)
- Подбор персонала (Заявка на подбор)
- Compensation & Benefits (Заявка на премирование)
- Обучение и развитие (Заявка на обучение)
- HR Analytics (Запрос HR-отчёта)
- Оценка и Performance (Запуск оценки 360)

### 3.3 Форма заявки (`/requests/new/:serviceId`)

| Функция | Статус | Приоритет |
|---|---|---|
| Карточка сервиса с описанием и SLA | ✓ В прототипе | P0 |
| Поля: имя, подразделение, комментарий | ✓ В прототипе | P0 |
| Подсказка о необходимых документах | ✓ В прототипе | P0 |
| Загрузка файлов (вложений) | Нужно добавить | P0 |
| Автозаполнение имени и отдела из профиля | Нужно добавить | P0 |
| Валидация обязательных полей | Нужно добавить | P0 |
| Email-уведомление после отправки | Нужно добавить | P0 |

### 3.4 Мои заявки (`/requests`)

| Функция | Статус | Приоритет |
|---|---|---|
| Список заявок с иконкой, статусом, датой | ✓ В прототипе | P0 |
| Переход на детали заявки | ✓ В прототипе | P0 |
| Фильтр по статусу / периоду | Нужно добавить | P1 |
| Пагинация | Нужно добавить | P1 |

### 3.5 Детали заявки (`/requests/:id`)

| Функция | Статус | Приоритет |
|---|---|---|
| Workflow-бар (7 шагов: draft → closed) | ✓ В прототипе | P0 |
| Блок деталей (номер, дата, SLA, статус, исполнитель) | ✓ В прототипе | P0 |
| Блок комментариев (mock) | ✓ В прототипе | P0 |
| Реальные комментарии от HR | Нужно добавить | P0 |
| Добавление комментария сотрудником | Нужно добавить | P1 |
| Скачать вложения | Нужно добавить | P1 |

### 3.6 Аналитика (`/analytics`)

| Функция | Статус | Приоритет |
|---|---|---|
| 4 KPI-карточки (заявки, SLA, время, NPS) | ✓ В прототипе (mock) | P0 |
| Топ-5 сервисов с bar chart | ✓ В прототипе (mock) | P0 |
| Реальные данные из БД | Нужно добавить | P0 |
| Фильтр по периоду, компании, отделу | Нужно добавить | P1 |
| Экспорт в Excel/PDF | Нужно добавить | P2 |

### 3.7 HR-панель управления (новый экран)

| Функция | Статус | Приоритет |
|---|---|---|
| Очередь входящих заявок | Нужно добавить | P0 |
| Назначение исполнителя | Нужно добавить | P0 |
| Смена статуса заявки | Нужно добавить | P0 |
| SLA-таймер (осталось N дней) | Нужно добавить | P0 |
| Добавление комментария к заявке | Нужно добавить | P0 |

---

## 4. Что нужно построить

### 4.1 Архитектура

```
Browser (React SPA)
       │ REST/JSON
       ▼
API Server (Node.js / Express)
       │
       ├── PostgreSQL (основные данные)
       └── S3 / MinIO (файлы)
```

### 4.2 Схема базы данных

```sql
-- Компании группы (мультитенантность)
CREATE TABLE companies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,  -- halyk-bank, halyk-life, etc.
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Пользователи
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID REFERENCES companies(id),
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT NOT NULL,
  department  TEXT,
  role        TEXT NOT NULL CHECK (role IN ('employee','manager','hr_specialist','hr_analyst','admin')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Каталог сервисов
CREATE TABLE services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID REFERENCES companies(id),  -- NULL = доступен всем
  category    TEXT NOT NULL,
  icon        TEXT,
  title       TEXT NOT NULL,
  description TEXT,
  sla_days    INTEGER NOT NULL,
  who_can     TEXT,
  docs_needed TEXT,
  is_active   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0
);

-- Заявки
CREATE TABLE requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number      TEXT UNIQUE NOT NULL,  -- HR-001, HR-002...
  company_id  UUID REFERENCES companies(id),
  service_id  UUID REFERENCES services(id),
  requester_id UUID REFERENCES users(id),
  assignee_id  UUID REFERENCES users(id),
  status      TEXT NOT NULL DEFAULT 'draft'
              CHECK (status IN ('draft','sent','review','assigned','inwork','done','closed')),
  sla_deadline TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Поля заявки (гибкая форма)
CREATE TABLE request_fields (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  UUID REFERENCES requests(id),
  field_name  TEXT NOT NULL,
  field_value TEXT
);

-- Комментарии
CREATE TABLE request_comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  UUID REFERENCES requests(id),
  author_id   UUID REFERENCES users(id),
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Вложения
CREATE TABLE request_attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  UUID REFERENCES requests(id),
  filename    TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  size_bytes  INTEGER,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Лог смены статусов
CREATE TABLE request_status_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  UUID REFERENCES requests(id),
  from_status TEXT,
  to_status   TEXT NOT NULL,
  changed_by  UUID REFERENCES users(id),
  changed_at  TIMESTAMPTZ DEFAULT now()
);
```

### 4.3 API Endpoints

**Аутентификация**
```
POST   /api/auth/login          Вход (email + пароль или SSO)
POST   /api/auth/logout         Выход
GET    /api/auth/me             Текущий пользователь
```

**Каталог**
```
GET    /api/services            Список сервисов (с фильтрацией)
GET    /api/services/:id        Детали сервиса
POST   /api/services            Создать сервис [admin]
PUT    /api/services/:id        Обновить сервис [admin]
DELETE /api/services/:id        Скрыть сервис [admin]
```

**Заявки**
```
GET    /api/requests            Мои заявки (сотрудник) / все (HR)
POST   /api/requests            Создать заявку
GET    /api/requests/:id        Детали заявки
PATCH  /api/requests/:id/status Сменить статус [hr_specialist]
POST   /api/requests/:id/assign Назначить исполнителя [hr_specialist]
```

**Комментарии**
```
GET    /api/requests/:id/comments     Список комментариев
POST   /api/requests/:id/comments     Добавить комментарий
```

**Вложения**
```
POST   /api/requests/:id/attachments  Загрузить файл
GET    /api/requests/:id/attachments  Список файлов
GET    /api/attachments/:id/download  Скачать файл
```

**Аналитика**
```
GET    /api/analytics/summary         KPI-сводка (период, компания)
GET    /api/analytics/top-services    Топ сервисов
GET    /api/analytics/sla             SLA-отчёт
```

### 4.4 Рекомендованный стек

| Слой | Технология | Обоснование |
|---|---|---|
| Frontend | React 18 (уже в репо) | Менять не нужно |
| Роутинг | React Router v6 | Стандарт для React SPA |
| HTTP-клиент | Axios или fetch | Просто, без зависимостей |
| Backend | Node.js + Express | Быстрый старт, JS в команде |
| БД | PostgreSQL 15 | Реляционные данные, UUID, JSONB |
| ORM | Prisma | Типобезопасность, миграции |
| Аутентификация | JWT + refresh token | Или интеграция с корп. SSO |
| Файлы | MinIO (self-hosted S3) | Без привязки к AWS |
| Окружение | Docker + docker-compose | Локальная разработка |
| CI | GitHub Actions | Уже есть репозиторий на GitHub |

---

## 5. Мультитенантность

Группа компаний Халык включает несколько юридических лиц (Халык Банк, Халык Life, Халык Leasing и др.). В v1 нужно заложить основу:

- Таблица `companies` — все компании в одной БД
- Каждый пользователь принадлежит одной компании (`company_id`)
- Каждая заявка привязана к компании
- Каталог сервисов: глобальные (`company_id = NULL`) + компанейские
- Аналитика фильтруется по `company_id`

**Открытые вопросы к ДУП:**
1. Сотрудник может подавать заявки в другую компанию группы?
2. Руководитель видит заявки своей команды или только свои?
3. Единый HR SC на все компании или у каждой свой?
4. SSO через Active Directory или отдельный логин?

---

## 6. План разработки (8 недель)

### Этап 1 — Фундамент (нед. 1–2)
- Репозиторий: разделить frontend / backend (монорепо или 2 репо)
- Docker: `docker-compose.yml` с PostgreSQL + Node + React
- БД: Prisma-схема, первые миграции (companies, users, services)
- API: `/auth/login`, `/auth/me`, `/services` (GET)
- Frontend: заменить mock-данные на реальные API-вызовы
- **Результат:** логин работает, каталог грузится из БД

### Этап 2 — Основной workflow заявок (нед. 3–4)
- API: `POST /requests`, `GET /requests`, `GET /requests/:id`
- API: `PATCH /requests/:id/status`, `POST /requests/:id/assign`
- Frontend: форма отправляет реальный POST, «Мои заявки» — GET
- Email-уведомление при смене статуса (Nodemailer / SendGrid)
- Автозаполнение имени и отдела из профиля пользователя
- **Результат:** сотрудник может подать заявку, HR — принять и закрыть

### Этап 3 — HR-панель + комментарии (нед. 5–6)
- Новый экран: очередь заявок для HR (роль `hr_specialist`)
- Назначение исполнителя, смена статуса одним кликом
- SLA-таймер: подсветка заявок, которые скоро просрочатся
- Комментарии к заявке (API + UI)
- Загрузка файлов (API + MinIO + UI)
- **Результат:** HR может полноценно работать с очередью

### Этап 4 — Аналитика + polish (нед. 7–8)
- Аналитика: реальные данные из БД вместо mock
- Фильтры в аналитике: период, компания
- Управление каталогом из admin-интерфейса
- Пагинация в «Моих заявках»
- Мобильная адаптация (responsive)
- Нагрузочное тестирование и security review
- **Результат:** v1 готов к пилоту

---

## 7. Приёмочные критерии

Фича считается готовой, если:

1. **Функционально:** поведение совпадает со спецификацией в разделе 3
2. **Тесты:** покрыты unit-тестами ключевые API-эндпоинты (Jest)
3. **Производительность:** страница загружается < 2 сек на корп. сети
4. **SLA-логика:** заявка автоматически помечается «просроченной» если дедлайн прошёл
5. **Безопасность:** авторизация проверяется на каждом защищённом эндпоинте
6. **Данные:** все операции логируются в `request_status_log`

---

## 8. Что НЕ входит в v1

| Функция | Почему отложено |
|---|---|
| AI-ассистент / чат-бот | Сложность, нет данных для обучения |
| Интеграция с SAP HR | Требует отдельного проекта с IT |
| Мобильное приложение (iOS/Android) | v1 — responsive web |
| Электронная подпись документов | Регуляторные требования изучаются |
| Интеграция с Calendar (согласование отпуска) | Зависит от выбора корп. календаря |
| Внешний кандидатский портал (ATS) | Отдельный продукт |

---

## 9. Контакты

| Роль | Ответственный |
|---|---|
| Владелец продукта (PO) | ДУП, Халык Банк |
| UX / прототип | fi.firuza.97@gmail.com |
| Разработка | TBD |
| Тестирование | TBD |
| IT-инфраструктура | IT-департамент Халык Банк |

---

## Приложение А — Текущая структура прототипа

```
halyk-hr-portal/
├── public/
│   └── index.html          HTML-шаблон
├── src/
│   ├── App.jsx             Всё приложение (один файл, ~520 строк)
│   └── index.js            Точка входа React
├── package.json            React 18 + react-scripts
└── README.md
```

**Дизайн-токены (из `App.jsx`):**
- Primary: `#1F7A5C` (Halyk green)
- Background: `#F7F8FA`
- Dark text: `#1C2B2B`
- Font: Inter / Segoe UI

**Workflow статусов заявки:**
```
draft → sent → review → assigned → inwork → done → closed
```

**При рефакторинге прототипа** рекомендуется разбить `App.jsx` на компоненты:
```
src/
  pages/     Home.jsx, Catalog.jsx, RequestForm.jsx, MyRequests.jsx, Analytics.jsx
  components/ Badge.jsx, Btn.jsx, Input.jsx, WorkflowBar.jsx, Sidebar.jsx
  api/       services.js, requests.js, auth.js
  hooks/     useRequests.js, useAuth.js
```
