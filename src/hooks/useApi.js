import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useApi = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!url) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios({
                url,
                method: options.method || 'GET',
                params: options.params,
                data: options.data,
                ...options.config
            });
            setData(response.data);
        } catch (err) {
            setError(err.message || 'שגיאה בטעינת הנתונים');
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    }, [url, JSON.stringify(options.params), JSON.stringify(options.data), options.method]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

