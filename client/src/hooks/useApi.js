import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export const useApi = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    
    // Use ref to track if this is the initial mount
    const isInitialMount = useRef(true);

    // Memoize options to prevent unnecessary re-renders
    const stableOptions = useMemo(() => {
        return {
            method: options.method || 'GET',
            params: options.params,
            data: options.data,
            headers: options.headers,
            config: options.config,
        };
    }, [
        options.method,
        // Only include params/data/headers if they're actually provided
        options.params ? JSON.stringify(options.params) : null,
        options.data ? JSON.stringify(options.data) : null,
        options.headers ? JSON.stringify(options.headers) : null,
    ]);

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
                method: stableOptions.method,
                params: stableOptions.params,
                data: stableOptions.data,
                headers: {
                    ...headers,
                    ...stableOptions.headers,
                },
                ...stableOptions.config
            });
            setData(response.data);
        } catch (err) {
            // Improved error handling with Hebrew messages
            let errorMessage = 'שגיאה בטעינת הנתונים';
            if (err.response) {
                const status = err.response.status;
                if (status === 401 || status === 403) {
                    errorMessage = err.response.data?.error || 'נדרשת התחברות. אנא התחבר מחדש.';
                } else if (status === 404) {
                    errorMessage = 'הנתונים המבוקשים לא נמצאו';
                } else if (status >= 500) {
                    errorMessage = err.response.data?.error || 'שגיאת שרת. נסה שוב מאוחר יותר.';
                } else {
                    errorMessage = err.response.data?.error || err.response.data?.message || `שגיאת שרת (${status})`;
                }
            } else if (err.request) {
                // Network error - server is down or unreachable
                errorMessage = 'לא ניתן להתחבר לשרת. ודא שהשרת פועל ונסה שוב.';
            } else {
                errorMessage = err.message || 'שגיאה בטעינת הנתונים';
            }
            setError(errorMessage);
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    }, [url, token, stableOptions]);

    useEffect(() => {
        // Skip initial fetch if options.skipInitialFetch is true
        if (options.skipInitialFetch && isInitialMount.current) {
            isInitialMount.current = false;
            setLoading(false);
            return;
        }
        
        fetchData();
        isInitialMount.current = false;
    }, [fetchData, options.skipInitialFetch]);

    return { data, loading, error, refetch: fetchData };
};


