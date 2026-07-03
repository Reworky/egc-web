# EXPERIENCE GAMING CLUB — Web

Веб-сайт EGC на Next.js 14 (App Router). Подключается к REST API Telegram-бота.

## Страницы

| Страница | Путь | Описание |
|----------|------|----------|
| Главная | `/` | Hero, статистика клуба, рейтинг игроков |
| Квесты | `/quests` | Каталог с фильтром по игре и сложности |
| Магазин | `/shop` | Список наград с ценами в EXC |
| Профиль | `/profile` | Личный кабинет, история квестов и заявок |

## Стек

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Шрифты: Orbitron (логотип/заголовки), Rajdhani (подзаголовки), Inter (текст)

## API эндпоинты (бэкенд)

Бэкенд — Spring Boot бот на порту 8080. Базовый URL задаётся через `NEXT_PUBLIC_API_URL`.

| Endpoint | Используется на |
|----------|----------------|
| `GET /api/stats` | Главная |
| `GET /api/leaderboard?type=overall\|weekly` | Главная |
| `GET /api/quests` | Квесты |
| `GET /api/quests/games` | Квесты |
| `GET /api/shop/items` | Магазин |
| `GET /api/profile` | Профиль (JWT) |
| `GET /api/profile/submissions` | Профиль (JWT) |
| `GET /api/profile/rewards` | Профиль (JWT) |

## Запуск

```bash
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Переменные окружения (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_BOT_USERNAME=EXPERIENCEgamingbot
```

Для продакшена укажи реальный адрес сервера в `NEXT_PUBLIC_API_URL`.

## Деплой

Совместим с Vercel, Nginx + Node.js, Docker. Перед деплоем обязательно обнови `NEXT_PUBLIC_API_URL` на адрес продакшен-сервера.

## Связанные проекты

- **gamebot** — Spring Boot Telegram-бот + REST API
- **egc-landing** — Статический лендинг EGC
