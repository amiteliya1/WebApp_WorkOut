import { useState, useEffect } from 'react';
import { getTheme, updateTheme } from '../services/theme.api';

export const useTheme = () => {
    const [theme, setTheme] = useState('dark'); // Default to dark
    const [loading, setLoading] = useState(true);

    // Load theme from database on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const userTheme = await getTheme();
                setTheme(userTheme);
                document.body.className = userTheme === 'light' ? 'light-theme' : 'dark-theme';
            } catch (error) {
                console.error('Failed to load theme, using default:', error);
                // If error (e.g., not logged in), use default theme
            } finally {
                setLoading(false);
            }
        };

        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.className = newTheme === 'light' ? 'light-theme' : 'dark-theme';

        // Save to database
        try {
            await updateTheme(newTheme);
            console.log(`Theme updated to ${newTheme} in database`);
        } catch (error) {
            console.error('Failed to save theme to database:', error);
            // Revert on error
            setTheme(theme);
            document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
        }
    };

    return [theme, toggleTheme, loading];
};


