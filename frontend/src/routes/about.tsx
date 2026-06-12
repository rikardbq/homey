import { Link } from "react-router";

import "../app.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRateLimit } from "../hooks/useRateLimit";
import type { GamepadUtils } from "../hooks/useGamepad";
import NoiseFilter from "../components/svg/NoiseFilterTear2";
import { useDebounce } from "../hooks/useDebounce";

const testItems = [
    {
        name: "Paramount+",
        desc: "Halo",
        focused: false,
        vendor: "paramount",
    },
    {
        name: "Netflix",
        desc: "description",
        focused: false,
        vendor: "netflix",
    },
    {
        name: "HBO",
        desc: "description 3",
        focused: false,
        vendor: "hbo",
    },
    {
        name: "PRIME",
        desc: "description 7",
        focused: false,
        vendor: "prime",
    },
    {
        name: "Apple TV",
        desc: "description apple",
        focused: false,
        vendor: "appletv",
    },
    {
        name: "Viaplay",
        desc: "aaaaaaaaaa",
        focused: false,
        vendor: "viaplay",
    },
    {
        name: "chromecast",
        desc: "aaaaaaaaaa",
        focused: false,
        vendor: "chromecast",
    },
];

const keyDownHandler =
    (
        currFocus: number,
        setFocused: Function,
        list: any[],
        padded_list: any[],
    ) =>
    (ev: any) => {
        ev.preventDefault();
        const list_threshold = list.length > 3 ? 3 : list.length;
        if (ev.code === "ArrowLeft" || ev.code === "ArrowUp") {
            const nextFocus = currFocus - 1;
            const willoop = nextFocus < list_threshold;
            setFocused(
                willoop ? padded_list.length - (list_threshold + 1) : nextFocus,
            );
        } else if (ev.code === "ArrowRight" || ev.code === "ArrowDown") {
            const nextFocus = currFocus + 1;
            const willoop =
                nextFocus > padded_list.length - (list_threshold + 1);
            setFocused(willoop ? list_threshold : nextFocus);
        }
        console.log(ev.code);
    };

type Props = {
    gamepadUtils: GamepadUtils;
};

const getKeyFrameAnim = (
    idx: number,
    current_focus: number,
    previous_focus: number,
) => {
    for (let i = 1; i <= 3; i++) {
        let pn = undefined;
        if (idx === current_focus - i) pn = `left-${i}`;
        if (idx === current_focus + i) pn = `right-${i}`;
        if (pn) {
            if (current_focus > previous_focus) return `${pn} r`;
            if (current_focus < previous_focus) return `${pn} l`;
            return pn;
        }
    }

    return "";
};

const willoopStyles = (
    idx: number,
    current_focus: number,
    list: any[],
    padded_list: any[],
) => {
    const list_threshold = list.length > 3 ? 3 : list.length;
    let classes = "";
    if (
        current_focus === list_threshold &&
        idx === padded_list.length - (list_threshold + 1)
    ) {
        classes = "loop l";
    }
    if (
        current_focus === padded_list.length - (list_threshold + 1) &&
        idx === 3
    ) {
        classes = "loop r";
    }

    return classes;
};

const calcNextFocus = (
    list: any[],
    padded_list: any[],
    currFocus: number,
    direction: number,
) => {
    const list_threshold = list.length > 3 ? 3 : list.length;
    const nextFocus = currFocus + direction;
    const willoopLeft = nextFocus < list_threshold;
    const willoopRight = nextFocus > padded_list.length - (list_threshold + 1);

    return willoopLeft
        ? padded_list.length - (list_threshold + 1)
        : willoopRight
          ? list_threshold
          : nextFocus;
};

