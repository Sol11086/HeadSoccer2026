import { Routes, Route } from "react-router-dom";
import SecurityPath from "./components/SecurityPath.tsx";
import Login from "./view/Login.tsx";
import Home from "./view/Home.tsx";
import User from "./view/InfoUser.tsx";
import Game from "./components/GameCanvas.tsx";
import './App.css';

function App() {
    return (
        <>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={
                      <SecurityPath>
                        <Home />
                      </SecurityPath>
                     } 
                    />
                    <Route path="/game" element={<Game isPaused={false} resetTrigger={0} />} />
                    <Route path="/user" element={<User />} />
                    <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
                </Routes>
            </div>
        </>
    )
}
export default App

