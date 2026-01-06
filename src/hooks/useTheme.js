import { useLocalStorage } from './useLocalStorage';

export const useTheme = () => {
    const [theme, setTheme] = useLocalStorage('theme', 'dark');

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return [theme, toggleTheme];
};

