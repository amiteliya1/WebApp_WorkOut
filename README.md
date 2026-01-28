# 💪 Workout Tracker - Full Stack Web Application

A comprehensive, production-ready workout tracking application built with the MERN stack. Features user authentication, real-time data persistence, exercise library integration, and a modern, responsive UI with light/dark theme support.

[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/cloud/atlas)
[![React](https://img.shields.io/badge/React-19.x-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-black)](https://expressjs.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Workout Tracker** is a modern, full-stack web application designed to help users track their fitness journey. The application provides a complete workout management system with user authentication, personalized workout plans, exercise library integration via YouTube API, and comprehensive CRUD operations.

### Key Highlights

- **Secure Authentication**: JWT-based authentication with protected routes
- **Real-time Data Persistence**: MongoDB Atlas cloud database
- **Exercise Library**: YouTube API integration with 600+ exercise videos
- **Workout Management**: Full CRUD operations for workout tracking
- **Responsive Design**: Mobile-first approach with dark/light theme support
- **Production Ready**: Deployable to Render, Vercel, or any cloud platform

---

## ✨ Features

### User Management
- ✅ **User Registration & Login** - Secure authentication with JWT tokens
- ✅ **Protected Routes** - Access control for authenticated users only
- ✅ **User Profile Management** - View and manage user information
- ✅ **Account Deletion** - Permanent account and data removal with confirmation

### Workout Management
- ✅ **Create Workouts** - Log exercises with weight, sets, reps, and feeling
- ✅ **Read Workouts** - View all workouts organized by day
- ✅ **Update Workouts** - Edit existing workout entries
- ✅ **Delete Workouts** - Remove individual workouts or entire day schedules
- ✅ **Weekly Planning** - Default weekly workout plan with customizable focus areas

### Exercise Library
- ✅ **YouTube Integration** - 600+ exercise videos from YouTube API
- ✅ **Muscle Group Filtering** - Browse exercises by target muscle groups
- ✅ **Favorites System** - Save favorite exercises using Redux
- ✅ **Video Playback** - Watch exercise demonstrations directly in the app

### User Experience
- ✅ **Responsive Design** - Optimized for mobile, tablet, and desktop
- ✅ **Dark/Light Themes** - Toggle between color schemes
- ✅ **Loading States** - Visual feedback during API calls
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Form Validation** - Client-side and server-side validation
- ✅ **Professional Footer** - Links, social media, and account management

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   React    │  │   Redux    │  │   Router   │            │
│  │  (UI/UX)   │  │ (State Mgmt)│ │(Navigation)│            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         │                │                │                  │
│         └────────────────┴────────────────┘                  │
│                         │                                     │
│                    Axios HTTP                                │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Express   │  │    JWT     │  │   CORS     │            │
│  │  (Server)  │  │   (Auth)   │  │ (Security) │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         │                │                │                  │
│         └────────────────┴────────────────┘                  │
│                         │                                     │
│                    Mongoose ODM                              │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database Layer                           │
│  ┌──────────────────────────────────────────────┐           │
│  │           MongoDB Atlas (Cloud)              │           │
│  │  ┌──────────────┐      ┌──────────────┐     │           │
│  │  │    Users     │      │   Workouts   │     │           │
│  │  │  Collection  │      │  Collection  │     │           │
│  │  └──────────────┘      └──────────────┘     │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘

External APIs:
  ├─ YouTube Data API v3 (Exercise Videos)
  └─ Unsplash (Background Images)
```

### Data Flow

1. **User Action** → React Component
2. **Component** → API Service Layer (Axios)
3. **API Service** → Express REST API
4. **Express** → Authentication Middleware (JWT)
5. **Controller** → Mongoose Model
6. **Model** → MongoDB Atlas
7. **Response** ← Travels back through layers
8. **UI Update** ← React Component renders new state

---

## 🛠️ Technologies

### Frontend (Client)

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework |
| **Vite** | 7.3.1 | Build tool & dev server |
| **React Router DOM** | 7.10.1 | Client-side routing |
| **Redux Toolkit** | 2.11.2 | State management (favorites) |
| **Axios** | 1.13.2 | HTTP client |
| **React Icons** | 5.5.0 | Icon library |

### Backend (Server)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express** | 4.18.2 | Web framework |
| **Mongoose** | 8.0.3 | MongoDB ODM |
| **JWT** | 9.0.3 | Authentication tokens |
| **bcryptjs** | 3.0.3 | Password hashing |
| **CORS** | 2.8.5 | Cross-origin requests |
| **dotenv** | 16.3.1 | Environment variables |

### Database & External Services

- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **YouTube Data API v3** - Exercise video library
- **Unsplash API** - High-quality background images

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **MongoDB Atlas Account** (Free) - [Sign Up](https://www.mongodb.com/cloud/atlas/register)

Optional but recommended:
- **Postman** or **Insomnia** - API testing
- **MongoDB Compass** - Database GUI
- **VS Code** - Code editor

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/workout-tracker.git
cd workout-tracker
```

### Step 2: Install Dependencies

#### Install Server Dependencies
```bash
cd server
npm install
```

#### Install Client Dependencies
```bash
cd ../client
npm install
```

### Step 3: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (M0 Free Tier)
4. Create a database user:
   - Database Access → Add New Database User
   - Choose Username/Password authentication
   - Save the username and password
5. Configure Network Access:
   - Network Access → Add IP Address
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
6. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

---

## ⚙️ Configuration

### Server Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=3002

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/workout-tracker?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# YouTube API (Optional - for exercise library)
YOUTUBE_API_KEY=your_youtube_api_key_here
```

**Important Notes:**
- Replace `username` and `password` with your MongoDB credentials
- Change `JWT_SECRET` to a strong, random string in production
- Get YouTube API key from [Google Cloud Console](https://console.cloud.google.com/)

### Client Environment Variables

Create a `.env` file in the `client/` directory:

```env
# API Base URL
VITE_API_URL=http://localhost:3002/api

# YouTube API Key (same as server)
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

### Environment-Specific Configuration

For **Production** deployment, update:
- `VITE_API_URL` to your production API URL
- `MONGODB_URI` to use IP whitelist instead of 0.0.0.0/0
- `JWT_SECRET` to a strong random value

---

## 🔌 API Documentation

### Base URL
```
Development: http://localhost:3002/api
Production: https://your-app.onrender.com/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-28T10:00:00.000Z"
  }
}
```

#### Delete Account
```http
DELETE /auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Account and all associated data deleted successfully",
  "data": {
    "deletedWorkouts": 15
  }
}
```

### Workout Endpoints

#### Get All Workouts
```http
GET /workouts
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "day": "Monday",
      "name": "Bench Press",
      "weight": 80,
      "sets": 4,
      "reps": 10,
      "feeling": "Great",
      "user": "507f1f77bcf86cd799439012",
      "createdAt": "2026-01-28T10:00:00.000Z",
      "updatedAt": "2026-01-28T10:00:00.000Z"
    }
  ]
}
```

#### Get Single Workout
```http
GET /workouts/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "day": "Monday",
    "name": "Bench Press",
    "weight": 80,
    "sets": 4,
    "reps": 10,
    "feeling": "Great"
  }
}
```

#### Create Workout
```http
POST /workouts
Authorization: Bearer {token}
Content-Type: application/json

{
  "day": "Monday",
  "name": "Bench Press",
  "weight": 80,
  "sets": 4,
  "reps": 10,
  "feeling": "Great"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "day": "Monday",
    "name": "Bench Press",
    "weight": 80,
    "sets": 4,
    "reps": 10,
    "feeling": "Great",
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2026-01-28T10:00:00.000Z"
  }
}
```

#### Update Workout
```http
PUT /workouts/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "weight": 85,
  "sets": 5
}

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "day": "Monday",
    "name": "Bench Press",
    "weight": 85,
    "sets": 5,
    "reps": 10,
    "feeling": "Great"
  }
}
```

#### Delete Workout
```http
DELETE /workouts/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {}
}
```

### Error Responses

All endpoints may return these error responses:

```http
400 Bad Request
{
  "success": false,
  "error": "Validation error message"
}

401 Unauthorized
{
  "success": false,
  "error": "Not authorized, no token"
}

404 Not Found
{
  "success": false,
  "error": "Resource not found"
}

500 Internal Server Error
{
  "success": false,
  "error": "Server error message"
}
```

---

## 📁 Project Structure

```
workout-tracker/
├── client/                          # Frontend React Application
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/              # React Components
│   │   │   ├── ExerciseApiPage.jsx  # Exercise library page
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   ├── Footer.css           # Footer styles
│   │   │   ├── HomePage.jsx         # Main workout page
│   │   │   ├── NotFoundPage.jsx     # 404 page
│   │   │   ├── ProtectedRoute.jsx   # Route guard
│   │   │   ├── VideoPlayerPage.jsx  # Video playback
│   │   │   ├── WorkoutDayCard.jsx   # Day card component
│   │   │   └── WorkoutLogForm.jsx   # Workout form
│   │   ├── context/                 # React Context
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── hooks/                   # Custom Hooks
│   │   │   ├── useAuth.js           # Auth hook
│   │   │   └── useTheme.js          # Theme hook
│   │   ├── pages/                   # Page Components
│   │   │   ├── LoginPage.jsx        # Login page
│   │   │   └── RegisterPage.jsx     # Registration page
│   │   ├── services/                # API Services
│   │   │   └── workouts.api.js      # Workout API calls
│   │   ├── store/                   # Redux Store
│   │   │   ├── store.js             # Store configuration
│   │   │   └── slices/
│   │   │       └── favoritesSlice.js # Favorites reducer
│   │   ├── App.jsx                  # Root component
│   │   ├── App.css                  # Main styles
│   │   ├── index.css                # Global styles
│   │   └── main.jsx                 # Entry point
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Example env file
│   ├── index.html                   # HTML template
│   ├── package.json                 # Dependencies
│   └── vite.config.js               # Vite configuration
│
├── server/                          # Backend Express Application
│   ├── src/
│   │   ├── config/                  # Configuration
│   │   │   └── db.js                # MongoDB connection
│   │   ├── controllers/             # Request Handlers
│   │   │   ├── auth.controller.js   # Auth logic
│   │   │   └── workouts.controller.js # Workout logic
│   │   ├── middlewares/             # Express Middlewares
│   │   │   └── auth.middleware.js   # JWT verification
│   │   ├── models/                  # Mongoose Models
│   │   │   ├── User.js              # User schema
│   │   │   └── Workout.js           # Workout schema
│   │   ├── routes/                  # API Routes
│   │   │   ├── auth.routes.js       # Auth routes
│   │   │   ├── exercises.routes.js  # Exercise routes
│   │   │   └── workouts.routes.js   # Workout routes
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Server entry point
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Example env file
│   └── package.json                 # Dependencies
│
├── .gitignore                       # Git ignore rules
├── README.md                        # This file
└── package.json                     # Root package file
```

---

## 💻 Usage

### Running the Application Locally

#### 1. Start the Server (Terminal 1)
```bash
cd server
npm run dev
```
Server will start on `http://localhost:3002`

#### 2. Start the Client (Terminal 2)
```bash
cd client
npm run dev
```
Client will start on `http://localhost:5173`

#### 3. Access the Application
Open your browser and navigate to: `http://localhost:5173`

### Using the Application

#### First-Time Setup
1. Click **"Sign Up"** in the navigation
2. Enter your name, email, and password
3. Click **"Register"** to create your account
4. You'll be automatically logged in

#### Creating Workouts
1. Navigate to **"Build Program"**
2. Select the day of the week
3. Enter exercise name, weight, sets, reps
4. Select how you're feeling
5. Click **"Save Workout"**

#### Viewing Workouts
1. On the **Home** page, you'll see your weekly plan
2. Click on any day to view workouts for that day
3. Edit or delete workouts as needed

#### Exercise Library
1. Navigate to **"Exercise Library"**
2. Browse exercises by muscle group
3. Click on any exercise to watch the video
4. Save favorites for quick access

#### Theme Toggle
- Click the sun/moon icon in the navigation bar
- Toggle between light and dark themes
- Your preference is saved locally

#### Account Management
- Scroll to the footer
- Click **"Delete Account"** to permanently remove your account
- Confirm deletion (cannot be undone)

---

## 🚢 Deployment

### Prerequisites for Deployment

- GitHub repository with your code
- [Render](https://render.com/) account (Free tier available)
- MongoDB Atlas database (already set up)

### Deploy Backend to Render

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: workout-tracker-api
     - **Root Directory**: `server`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Add Environment Variables on Render**
   - Go to "Environment" tab
   - Add all variables from `server/.env`:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `JWT_EXPIRES_IN`
     - `YOUTUBE_API_KEY`
     - `PORT` (set to 3002)

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your API URL (e.g., `https://workout-tracker-api.onrender.com`)

### Deploy Frontend to Render (Static Site)

1. **Update Client Environment Variables**
   - Update `client/.env`:
     ```env
     VITE_API_URL=https://workout-tracker-api.onrender.com/api
     ```

2. **Build the Client**
   ```bash
   cd client
   npm run build
   ```

3. **Create Static Site on Render**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: workout-tracker
     - **Root Directory**: `client`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`

4. **Add Environment Variable**
   - Add `VITE_API_URL` with your API URL

5. **Deploy**
   - Click "Create Static Site"
   - Your app will be live at `https://workout-tracker.onrender.com`

### Alternative: Deploy to Vercel (Frontend)

```bash
cd client
npm install -g vercel
vercel
```

Follow the prompts and add environment variables when asked.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- Use ES6+ syntax
- Follow existing code formatting
- Add comments for complex logic
- Write meaningful commit messages
- Test your changes before submitting

### Reporting Issues

- Use the GitHub Issues tab
- Provide clear description of the bug
- Include steps to reproduce
- Add screenshots if applicable

---

## 📄 License

This project is licensed under the **ISC License**.

```
ISC License

Copyright (c) 2026 Workout Tracker

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## 👨‍💻 Authors

- **Your Name** - Initial work

---

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database hosting
- YouTube Data API for exercise video library
- Unsplash for high-quality background images
- React community for excellent documentation
- Express.js team for robust backend framework

---

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

## 🎓 Project Information

**Course**: Web Application Development
**Institution**: Shenkar College of Engineering and Design
**Year**: 2026
**Semester**: Spring

---

**⭐ If you found this project helpful, please give it a star on GitHub!**
