import { useRef, useCallback } from "react";

export const useRateLimit = () => {
    const rlNowRef = useRef<Record<string, number>>({});
    const rateLimiter = useCallback((cb: Function, time: number = 250, id?: string | number) => {
        const rlNowCurr = rlNowRef.current;
        const rlId = "" + ((id ? parseInt("" + id) : Object.keys(rlNowCurr).length) + 1);
        const now = Date.now();
        if (!rlNowCurr[rlId]) {
            rlNowCurr[rlId] = now;
        }
        if (now > rlNowCurr[rlId] + time) {
            rlNowCurr[rlId] = now;
            cb();
        }
    }, []);

    return rateLimiter;
};
