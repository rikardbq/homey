import { Routes, Route } from "react-router";
import Home from "./routes/home";
import About from "./routes/about";
import TestingHome from "./routes/testing_home";
import { useGamepad } from "./hooks/useGamepad";

export default () => {
    const gamepads = useGamepad({ pollRate: 16 });
    return (
        <Routes>
            <Route path="/" element={<Home gamepads={gamepads} />} />
            <Route path="/about" element={<About gamepads={gamepads} />} />
            <Route path="/testing_home" element={<TestingHome />} />
        </Routes>
    );
};
