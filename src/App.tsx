import GameCanvas from './components/GameCanvas';
import './App.css';
import { useState, useRef } from 'react';

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
);
function App() {
    const [isPaused, setIsPaused] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [resetTrigger, setResetTrigger] = useState(0);

    const handleResume = () => {
        setIsPaused(false);
        canvasRef.current?.focus();
  
    };
    
    const handlePause = () => {
        setIsPaused(true);
        canvasRef.current?.blur();
    };

    const handleReset = () => {
        setResetTrigger(prev => prev + 1); // Incrementamos el contador para disparar el efecto
        handleResume(); // Reanudamos el juego después de resetear
    };

  return (
    <>
      <div className="relative w-screen h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-blue-900">
        <div id="phaser-container" className="w-full h-full">
                <GameCanvas ref={canvasRef} isPaused={isPaused} resetTrigger={resetTrigger} />
        </div>

        {isPaused && (
                <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center backdrop-blur-sm z-20">
                    <h1 className="text-6xl font-bold text-white mb-8 animate-pulse">PAUSA</h1>
                    <button
                        onClick={handleResume}
                        className="px-8 py-4 m-2 bg-green-500 text-white text-2xl font-bold rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Reanudar
                    </button>
                    <button onClick={handleReset} className="px-8 py-4 m-2 bg-red-600 text-white text-2xl font-bold rounded-lg hover:bg-red-700 transition-colors">
                        Resetear Partida
                    </button>
                </div>
            )}
            
            {/* 4. BOTÓN DE PAUSA */}
            {/* Se muestra solo si el juego NO está en pausa */}
            {!isPaused && (
                 <button
                    onClick={handlePause}
                    className="absolute top-5 right-5 p-3 bg-white/20 text-white rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white z-10"
                    aria-label="Pausar el juego"
                >
                    <PauseIcon />
                </button>
            )}
      </div>
    </>
  )
}
export default App

