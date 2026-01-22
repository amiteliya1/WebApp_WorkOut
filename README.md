# 💪 Workout Tracker - Full Stack Application

פרויקט מלא של Workout Tracker עם React Client, Express Server, ו-MongoDB Atlas.

## 📋 דרישות

- Node.js (v18 או גבוה יותר)
- npm או yarn
- חשבון MongoDB Atlas (חינם)

## 🚀 התקנה והרצה

### 1. התקנת תלויות

#### Server:
```bash
cd server
npm install
```

#### Client:
```bash
cd client
npm install
```

### 2. הגדרת משתני סביבה

#### Server (.env):
צור קובץ `server/.env`:
```env
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workout-tracker?retryWrites=true&w=majority
```

**איך לקבל MONGODB_URI:**
1. היכנס ל-[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. צור Cluster (M0 FREE)
3. צור Database User
4. הוסף IP Address ל-Whitelist
5. לחץ "Connect" → "Connect your application"
6. העתק את ה-Connection String
7. החלף `<password>` בסיסמה שיצרת
8. הוסף `workout-tracker` בסוף (לפני `?`)

#### Client (.env):
צור קובץ `client/.env`:
```env
VITE_API_URL=http://localhost:3001
```

### 3. הרצת השרת

```bash
cd server
npm run dev
```

השרת ירוץ על: `http://localhost:3001`

### 4. הרצת Client

```bash
cd client
npm run dev
```

ה-Client ירוץ על: `http://localhost:5173`

## 📁 מבנה הפרויקט

```
workout-tracker/
├── client/                 # React Client
│   ├── src/
│   │   ├── components/    # קומפוננטות קטנות
│   │   ├── pages/         # דפים
│   │   ├── hooks/         # Custom Hooks
│   │   └── App.jsx
│   ├── .env
│   └── package.json
│
└── server/                 # Express Server
    ├── src/
    │   ├── config/        # הגדרות DB
    │   ├── models/        # Mongoose Models
    │   ├── routes/        # API Routes
    │   ├── controllers/   # Business Logic
    │   ├── middlewares/   # Error Handling
    │   ├── app.js
    │   └── server.js
    ├── .env
    └── package.json
```

## 🔌 API Endpoints

### Workouts

- `GET /api/workouts` - קבלת כל האימונים
- `GET /api/workouts/:id` - קבלת אימון ספציפי
- `POST /api/workouts` - יצירת אימון חדש
- `PUT /api/workouts/:id` - עדכון אימון
- `DELETE /api/workouts/:id` - מחיקת אימון

### Health Check

- `GET /api/health` - בדיקת תקינות השרת

## 🛠️ טכנולוגיות

### Client:
- React 19
- Vite
- React Router
- Axios
- Custom Hooks

### Server:
- Node.js
- Express
- Mongoose
- CORS
- dotenv

### Database:
- MongoDB Atlas

## 🐛 Troubleshooting

### שגיאת חיבור ל-MongoDB:

1. **IP Address לא ב-Whitelist:**
   - היכנס ל-MongoDB Atlas
   - Network Access → Add IP Address
   - הוסף את ה-IP שלך או "Allow Access from Anywhere" (0.0.0.0/0)

2. **סיסמה שגויה:**
   - ודא שהחלפת `<password>` ב-Connection String
   - אם שכחת, צור User חדש

3. **Cluster לא פעיל:**
   - ודא שה-Cluster פועל (לא Paused)
   - אם הוא Paused, לחץ Resume

4. **Connection String שגוי:**
   - ודא שה-Connection String מלא ונכון
   - ודא שהוספת `workout-tracker` בסוף

### שגיאת CORS:

- ודא שה-Client רץ על `http://localhost:5173`
- ודא שה-Server רץ על `http://localhost:3001`
- ודא שה-`VITE_API_URL` ב-Client נכון

### שגיאת Port:

- אם Port 3001 תפוס, שנה ב-`.env`:
  ```env
  PORT=3002
  ```
- עדכן גם את `VITE_API_URL` ב-Client

## 📝 הערות

- הפרויקט משתמש ב-ES Modules (`"type": "module"`)
- כל הקבצים משתמשים ב-`import/export`
- השרת משתמש ב-nodemon לפיתוח (auto-reload)

## 🎯 Features

- ✅ CRUD מלא (Create, Read, Update, Delete)
- ✅ ולידציה בצד לקוח ושרת
- ✅ Custom Hooks (useWorkouts, useLocalStorage)
- ✅ טיפול בשגיאות
- ✅ Loading States
- ✅ Empty States
- ✅ חיפוש אימונים
- ✅ Responsive Design

## 📄 License

ISC
