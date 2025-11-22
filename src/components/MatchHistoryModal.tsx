import { useEffect, useState } from 'react';
import apiService from '../api/apiService';
import { Characters } from '../data/Characters'; // Asegúrate de que la ruta sea correcta

interface Match {
    id_partido: number;
    fecha_partido: string;
    jugador_2: string; 
    resultado: 'Ganado' | 'Perdido' | 'Empate';
    monedas: number;
    goles_favor: number;
    goles_contra: number;
    id_personaje: number;
}

interface MatchHistoryModalProps {
    onClose: () => void;
}

const MatchHistoryModal = ({ onClose }: MatchHistoryModalProps) => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await apiService.get('/partidos');
                if (!response.data.error) {
                    setMatches(response.data.body);
                }
            } catch (error) {
                console.error("Error cargando historial:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getCharNameById = (id: number) => {
        const char = Characters.find(c => c.id === id);
        return char ? char.name : "Desconocido";
    };

    const getCharNameBySkin = (skinKey: string) => {
        const char = Characters.find(c => c.skinKey === skinKey);
        return char ? char.name : skinKey;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className=" w-full max-w-4xl h-[80vh] rounded-3xl border-8 border-[#1c1c1f] shadow-2xl flex flex-col overflow-hidden relative">
                
                <div className="bg-[#3f4253] p-6 flex justify-between items-center rounded-[1px_1px_0_0]">
                    <h2 className="text-4xl font-black text-white tracking-widest">HISTORIAL DE PARTIDOS</h2>
                    <button 
                        onClick={onClose}
                        className="text-white text-4xl font-bold hover:text-yellow-400 transition cursor-pointer"
                    >
                        ✖
                    </button>
                </div>

                {/* Lista Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-800">
                    {loading ? (
                        <p className="text-2xl text-center text-gray-500 mt-10">Cargando historial...</p>
                    ) : matches.length === 0 ? (
                        <p className="text-2xl text-center text-gray-500 mt-10">Aún no has jugado ningún partido.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {matches.map((match) => (
                                <div 
                                    key={match.id_partido} 
                                    className={`flex items-center justify-between p-4 rounded-xl border-l-8 shadow-md bg-gray-200
                                        ${match.resultado === 'Ganado' ? 'border-green-500' : 
                                          match.resultado === 'Perdido' ? 'border-red-500' : 'border-gray-500'}`}
                                >
                                    {/* Info Izquierda: Personajes */}
                                    <div className="flex flex-col">
                                        <span className="text-lg text-gray-700">
                                            Tú: <span className="text-blue-600">{getCharNameById(match.id_personaje)}</span>
                                        </span>
                                        <span className="text-m text-gray-500">
                                            VS: {getCharNameBySkin(match.jugador_2)}
                                        </span>
                                        <span className="text-sm text-gray-400 mt-1">{formatDate(match.fecha_partido)}</span>
                                    </div>

                                    {/* Resultado Central */}
                                <div className="text-center flex flex-col items-center w-40">
                                    <div className="text-4xl font-black text-blue-900 tracking-widest mb-1">
                                        {match.goles_favor} - {match.goles_contra}
                                    </div>

                                    {/* Etiqueta de resultado */}
                                    <span className={`text-xl uppercase px-2 py-1 rounded-md
                                        ${match.resultado === 'Ganado' ? 'text-green-700' : 
                                          match.resultado === 'Perdido' ? 'text-red-700' : 'text-gray-600'}`}
                                    >
                                        {match.resultado}
                                    </span>
                                </div>

                                    {/* Monedas Derecha */}
                                    <div className="flex items-center gap-2 min-w-[100px] justify-end">
                                        {match.monedas > 0 ? (
                                            <>
                                                <span className="text-2xl font-bold text-yellow-600">+{match.monedas}</span>
                                                <img src="/img/coin.png" className="w-10 h-10" />
                                            </>
                                        ) : (
                                            <span className="text-xl font-bold text-gray-400">--</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchHistoryModal;