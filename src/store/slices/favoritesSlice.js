import { createSlice } from '@reduxjs/toolkit';

// קריאת favorites מ-localStorage בהתחלה
const getInitialFavorites = () => {
    try {
        const stored = localStorage.getItem('favorites');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const initialState = {
    items: getInitialFavorites(),
    lastUpdated: null,
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addFavorite: (state, action) => {
            const video = action.payload;
            const exists = state.items.some(fav => fav.id.videoId === video.id.videoId);
            if (!exists) {
                state.items.push(video);
                state.lastUpdated = new Date().toISOString();
                // שמירה ב-localStorage
                localStorage.setItem('favorites', JSON.stringify(state.items));
            }
        },
        removeFavorite: (state, action) => {
            const videoId = action.payload;
            state.items = state.items.filter(video => video.id.videoId !== videoId);
            state.lastUpdated = new Date().toISOString();
            // שמירה ב-localStorage
            localStorage.setItem('favorites', JSON.stringify(state.items));
        },
        clearFavorites: (state) => {
            state.items = [];
            state.lastUpdated = new Date().toISOString();
            localStorage.removeItem('favorites');
        },
        setFavorites: (state, action) => {
            state.items = action.payload;
            state.lastUpdated = new Date().toISOString();
            localStorage.setItem('favorites', JSON.stringify(action.payload));
        },
    },
});

export const { addFavorite, removeFavorite, clearFavorites, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

