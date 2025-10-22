import { Routes, Route, Link } from "react-router-dom";
import Login from "./view/Login.tsx";
import Home from "./view/Home.tsx";
import Game from "./components/GameCanvas.tsx";
import './App.css';

function App() {
    return (
        <>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
                </Routes>
            </div>
        </>
    )
}
export default App