export default ({
    gamepadUtils: {
        gamepads,
        isButtonPressed,
        stick: { moveX: _moveX, moveY, deadzone },
    },
}: Props) => {
    const [canTouchMove, setCanTouchMove] = useState(false);
    const [scrollUpdateRate, setScrollUpdateRate] = useState(30);
    const [scrollUpdateRateShrinkVal, setScrollUpdateRateShrinkVal] =
        useState(0);
    const [touchTimes, setTouchTimes] = useState([0, 0]);
    const [touchPos, setTouchPos] = useState([0, 0]);
    const [touchMovePos, setTouchMovePos] = useState([0, 0]);
    const [touchMoveTickY, setTouchMoveTickY] = useState(0);
    const limitRate = useRateLimit();
    const debounce = useDebounce();
    const [focusedElem, _setFocusedElem] = useState("back_btn");
    const gamepad = useMemo(() => gamepads[0], [gamepads]);
    const [items, _setItems] = useState([
        ...testItems.slice(-3),
        ...testItems,
        ...testItems.slice(0, 3),
    ]);
    const [previousFocus, setPreviousFocus] = useState({
        idx: Math.floor(items.length / 2),
        vendor: items[Math.floor(items.length / 2)].vendor,
    });
    const [currentFocus, setCurrentFocus] = useState({
        idx: previousFocus.idx,
        vendor: previousFocus.vendor,
    });
    const setFocused = (nextFocus: number) => {
        const pfocus =
            nextFocus - currentFocus.idx > 1
                ? nextFocus + 1
                : nextFocus - currentFocus.idx < -1
                  ? nextFocus - 1
                  : currentFocus.idx;
        setPreviousFocus({
            idx: pfocus,
            vendor: items[pfocus].vendor,
        });

        setCurrentFocus({ idx: nextFocus, vendor: items[nextFocus].vendor });
        document.getElementById(`${nextFocus}`)?.scrollIntoView({
            behavior: "smooth",
        });
    };
    // const setFocused = (idx: number) => {
    //     setPreviousFocus(currentFocus);
    //     setCurrentFocus(idx);
    //     // setItems(
    //     //     items.map((y, i) => ({
    //     //         ...y,
    //     //         focused: idx === i,
    //     //     })),
    //     // );
    //     document.getElementById(`${idx}`)?.scrollIntoView({
    //         behavior: "smooth",
    //     });
    // };
    const navHandler = useRef(
        keyDownHandler(currentFocus.idx, setFocused, testItems, items),
    );

    useEffect(() => {
        return () => {
            window.removeEventListener("keydown", navHandler.current);
        };
    }, []);

    useEffect(() => {
        window.removeEventListener("keydown", navHandler.current);
        navHandler.current = keyDownHandler(
            currentFocus.idx,
            setFocused,
            testItems,
            items,
        );
        window.addEventListener("keydown", navHandler.current);
    }, [currentFocus]);

    useEffect(() => {
        if (gamepad) {
            const list_threshold = testItems.length > 3 ? 3 : testItems.length;
            if (
                isButtonPressed(gamepad, "XBOX.DPAD_UP") ||
                moveY(gamepad, "LEFT_STICK") < 0 - deadzone
            ) {
                const nextFocus = currentFocus.idx - 1;
                const willoop = nextFocus < list_threshold;
                limitRate(
                    () =>
                        setFocused(
                            willoop
                                ? items.length - (list_threshold + 1)
                                : nextFocus,
                        ),
                    100,
                    "gamepad",
                );
            } else if (
                isButtonPressed(gamepad, "XBOX.DPAD_DOWN") ||
                moveY(gamepad, "LEFT_STICK") > 0 + deadzone
            ) {
                const nextFocus = currentFocus.idx + 1;
                const willoop = nextFocus > items.length - (list_threshold + 1);
                limitRate(
                    () => setFocused(willoop ? list_threshold : nextFocus),
                    100,
                    "gamepad",
                );
            }
        }

        // SCROLL TOUCH HANDLING
        if (touchTimes[1] !== 0 && scrollUpdateRate > 5) {
            limitRate(
                () => {
                    const time = touchTimes[1] - touchTimes[0];
                    const distance = touchPos[0] - touchPos[1];
                    const vel = Math.abs(time / distance);
                    const nsv =
                        scrollUpdateRateShrinkVal +
                        (vel === Infinity ? 0 : vel);

                    setFocused(
                        calcNextFocus(
                            testItems,
                            items,
                            currentFocus.idx,
                            distance > 0 ? 1 : distance === 0 ? 0 : -1,
                        ),
                    );
                    setScrollUpdateRateShrinkVal(nsv);
                    if (!canTouchMove) {
                        setScrollUpdateRate(scrollUpdateRate - nsv);
                    }
                },
                1000 / scrollUpdateRate,
                "touch_scroll",
            );
        }
        // SCROLL TOUCH HANDLING END
    });

    // prevent list from getting bounds issues
    // split list
    // floor value
    // slice from index floor val
    // take original list and slice on index 0 up to its split floor val
    // combine with first list slice
    /*
    > let list = [1,2,3,4,5];
    > let list_s1 = list.slice(Math.floor(list.length / 2));
    > list_s1
    [ 3, 4, 5 ]
    > let list_s2 = list.slice(0, Math.floor(list.length / 2))
    > list_s2
    [ 1, 2 ]
    > [...list_s1, ...list_s2]
    [ 3, 4, 5, 1, 2 ]
    >
    */

    return (
        <div
            className="absolute inset-0 bg-no-repeat bg-cover overflow-hidden"
            style={{
                backgroundImage: "url(../vendor/chromecast/wp.png)",
            }}
        >
            <NoiseFilter />
            <div
                className="absolute inset-0 bg-no-repeat"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, black 25%, transparent 100%)",
                }}
            />
            <div className="flex flex-row w-full h-full">
                <div
                    className="x-items w-1/2 content-center justify-items-center z-10"
                    onMouseDown={(e) => {
                        const startTime = Date.now();
                        setTouchTimes([startTime, 0]);
                        const startY = e.clientY;
                        setScrollUpdateRate(30);
                        setScrollUpdateRateShrinkVal(0);
                        setTouchPos([startY, 0]);
                        setTouchMovePos([startY, 0]);
                        setTouchMoveTickY(startY);
                        setCanTouchMove(true);
                    }}
                    onMouseMove={(e) => {
                        if (canTouchMove) {
                            const y = e.clientY;
                            const delta = touchMoveTickY - y;
                            if (Math.abs(delta) > 30) {
                                setFocused(
                                    calcNextFocus(
                                        testItems,
                                        items,
                                        currentFocus.idx,
                                        delta > 0 ? 1 : delta === 0 ? 0 : -1,
                                    ),
                                );
                                setTouchMoveTickY(y);
                            }
                            setTouchMovePos([
                                touchMovePos[1] !== 0 ? touchMovePos[1] : y,
                                y,
                            ]);
                            debounce(
                                () => {
                                    setTouchMovePos([0, 0]);
                                },
                                150,
                                "touch_move",
                            );
                        }
                    }}
                    onMouseUp={(e) => {
                        setCanTouchMove(false);
                        if (Math.abs(touchMovePos[0] - touchMovePos[1]) >= 7) {
                            const endTime = Date.now();
                            setTouchTimes([touchTimes[0], endTime]);
                            const stopY = e.clientY;
                            setTouchPos([touchPos[0], stopY]);
                        }
                    }}
                >
                    <div>
                        {items.map((x, idx) => {
                            let fontFamily = "FetteUnzFraktur";
                            let textColor = "#FF4444";
                            if (x.name === "chromecast") {
                                fontFamily = "Cyberpunk";
                                textColor = "#ffff44";
                            }
                            return (
                                <div
                                    key={x.vendor}
                                    className={
                                        currentFocus.vendor === "chromecast" &&
                                        currentFocus.idx === idx
                                            ? " glitch-effect-filter"
                                            : ""
                                    }
                                >
                                    <div
                                        key={x.vendor}
                                        className={`absolute text-3xl ${getKeyFrameAnim(idx, currentFocus.idx, previousFocus.idx)}${idx === currentFocus.idx ? ` selected${currentFocus.idx > previousFocus.idx ? " from-r" : currentFocus.idx < previousFocus.idx ? " from-l" : ""}` : ""}${willoopStyles(idx, currentFocus.idx, testItems, items)}`}
                                        style={{
                                            fontFamily,
                                            color: textColor,
                                        }}
                                    >
                                        <div
                                            className={
                                                currentFocus.vendor ===
                                                    "chromecast" &&
                                                idx === currentFocus.idx
                                                    ? " text-glitch-effect"
                                                    : ""
                                            }
                                        >
                                            {x.name.toLowerCase()}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="w-1/2">
                    {items.map((x, idx) => {
                        return (
                            <img
                                key={x.vendor}
                                src={`../vendor/${x.vendor}/select.webp`}
                                className={`absolute scale-150 h-full vendor-image${currentFocus.idx === idx ? " vendor-image-select-slide-in" : ""}${
                                    currentFocus.vendor === "chromecast" &&
                                    currentFocus.idx === idx
                                        ? " glitch-effect-filter"
                                        : ""
                                }`}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="absolute bottom-5 left-8">
                <Link
                    style={{
                        fontFamily: "FetteUnzFraktur",
                        color: "#FF4444",
                        fontSize: "2rem",
                        lineHeight: "normal",
                        borderRadius: "10px",
                        padding: "4px 16px",
                        border:
                            focusedElem === "back_btn"
                                ? "2px solid #dddddd"
                                : "none",
                    }}
                    to="/"
                >
                    back
                </Link>
                {/* <div className="btn btn-error">
                </div> */}
            </div>
        </div>
    );
};
