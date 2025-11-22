import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Characters } from '../data/Characters'; 
import estadio from '/img/estadioBlur.png';
import Navbar from '../components/navbar';
import apiService from '../api/apiService';

const MatchSetup = () => {
    const navigate = useNavigate();
    const [p1Index, setP1Index] = useState(0); 
    const [p2Index, setP2Index] = useState(1); 

    const [ownedIds, setOwnedIds] = useState<number[]>([1]);

    useEffect(() => {
        // 1. Cargar inventario desde el Backend
        apiService.get('/tienda/mis-personajes')
            .then(res => {
                if (!res.data.error) {
                    setOwnedIds(res.data.body);
                }
            })
            .catch(error => console.error("Error cargando personajes:", error));

        // 2. Cargar la skin que el usuario equipó en el Home
        const savedSkin = localStorage.getItem('lastSkin'); // "Santi", "Gio", etc.
        if (savedSkin) {
            const idx = Characters.findIndex(c => c.skinKey === savedSkin);
            if (idx !== -1) {
                setP1Index(idx);
            }
        }
    }, []);

    const p1 = Characters[p1Index];
    const p2 = Characters[p2Index];

    // Verificar si están bloqueados
    const isP1Locked = !ownedIds.includes(p1.id);
    const isP2Locked = !ownedIds.includes(p2.id);
    
    // Validar si se puede jugar
    const canStart = !isP1Locked && !isP2Locked;

    const handleStartMatch = () => {
        if (!canStart) return;
        navigate('/game', { 
            state: { 
                p1Skin: p1.skinKey, 
                p2Skin: p2.skinKey 
            } 
        });
    };

    const cycleCharacter = (currentIndex: number, direction: number, setIndex: (n: number) => void) => {
        const newIndex = (currentIndex + direction + Characters.length) % Characters.length;
        setIndex(newIndex);
    };

    return (
        <>
            <img src={estadio} alt="Fondo" className="absolute inset-0 w-full h-full object-cover" />
            <Navbar />

            <div className="absolute inset-0 flex items-center justify-center gap-20 pt-20">
                {/* BOTÓN Regresar */}
            <motion.button
                onClick={() => navigate('/home')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="fixed  top-1/6 left-140 -translate-x-1/2 px-12 py-4 bg-gradient-to-r from-purple-500 to-purple-700 
                text-white text-3xl  rounded-full shadow-2xl border-4 border-purple-900 cursor-pointer z-50 tracking-wide"
            >
                Regresar
            </motion.button>
                
                {/* --- JUGADOR 1 (Izquierda) --- */}
                <div className={`flex flex-col items-center gap-6 p-8 rounded-3xl border-4 backdrop-blur-sm transition-colors duration-300
                    ${isP1Locked ? 'bg-gray-900/80 border-gray-600' : 'bg-blue-900/80 border-blue-500'}`}>
                    
                    <h2 className="text-4xl text-white tracking-widest">JUGADOR 1</h2>
                    
                    {/* Selector */}
                    <div className="flex items-center gap-4">
                        <button onClick={() => cycleCharacter(p1Index, -1, setP1Index)} className="text-5xl text-white hover:text-yellow-400 transition cursor-pointer">◀</button>
                        
                        <div className="relative w-48 h-48 bg-white/10 rounded-full overflow-hidden border-4 border-white">
                            <img src={p1.faceImg} className={`w-full h-full object-cover ${isP1Locked ? 'grayscale brightness-50' : ''}`} />
                            
                            {/* CANDADO P1 */}
                            {isP1Locked && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                                    <span className="text-6xl">🔒</span>
                                    <span className="text-red-400 text-lg bg-black/60 px-2 rounded mt-2">BLOQUEADO</span>
                                </div>
                            )}
                        </div>

                        <button onClick={() => cycleCharacter(p1Index, 1, setP1Index)} className="text-5xl text-white hover:text-yellow-400 transition cursor-pointer">▶</button>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <img src={p1.flagImg} className="w-8 h-6 shadow-md" />
                            <span className="text-xl text-gray-300 ">{p1.country}</span>
                        </div>
                        <h3 className={`text-3xl  ${isP1Locked ? 'text-gray-500' : 'text-white'}`}>{p1.name}</h3>
                    </div>
                </div>

                {/* --- VS --- */}
                <div className="text-8xl  text-yellow-500 italic drop-shadow-lg">VS</div>

                {/* --- JUGADOR 2 (Derecha) --- */}
                <div className={`flex flex-col items-center gap-6 p-8 rounded-3xl border-4 backdrop-blur-sm transition-colors duration-300
                    ${isP2Locked ? 'bg-gray-900/80 border-gray-600' : 'bg-red-900/80 border-red-500'}`}>
                    
                    <h2 className="text-4xl text-white tracking-widest">JUGADOR 2</h2>
                    
                    <div className="flex items-center gap-4">
                        <button onClick={() => cycleCharacter(p2Index, -1, setP2Index)} className="text-5xl text-white hover:text-yellow-400 transition cursor-pointer">◀</button>
                        
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white">
                            <img src={p2.faceImg} className={`w-full h-full object-cover ${isP2Locked ? 'grayscale brightness-50' : ''}`} />
                            
                            {/* CANDADO P2 */}
                            {isP2Locked && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                                    <span className="text-6xl">🔒</span>
                                    <span className="text-red-400 text-lg bg-black/60 px-2 rounded mt-2">BLOQUEADO</span>
                                </div>
                            )}
                        </div>

                        <button onClick={() => cycleCharacter(p2Index, 1, setP2Index)} className="text-5xl text-white hover:text-yellow-400 transition cursor-pointer">▶</button>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <img src={p2.flagImg} className="w-8 h-6 shadow-md" />
                            <span className="text-xl text-gray-300 ">{p2.country}</span>
                        </div>
                        <h3 className={`text-3xl ${isP2Locked ? 'text-gray-500' : 'text-white'}`}>{p2.name}</h3>
                    </div>
                </div>
            </div>

            {/* BOTÓN INICIAR */}
            <motion.button
                onClick={handleStartMatch}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute bottom-10 left-1/2 -translate-x-1/2 px-12 py-4 text-3xl rounded-full shadow-2xl border-4 
                    ${canStart 
                        ? 'bg-gradient-to-r from-green-500 to-green-700 text-white border-green-900 cursor-pointer' 
                        : 'bg-gray-600 text-gray-400 border-green-900 cursor-not-allowed grayscale'}`}
            >
                {canStart ? "¡COMENZAR PARTIDO!" : "PERSONAJE BLOQUEADO"}
            </motion.button>
        </>
    );
};

export default MatchSetup;