import { createContext, useState, useContext } from 'react';

// יצירת הקונטקסט
const FavoritesContext = createContext();

// הוק מותאם אישית לשימוש נוח בקונטקסט
export const useFavorites = () => {
    return useContext(FavoritesContext);
};

// רכיב ה-Provider
export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    const addFavorite = (video) => {
        // בדיקה אם הסרטון כבר קיים כדי למנוע כפילויות
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

