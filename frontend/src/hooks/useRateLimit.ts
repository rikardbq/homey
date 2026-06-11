import { useRef, useCallback } from "react";

export const useRateLimit = () => {
    // const oldNow = useRef<number>(Date.now());
    const cbNowRef = useRef<Record<string, number>>({});
    const rateLimiter = useCallback((cb: Function, time: number = 250) => {
        const cbStr = cb.toString();
        const cbNow = cbNowRef.current;
        const now = Date.now();
        if (!cbNow[cbStr]) {
            console.log(cbStr);
            
            cbNow[cbStr] = Date.now();
        }
        if (now > cbNow[cbStr] + time) {
            cbNow[cbStr] = now;
            cb();
        }
    }, []);

    return rateLimiter;
};
