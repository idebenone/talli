import { useState, useEffect } from 'react';

function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(() => {
        if (typeof window !== "undefined") {
            return navigator.onLine
        }
    });

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}

export default useOnlineStatus;
