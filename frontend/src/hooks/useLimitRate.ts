import { useRef, useCallback, useEffect } from "react";

export const useLimitRate = () => {
    const timer = useRef<number | undefined>(undefined);
    const stack = useRef<{ cb: Function; time: number }[] | undefined>([]);
    const executeTimer = useRef<number | undefined>(undefined);
    const executeStack = useCallback(() => {
        stack.current?.forEach(({ cb }) => cb());
        executeTimer.current = undefined;
        stack.current = [];
    }, []);
    const rateLimiter = useCallback((cb: Function, time: number = 250) => {
        if (!executeTimer.current) {
            executeTimer.current = setTimeout(() => {
                executeStack();
                clearTimeout(timer.current);
            }, 0);
        }
        timer.current = setTimeout(() => {
            stack.current?.push({ cb, time });
        }, time);
    }, []);

    useEffect(() => {
        return () => {
            clearTimeout(executeTimer.current);
            clearTimeout(timer.current);
        };
    }, []);

    return rateLimiter;
};
