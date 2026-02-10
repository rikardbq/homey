import { Routes, Route } from "react-router";
import Home from "./routes/home";
import About from "./routes/about";

export default () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
        </Routes>
    );
};
