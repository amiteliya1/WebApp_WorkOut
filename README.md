# Workout Tracker App

A React-based application for tracking weekly workouts, logging new sessions, and discovering exercises via external APIs. This project was built as part of a React Homework assignment focusing on Routing and Global State management.

## 🚀 Features

- **Weekly Schedule:** View your weekly workout plan on the Home page.
- **Workout Log:** A form to log new workout sessions (sets, reps, weight).
- **Exercise Library:** Browse exercises by category (fetched from wger API).
- **Video Search:** Automatically search for relevant exercise videos on YouTube.
- **Favorites System:** Save your favorite exercise videos to a global list accessible from the Home page.

## 🛠 Technologies

- **React** (Vite)
- **React Router** (for navigation)
- **Context API** (for global state management)
- **Axios** (for API requests)

---

## 🧭 Routing (React Router)

The application uses `react-router-dom` to manage navigation between pages without refreshing the browser.

- **`/` (Home):** Displays the weekly workout schedule and the user's favorite videos.
- **`/form` (Log):** A form page to input data for new workout sessions.
- **`/exercises` (API):** Fetches and displays exercise categories from an external API.
- **`/exercises/:muscle`:** A dynamic route that searches for YouTube videos based on the selected muscle/category.
- **`*` (404):** A "Not Found" page for handling invalid URLs.

Navigation is handled via a persistent `Header` component using `<NavLink>` for active link styling.

---

## 🌐 Global State (Context API)

We implemented a **FavoritesContext** to manage the state of the user's favorite videos across the application.

### Implementation Details:
1. **`FavoritesContext.jsx`:** Creates the context and provider. It holds the `favorites` array state.
2. **Provider:** The entire app is wrapped in `<FavoritesProvider>` in `main.jsx`.
3. **Usage:**
   - **Video Player Page:** Users can click the heart icon (❤️) to add or remove a video from the global favorites list.
   - **Home Page:** Consumes the context to display the list of "My Favorite Exercises" at the bottom of the page.

---

## 📦 How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 📚 Homework Evolution

### Homework 1: React Basics
In the first assignment, we established the core structure of the application. We created three main components: `HomePage`, `WorkoutLogForm`, and `ExerciseApiPage`. The navigation between these "pages" was handled naively using conditional rendering (a `renderPage` function) and local `useState` in the main `App` component. We also implemented data fetching using `useEffect` and `axios` to retrieve exercise categories and YouTube videos, managing the local state within each component.

### Homework 2: Router & Context
In this second assignment, we upgraded the architecture to support a true Single Page Application (SPA).
1. **Routing:** We replaced the conditional rendering with **React Router**. This allows for direct linking to specific pages (e.g., `/exercises/Chest`) and enables browser history navigation.
2. **Global State:** We introduced **React Context** (`FavoritesContext`) to solve the prop-drilling issue. This allows the user to mark a video as a favorite in the `VideoPlayerPage` and have that data immediately available and displayed in the `HomePage`, demonstrating efficient cross-component data sharing.
