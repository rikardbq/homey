import { View } from "../components/container/view";
import marioPoster from "../assets/mario-movie-poster.jpg";
import type { Gamepads } from "../hooks/useGamepad";
import { useMemo, useState } from "react";
import { useRateLimit } from "../hooks/useRateLimit";
import { GAMEPAD_BUTTONS } from "../util/gamepad";

const arr = new Array(10).fill(0);
console.log(arr.length);

type Props = {
    gamepads: Gamepads;
};

export default ({ gamepads }: Props) => {
    const [gamepad1, ..._] = useMemo(() => gamepads, [gamepads]);
    const limitRate = useRateLimit();
    const [focused, setFocused] = useState(arr.map((_, i) => i === 0));
    const [currentFocus, setCurrentFocus] = useState(focused.indexOf(true));

    if (gamepad1) {
        if (gamepad1.buttons[GAMEPAD_BUTTONS.DPAD_LEFT].pressed) {
            if (focused.indexOf(true) !== 0) {
                const nextFocus = focused.indexOf(true) - 1;
                limitRate(
                    () =>
                        setFocused(() => {
                            document
                                .getElementById(`${nextFocus}`)
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            return focused.map((_, i) => i === nextFocus);
                        }),
                    100,
                );
            }
        } else if (gamepad1.buttons[GAMEPAD_BUTTONS.DPAD_RIGHT].pressed) {
            if (focused.indexOf(true) !== arr.length - 1) {
                const nextFocus = focused.indexOf(true) + 1;
                limitRate(
                    () =>
                        setFocused(() => {
                            document
                                .getElementById(`${nextFocus}`)
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            return focused.map((_, i) => i === nextFocus);
                        }),
                    100,
                );
            }
        }
    }

    return (
        <>
            <div className="dropdown mb-24">
                <div tabIndex={0} role="button" className="btn m-1">
                    Theme
                    <svg
                        width="12px"
                        height="12px"
                        className="inline-block h-2 w-2 fill-current opacity-60"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 2048 2048"
                    >
                        <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                    </svg>
                </div>
                <ul
                    tabIndex={-1}
                    className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl"
                >
                    <li>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                            aria-label="Light"
                            value="light"
                        />
                    </li>
                    <li>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                            aria-label="Dracula"
                            value="dracula"
                        />
                    </li>
                    <li>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                            aria-label="Vampire"
                            value="vampire"
                        />
                    </li>
                    <li>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                            aria-label="Mys"
                            value="mys"
                        />
                    </li>
                </ul>
            </div>
            <View>
                <div className="flex flex-row items-center gap-2">
                    {arr.map((x, i) => (
                        <div
                            key={i}
                            id={`${i}`}
                            className={`transition-all duration-150 max-w-64 max-h-64 overflow-clip border-2 ${focused[i] ? "min-w-80 border-primary min-h-80 rounded-xl shadow-[0px_0px_20px_5px_rgba(0,0,0,0.25)] shadow-primary" : "shadow-md min-w-64 min-h-64 rounded-lg border-transparent"}`}
                        >
                            <img className="" src={marioPoster} />
                        </div>
                    ))}
                </div>
            </View>
        </>
    );
};
