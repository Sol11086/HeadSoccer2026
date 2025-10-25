import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import estadio from '/img/estadioBlur.png'
import dialog from '/img/infoDialog.png'
import mcLovin from '/img/mclovin.jpeg'
import Navbar from "../components/navbar";
import apiService from "../api/apiService";

interface Usuario {
    id_usuario: number;
    nickname: string;
    correo: string;
    monedas: number;
}

function InfoUser() {
    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('user');
        if (usuarioGuardado) {
            const data = JSON.parse(usuarioGuardado);
            setUsuario(data.usuario ?? data);
        }
    }, []);

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [nickname, setNickname] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const handleChanges = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Enviando cambios:", { id_usuario: usuario?.id_usuario, nickname, correo, contrasena, fechaNacimiento, monedas: usuario?.monedas });

        try {
            const response = await apiService.put("/usuarios/actualizar", {
                id_usuario: usuario?.id_usuario,
                nickname,
                correo,
                contrasena,
                fechaNacimiento,
                monedas: usuario?.monedas
            });
            const data = response.data;
            const payload = data.body || data;
            // Actualizar el estado del usuario con los nuevos datos
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.setItem('token', payload.token);
            localStorage.setItem('user', JSON.stringify(payload.usuario));
            setUsuario(payload.usuario);

            alert("Cambios guardados con éxito");
            window.location.reload();
        } catch (error: any) {
            if (error.response) {
                console.error(error.response.data.body || 'Error: Credenciales incorrectas');
            } else {
                console.error("Error al guardar los cambios:", error);
            }
            
        }
    }

    return (
        <>
            <div>
                <img
                    src={estadio}
                    alt="Fondo"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div>
                    <Navbar isUser={false} />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <img
                        src={dialog}
                        alt="Diálogo"
                        className="absolute w-3/4 h-3/4 mt-20 object-contain"
                    />
                    <div className="relative flex items-center justify-between w-3/4 max-w-5xl px-12 mt-20">
                        <div className="flex flex-col items-center gap-4">
                            <button
                                type="button"
                                className="absolute text-5xl top-0 left-1 text-amber-500 p-2 rounded-full z-10 cursor-pointer"
                                onClick={() => (window.location.href = "/home")}
                            >
                                ←
                            </button>
                            <div className="clip-octagon w-80 h-80 border-4 border-[#24262e] overflow-hidden">
                                <img
                                    src={mcLovin}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                className="mt-2 text-amber-500 text-xl underline decoration-2"
                            >
                                Cambiar imagen
                            </button>
                        </div>
                        <form onSubmit={handleChanges} className="flex flex-col gap-3 w-1/2">
                            <label className="text-black text-left text-2xl">Nickname</label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                style={{ fontFamily: "Arial, sans-serif" }}
                                className="p-2 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                            />

                            <label className="text-black text-left text-2xl">Correo</label>
                            <input
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                style={{ fontFamily: "Arial, sans-serif" }}
                                className="p-2 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                            />

                            <label className="text-black text-left text-2xl">Contraseña</label>
                            <input
                                type="password"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                style={{ fontFamily: "Arial, sans-serif" }}
                                className="p-2 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                            />

                            <label className="text-black text-left text-2xl">
                                Fecha de nacimiento
                            </label>
                            <input
                                type="date"
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                                style={{ fontFamily: "Arial, sans-serif" }}
                                className="h-14 p-2 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                            />

                            <input
                                type="submit"
                                className="mt-6 text-amber-500 text-2xl underline decoration-2 text-center cursor-pointer"
                                value={"Guardar cambios"}
                            />
                        </form>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default InfoUser;