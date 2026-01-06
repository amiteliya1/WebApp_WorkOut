import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
    // קריאת הערך הראשוני מ-localStorage
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // פונקציה לעדכון הערך
    const setValue = (value) => {
        try {
            // תמיכה בפונקציה כמו setState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
};

