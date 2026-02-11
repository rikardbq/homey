import { useCallback, useEffect, useState } from "react";

export type Gamepads = (Gamepad | null)[];
type GamepadsOptions = {
    pollRate?: number;
    stickDeadZone?: number;
};

const DEFAULT_OPTIONS = { pollRate: 100, stickDeadZone: 0.1 };

export const useGamepad = ({
    pollRate,
    stickDeadZone: _,
}: GamepadsOptions = DEFAULT_OPTIONS) => {
    // const start = useRef(0);
    // const gamepadsRef = useRef<Gamepads>([]);
    const [gamepads, setGamepads] = useState<Gamepads>([]);

    const connectedHandler = useCallback((ev: GamepadEvent) => {
        const evGamepad = ev.gamepad;
        const navigatorGamepads = navigator.getGamepads();

        if (navigatorGamepads[evGamepad.index]) {
            console.debug(`GAMEPAD ${evGamepad.index} EXISTS, POPULATE LIST`);

            setGamepads(navigatorGamepads);
        }

        // classic gameloop
        // gamepadLoop();
    }, []);
    const disconnectedHandler = useCallback((ev: GamepadEvent) => {
        const gamepad = ev.gamepad;
        setGamepads(gamepads.filter((_x, idx) => idx === gamepad.index));

        // classic gameloop
        // delete gamepadsRef.current[gamepad.index];
        // cancelAnimationFrame(start.current);
    }, []);
    // const gamepadLoop = useCallback(() => {
    //     // console.debug("START_OF=gamepadLoop");
    //     if (gamepadsRef.current.length === 0) {
    //         return;
    //     }

    //     setTimeout(() => {
    //         start.current = requestAnimationFrame(gamepadLoop);
    //     }, pollRate);
    // }, []);

    // alternative gamepad loop
    useEffect(() => {
        const gamepads = navigator.getGamepads();
        if (gamepads.length === 0) {
            return;
        }
        setTimeout(() => {
            setGamepads(gamepads);
        }, pollRate);
    });

    useEffect(() => {
        window.addEventListener("gamepadconnected", connectedHandler);
        window.addEventListener("gamepaddisconnected", disconnectedHandler);

        return () => {
            window.removeEventListener("gamepadconnected", connectedHandler);
            window.removeEventListener(
                "gamepaddisconnected",
                disconnectedHandler,
            );
        };
    }, []);

    return gamepads;
};
