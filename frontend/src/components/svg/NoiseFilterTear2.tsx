export default () => {
    return (
        <svg
            width="0"
            height="0"
            style={{ position: "absolute" }}
            aria-hidden="true"
        >
            <defs>
                <filter
                    id="glitch2"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.0001 0.05"
                        numOctaves="1"
                        seed="3"
                        result="noise"
                    >
                        <animate
                            attributeName="baseFrequency"
                            values="0.0021 0.09;0.0041 0.07;0.0001 0.08;0.0001 0.0"
                            dur="0.1s"
                            repeatCount="indefinite"
                            keySplines="0.14 0.91 0.41 1.32"
                        ></animate>
                    </feTurbulence>

                    <feComponentTransfer in="noise" result="steppedNoise">
                        <feFuncR
                            type="discrete"
                            tableValues="0 0.25 0.5 0.75 1"
                        />
                    </feComponentTransfer>

                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="steppedNoise"
                        scale="120"
                        xChannelSelector="R"
                        yChannelSelector="R"
                    />
                </filter>
            </defs>
        </svg>
    );
};
