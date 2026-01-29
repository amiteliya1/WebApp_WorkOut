# 🚀 Deployment Guide - Render

## שלב 1: הכנת הקוד

הפרויקט כבר מוכן לדיפלוי! יש לך:
- ✅ `render.yaml` - קובץ קונפיגורציה אוטומטי
- ✅ `.env.example` - דוגמאות למשתני סביבה
- ✅ Health check endpoint: `/api/health`

## שלב 2: צור חשבון ב-Render

1. לך ל-https://render.com
2. הירשם / התחבר עם GitHub
3. חבר את ה-Repository שלך

## שלב 3: Deploy Backend (API)

### אופציה א' - Automatic Deploy (קל יותר):

1. ב-Render Dashboard לחץ על **"New +"**
2. בחר **"Blueprint"**
3. חבר את ה-repo: `amiteliya1/WebApp_WorkOut`
4. Render יזהה את `render.yaml` ויצור את שני הסרוויסים אוטומטית
5. הגדר את המשתנים הנדרשים (ראה למטה)

### אופציה ב' - Manual Deploy:

1. ב-Render Dashboard לחץ על **"New +"** → **"Web Service"**
2. חבר את ה-repo: `amiteliya1/WebApp_WorkOut`
3. הגדרות:
   - **Name**: `workout-tracker-api`
   - **Region**: Frankfurt (or any)
   - **Branch**: `english-version`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### הגדרת Environment Variables (Backend):

לחץ על **Environment** בצד שמאל והוסף:

```
PORT=3002
NODE_ENV=production
MONGODB_URI=mongodb+srv://amiteliya19:Workout1234@cluster0.eqh01pr.mongodb.net/workout-tracker?retryWrites=true&w=majority
JWT_SECRET=workout_tracker_secret_123
JWT_EXPIRES_IN=7d
YOUTUBE_API_KEY=AIzaSyAWG8a5jKvgXYcJ0fXzkuB0zi4_tfPAuqE
```

**חשוב:** שמור את ה-URL של השרת! משהו כמו:
```
https://workout-tracker-api.onrender.com
```

## שלב 4: Deploy Frontend

### אופציה א' - Static Site (Free):

1. ב-Render Dashboard לחץ על **"New +"** → **"Static Site"**
2. חבר את אותו repo
3. הגדרות:
   - **Name**: `workout-tracker-frontend`
   - **Branch**: `english-version`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### הגדרת Environment Variables (Frontend):

```
VITE_API_URL=https://workout-tracker-api.onrender.com/api
```

**⚠️ חשוב:** החלף את ה-URL בURL האמיתי של הBackend שלך!

## שלב 5: בדיקה

1. אחרי שהדיפלוי הסתיים, פתח את ה-URL של הFrontend
2. נסה להירשם / להתחבר
3. בדוק שה-API עובד

## 🔧 Troubleshooting

### Backend לא עולה?
- בדוק את הlogs ב-Render Dashboard
- ודא ש-`MONGODB_URI` נכון
- ודא שיש health check endpoint ב-`/api/health`

### Frontend לא מתחבר לBackend?
- בדוק ש-`VITE_API_URL` מצביע לURL הנכון של הBackend
- בדוק את CORS settings ב-`server/src/app.js`
- ודא שהוספת את ה-URL של הFrontend ל-`allowedOrigins`

### Free Plan Limitations:
- ⏰ השרת נרדם אחרי 15 דקות חוסר פעילות
- ⏳ התעוררות לוקחת ~30 שניות
- 💾 750 שעות חינם בחודש

## 📱 URLs שיהיו לך:

```
Backend:  https://workout-tracker-api.onrender.com
Frontend: https://workout-tracker-frontend.onrender.com
```

## 🎉 זהו! האפליקציה שלך live!

נהדר! עכשיו אפשר לשתף את הקישור עם חברים ולהגיש את הפרויקט 🚀
