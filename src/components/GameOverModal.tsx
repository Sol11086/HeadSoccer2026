// src/components/GameOverModal.tsx
interface GameOverModalProps {
    winner: string;
    score: string;
    onRestart: () => void;
    onExit: () => void;
}

const GameOverModal = ({ winner, score, onRestart, onExit }: GameOverModalProps) => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 p-10 rounded-3xl border-8 border-blue-600 shadow-2xl text-center transform scale-110">
                <h1 className="text-6xl font-black text-blue-900 mb-2">FIN DEL PARTIDO</h1>
                <h2 className="text-4xl font-bold text-yellow-500 mb-6">{winner}</h2>
                <div className="text-8xl font-black text-gray-600 mb-10 tracking-widest">
                    {score}
                </div>

                <div className="flex gap-6 justify-center">
                    <button
                        onClick={onRestart}
                        className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-2xl rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                        ⚽ Jugar de Nuevo
                    </button>
                    <button
                        onClick={onExit}
                        className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white text-2xl rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                        🏠 Salir al Menú
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameOverModal;