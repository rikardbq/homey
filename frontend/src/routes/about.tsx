import { Link } from "react-router";

import "../app.css";
import { useEffect, useRef, useState } from "react";
import { GAMEPAD_AXIS, GAMEPAD_BUTTONS } from "../util/gamepad";
import { useDebounce } from "../hooks/useDebounce";
import { useRateLimit } from "../hooks/useRateLimit";
import type { Gamepads } from "../hooks/useGamepad";

type ListItemProps = {
    id: string;
    name: string;
    description?: string;
    focused: boolean;
};

const ListItem = ({ id, name, description: _, focused, ...rest }: any) => {
    return (
        <li id={id} {...rest}>
            <div
                style={{
                    width: "500px",
                    height: "500px",
                    border: focused ? "2px solid green" : "",
                }}
            >
                {name}
            </div>
        </li>
    );
};

const testItems = [
    {
        name: "Netflix",
        desc: "description",
        focused: true,
    },
    {
        name: "N chill",
        desc: "description 2 chill 2",
        focused: false,
    },
    {
        name: "HBO",
        desc: "description 3",
        focused: false,
    },
    {
        name: "PRIME",
        desc: "description 7",
        focused: false,
    },
    {
        name: "Apple TV",
        desc: "description apple",
        focused: false,
    },
];

const keyDownHandler =
    (currFocus: number, setFocused: Function, items: any[]) => (ev: any) => {
        ev.preventDefault();

        console.log(currFocus);

        if (ev.code === "ArrowLeft") {
            if (currFocus === 0) return;
            else setFocused(currFocus - 1);
        } else if (ev.code === "ArrowRight") {
            if (currFocus === items.length - 1) return;
            else setFocused(currFocus + 1);
        }
        console.log(ev.code);
    };

const handleXNav =
    (currFocus: number, setFocused: Function, items: any[]) =>
    (isButtonPressed: Function, moveX: number) => {
        if (isButtonPressed(GAMEPAD_BUTTONS.DPAD_LEFT) || moveX < -0.1) {
            if (currFocus === 0) return;
            else setFocused(currFocus - 1);
        } else if (isButtonPressed(GAMEPAD_BUTTONS.DPAD_RIGHT) || moveX > 0.1) {
            if (currFocus === items.length - 1) return;
            else setFocused(currFocus + 1);
        }
    };

type Props = {
    gamepads: Gamepads;
};

export default ({ gamepads }: Props) => {
    const debounce = useDebounce();
    const limitRate = useRateLimit();
    const gamepad = gamepads[0];
    const [items, setItems] = useState(testItems);
    const [currentFocus, setCurrentFocus] = useState(0);
    const setFocused = (idx: number) => {
        setCurrentFocus(idx);
        setItems(
            items.map((y, i) => ({
                ...y,
                focused: idx === i,
            })),
        );
        document.getElementById(`${idx}`)?.scrollIntoView({
            behavior: "smooth",
        });
    };
    const navHandler = useRef(keyDownHandler(currentFocus, setFocused, items));

    useEffect(() => {
        return () => {
            window.removeEventListener("keydown", navHandler.current);
        };
    }, []);

    useEffect(() => {
        window.removeEventListener("keydown", navHandler.current);
        navHandler.current = keyDownHandler(currentFocus, setFocused, items);
        window.addEventListener("keydown", navHandler.current);
    }, [currentFocus]);

    if (gamepad) {
        if (gamepad.buttons[GAMEPAD_BUTTONS.DPAD_LEFT].pressed) {
            // console.log(gamepad.buttons[GAMEPAD_BUTTONS.DPAD_LEFT]);

            if (currentFocus !== 0) {
                limitRate(() => setFocused(currentFocus - 1), 100);
            }
        } else if (gamepad.buttons[GAMEPAD_BUTTONS.DPAD_RIGHT].pressed) {
            if (currentFocus !== items.length - 1) {
                limitRate(() => setFocused(currentFocus + 1), 100);
            }
        }
    }

    return (
        <>
            <div>
                <ul
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                    }}
                >
                    {items.map((x, idx) => (
                        <ListItem
                            onClick={() => {
                                setFocused(idx);
                            }}
                            id={idx}
                            key={`${x.name}:${idx}`}
                            name={x.name}
                            focused={x.focused}
                        />
                    ))}
                </ul>
            </div>
            <h1>About</h1>
            <Link to="/">Home</Link>
        </>
    );
};
