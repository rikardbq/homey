import { View } from "../components/container/view";
import marioPoster from "../assets/mario-movie-poster.jpg";
import type { GamepadUtils } from "../hooks/useGamepad";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRateLimit } from "../hooks/useRateLimit";
import "../app.css";

const arr = new Array(10).fill(0);
console.log(arr.length);

type Props = {
    gamepadUtils: GamepadUtils;
};

export default ({
    gamepadUtils: { gamepads, isButtonPressed, moveX },
}: Props) => {
    const [gamepad1, ..._] = useMemo(() => gamepads, [gamepads]);
    const limitRate = useRateLimit();
    const [focused, setFocused] = useState(arr.map((_, i) => i === 0));
    const itemRef = useRef(null);

    if (gamepad1) {
        if (
            isButtonPressed(gamepad1, "XBOX.DPAD_LEFT") ||
            moveX(gamepad1, "LEFT_STICK", "left")
        ) {
            if (focused.indexOf(true) !== 0) {
                const nextFocus = focused.indexOf(true) - 1;
                limitRate(
                    () =>
                        setFocused(() => {
                            const elementRef = itemRef.current! as HTMLElement;
                            elementRef.scrollIntoView({
                                behavior: "smooth",
                            });
                            return focused.map((_, i) => i === nextFocus);
                        }),
                    150,
                );
            }
        } else if (
            isButtonPressed(gamepad1, "XBOX.DPAD_RIGHT") ||
            moveX(gamepad1, "LEFT_STICK", "right")
        ) {
            if (focused.indexOf(true) !== arr.length - 1) {
                const nextFocus = focused.indexOf(true) + 1;
                limitRate(
                    () =>
                        setFocused(() => {
                            const elementRef = itemRef.current! as HTMLElement;
                            elementRef.scrollIntoView({
                                behavior: "smooth",
                            });
                            return focused.map((_, i) => i === nextFocus);
                        }),
                    150,
                );
            }
        }
    }

    return (
        <View>
            <div className="tesst flex flex-row items-end h-lvh gap-2">
                {arr.map((_x, i) => (
                    <div
                        ref={focused.indexOf(true) === i ? itemRef : null}
                        key={i}
                        id={`${i}`}
                        className={`transition-all duration-150 max-w-64 max-h-64 overflow-clip border-2 ${focused[i] ? "min-w-80 border-primary min-h-80 rounded-xl shadow-[0px_0px_20px_5px_rgba(0,0,0,0.25)] shadow-primary" : "shadow-md min-w-64 min-h-64 rounded-lg border-transparent"}`}
                    >
                        <img className="" src={marioPoster} />
                    </div>
                ))}
            </div>
        </View>
    );
};
