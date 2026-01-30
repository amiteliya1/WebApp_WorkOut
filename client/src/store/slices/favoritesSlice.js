import { createSlice } from '@reduxjs/toolkit';
import { addFavoriteToDb, removeFavoriteFromDb } from '../../services/favorites.api';

// Initial state - favorites will be loaded from database on login
const initialState = {
    items: [],
    lastUpdated: null,
    loading: false,
    error: null,
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        // Set favorites from database
        setFavorites: (state, action) => {
            state.items = action.payload;
            state.lastUpdated = new Date().toISOString();
            state.error = null;
        },
        // Clear all favorites (on logout)
        clearFavorites: (state) => {
            state.items = [];
            state.lastUpdated = new Date().toISOString();
            state.error = null;
        },
        // Set loading state
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        // Set error state
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setFavorites, clearFavorites, setLoading, setError } = favoritesSlice.actions;

// Thunk action to add favorite (with API call)
export const addFavorite = (video) => async (dispatch, getState) => {
    try {
        // Check if already loading to prevent duplicate requests
        const { loading, items } = getState().favorites;
        if (loading) {
            console.log('Already processing a favorite operation, skipping...');
            return;
        }

        // Check if already in favorites
        const alreadyFavorite = items.some(fav => fav.id.videoId === video.id.videoId);
        if (alreadyFavorite) {
            console.log('Video already in favorites');
            return;
        }

        dispatch(setLoading(true));
        console.log('Adding favorite to database:', video.id.videoId);

        // Call API to add to database
        const updatedFavorites = await addFavoriteToDb(video);

        // Update Redux state with response from server
        dispatch(setFavorites(updatedFavorites));
        dispatch(setError(null));

        console.log('Favorite added successfully');
    } catch (error) {
        console.error('Error adding favorite:', error);
        const errorMsg = error.response?.data?.error || 'Failed to add favorite';
        dispatch(setError(errorMsg));
    } finally {
        dispatch(setLoading(false));
    }
};

// Thunk action to remove favorite (with API call)
export const removeFavorite = (videoId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        console.log('Removing favorite from database:', videoId);

        // Call API to remove from database
        const updatedFavorites = await removeFavoriteFromDb(videoId);

        // Update Redux state with response from server
        dispatch(setFavorites(updatedFavorites));
        dispatch(setError(null));

        console.log('Favorite removed successfully');
    } catch (error) {
        console.error('Error removing favorite:', error);
        const errorMsg = error.response?.data?.error || 'Failed to remove favorite';
        dispatch(setError(errorMsg));
    } finally {
        dispatch(setLoading(false));
    }
};

export default favoritesSlice.reducer;


