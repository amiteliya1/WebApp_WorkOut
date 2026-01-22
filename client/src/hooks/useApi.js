import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export const useApi = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const fetchData = useCallback(async () => {
        if (!url) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Include Authorization header if token exists
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await axios({
                url,
                method: options.method || 'GET',
                params: options.params,
                data: options.data,
                headers: {
                    ...headers,
                    ...options.headers,
                },
                ...options.config
            });
            setData(response.data);
        } catch (err) {
            // Improved error handling
            let errorMessage = 'שגיאה בטעינת הנתונים';
            if (err.response) {
                const status = err.response.status;
                if (status === 401 || status === 403) {
                    errorMessage = 'נדרשת התחברות. אנא התחבר מחדש.';
                } else {
                    errorMessage = err.response.data?.error || err.response.data?.message || `שגיאת שרת (${status})`;
                }
            } else if (err.request) {
                errorMessage = 'לא ניתן להתחבר לשרת. ודא שהשרת פועל.';
            } else {
                errorMessage = err.message || 'שגיאה בטעינת הנתונים';
            }
            setError(errorMessage);
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    }, [url, token, JSON.stringify(options.params), JSON.stringify(options.data), options.method, JSON.stringify(options.headers)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};


