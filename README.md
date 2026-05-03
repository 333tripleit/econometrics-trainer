# Інформаційна система інтерактивного оцінювання знань з дисципліни «Економетрика»

Повноцінний дипломний веб-додаток:
- **Frontend:** React 19 + Vite 7 (сумісно з новими Node.js)
- **Backend:** Node.js + Express
- **Database:** SQLite
- **Auth:** JWT + bcrypt

## Структура

```
/project
  /client
  /server
```

## Можливості

### Student
- Реєстрація та авторизація
- Вибір теми задачі
- Генерація індивідуального завдання
- Введення відповіді
- Автоматична перевірка
- Перегляд історії результатів

### Admin
- Перегляд користувачів
- Перегляд результатів
- Видалення користувачів
- Статистика успішності

## Генерація економетричних задач
- Лінійна регресія (коефіцієнт нахилу)
- Середнє значення
- Дисперсія
- Кореляція Пірсона

## Seed-акаунти
- **admin / admin123**
- **student / student123**

## Запуск

### 1) Backend
```bash
cd project/server
npm install
PORT=5001 npm start
```

### 2) Frontend
```bash
cd project/client
npm install
npm run dev
```

Frontend за замовчуванням працює на `http://localhost:3000`.

Щоб вказати backend URL, створіть `project/client/.env`:
```bash
VITE_API_URL=http://localhost:5001/api
```

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/tasks/generate`
- `POST /api/tasks/check`
- `GET /api/tasks/history`
- `GET /api/admin/users`
- `GET /api/admin/results`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/stats`
