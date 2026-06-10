export default () => {
    return (
        <svg
            width="0"
            height="0"
            style={{ position: "absolute" }}
            aria-hidden="true"
        >
            <defs>
                <filter id="glitch">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.0001 0.25"
                        numOctaves="3"
                        result="noise"
                    >
                        <animate
                            attributeName="baseFrequency"
                            values="0.0001 0.25;0.0001 0.35;0.0001 0.15;0.0001 0.25"
                            dur="0.2s"
                            repeatCount="indefinite"
                            keySplines="0.14 0.91 0.41 1.32"
                        />
                    </feTurbulence>
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="50"
                        xChannelSelector="R"
                        yChannelSelector="R"
                    />
                    <feOffset dx="2" result="red" />
                    <feOffset dx="-2" result="blue" />
                    <feBlend in="red" in2="blue" mode="screen" />
                </filter>
            </defs>
        </svg>
    );
};
