import { Link } from "react-router-dom";

import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "../App.css";

export default () => {
    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Home</h1>
            <Link to="/about">About</Link>
        </>
    );
};
