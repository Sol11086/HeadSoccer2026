import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Characters } from '../data/Characters'; 
import estadio from '/img/estadioBlur.png';
import Navbar from '../components/navbar';

const MatchSetup = () => {
    const navigate = useNavigate();
    const [p1Index, setP1Index] = useState(0); 
    const [p2Index, setP2Index] = useState(1); 

    const p1 = Characters[p1Index];
    const p2 = Characters[p2Index];

    const handleStartMatch = () => {
        navigate('/game', { 
            state: { 
                p1Skin: p1.skinKey, 
                p2Skin: p2.skinKey 
            } 
        });
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
                text-white text-3xl font-black rounded-full shadow-2xl border-4 border-purple-900 cursor-pointer z-50 tracking-wide"
            >
                Regresar
            </motion.button>

                {/* --- JUGADOR 1 (Izquierda) --- */}
                <div className="flex flex-col items-center gap-6 p-8 bg-blue-900/80 rounded-3xl border-4 border-blue-500 backdrop-blur-sm">
                    <h2 className="text-4xl font-black text-white tracking-widest">JUGADOR 1</h2>
                    
                    {/* Selector Simple */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setP1Index((prev) => (prev - 1 + Characters.length) % Characters.length)}
                            className="text-5xl text-white hover:text-yellow-400 transition cursor-pointer">
                            ◀
                        </button>
                        
                        <div className="relative w-48 h-48 bg-white/10 rounded-full overflow-hidden border-4 border-white">
                            {/* Aquí podrías poner el CharacterPreview si quisieras, por ahora la imagen */}
                            <img src={p1.faceImg} className="w-full h-full object-cover" />
                        </div>

                        <button 
                            onClick={() => setP1Index((prev) => (prev + 1) % Characters.length)}
                            className="text-5xl text-white hover:text-yellow-400 transition cursor-pointer">
                            ▶
                        </button>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <img src={p1.flagImg} className="w-8 h-6 shadow-md" />
                            <span className="text-xl text-gray-300 ">{p1.country}</span>
                        </div>
                        <h3 className="text-3xl text-white">{p1.name}</h3>
                    </div>
                </div>

                {/* --- VS --- */}
                <div className="text-8xl font-black text-yellow-500 italic drop-shadow-lg">VS</div>

                {/* --- JUGADOR 2 (Derecha) --- */}
                <div className="flex flex-col items-center gap-6 p-8 bg-red-900/80 rounded-3xl border-4 border-red-500 backdrop-blur-sm">
                    <h2 className="text-4xl font-black text-white tracking-widest">JUGADOR 2</h2>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setP2Index((prev) => (prev - 1 + Characters.length) % Characters.length)}
                            className="text-5xl text-white hover:text-yellow-400 transition cursor-pointer">
                            ◀
                        </button>
                        
                        <div className="relative w-48 h-48 bg-white/10 rounded-full overflow-hidden border-4 border-white">
                            <img src={p2.faceImg} className="w-full h-full object-cover" />
                        </div>

                        <button 
                            onClick={() => setP2Index((prev) => (prev + 1) % Characters.length)}
                            className="text-5xl text-white hover:text-yellow-400 transition cursor-pointer">
                            ▶
                        </button>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <img src={p2.flagImg} className="w-8 h-6 shadow-md" />
                            <span className="text-xl text-gray-300">{p2.country}</span>
                        </div>
                        <h3 className="text-3xl text-white">{p2.name}</h3>
                    </div>
                </div>
            </div>

            {/* BOTÓN INICIAR */}
            <motion.button
                onClick={handleStartMatch}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 px-12 py-4 bg-gradient-to-r from-green-500 to-green-700 
                text-white text-3xl font-black rounded-full shadow-2xl border-4 border-green-900 cursor-pointer z-50 tracking-wide"
            >
                ¡COMENZAR PARTIDO!
            </motion.button>
        </>
    );
};

export default MatchSetup;