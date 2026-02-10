import { Link } from "react-router";

import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "../app.css";

export default () => {
    return (
        <div>
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
            <button className="btn btn-success" onClick={() => {
                document.getElementsByTagName("body")[0].dataset.theme = "light";
            }}>Button</button>
            <button className="btn btn-secondary" onClick={() => {
                document.getElementsByTagName("body")[0].dataset.theme = "mys";
            }}>Two</button>
            <h1>Home</h1>
            <Link to="/about">About</Link>
        </div>
    );
};
