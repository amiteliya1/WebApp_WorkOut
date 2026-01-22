import { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
    return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    const addFavorite = (video) => {
        if (!favorites.some(fav => fav.id.videoId === video.id.videoId)) {
            setFavorites([...favorites, video]);
        }
    };

    const removeFavorite = (videoId) => {
        setFavorites(favorites.filter(video => video.id.videoId !== videoId));
    };

    const isFavorite = (videoId) => {
        return favorites.some(fav => fav.id.videoId === videoId);
    };

    const value = {
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

