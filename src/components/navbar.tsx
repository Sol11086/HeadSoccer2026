/* eslint-disable react-hooks/exhaustive-deps */
import { UserIcon, ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import moneda from '/img/coin.png'
import user from '/assets/icons/Santiago_Gimenez_Icon.png'

interface Usuario {
    id_usuario: number;
    nickname: string;
    correo: string;
    monedas: number;
}

interface NavbarProps {
    isUser?: boolean;
}

function Navbar({ isUser = true }: NavbarProps) {

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('user');
        if (usuarioGuardado) {
            const data = JSON.parse(usuarioGuardado);
            setUsuario(data.usuario ?? data);
            console.log(data);
        } else {
            handleLogout();
        }
    }, [isUser]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (

        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0.1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed z-50 top-0 left-0 w-full h-25 bg-[#3f4253] border-b-4 border-t-4 gap-30 border-[#1F1B1B] 
          justify-between flex items-center px-8 text-white text-2xl font-bold shadow-md"
            style={{
                boxShadow: "inset 0 4px 0 #808CB7"
            }}>

                <div className='flex items-center gap-30'>
                    <img
                        src={user}
                        alt="icono"
                        className="absolute w-16 left-5 h-16 object-cover"
                    />
                    <input
                        type="text"
                        style={{ fontFamily: "Arial, sans-serif" }}
                        readOnly
                        value={usuario?.nickname || 'Invitado'}
                        className="pl-7 rounded-md ml-10 h-10 text-[#c4c2c2] bg-[#1F1B1B] outline-none"
                    />
                    <img
                        src={moneda}
                        alt="icono"
                        className="absolute w-16 left-121 h- object-cover"
                    />
                    <input
                        type="number"
                        style={{ fontFamily: "Arial, sans-serif" }}
                        readOnly
                        value={usuario?.monedas || 0}
                        className="pl-7 text-[#c4c2c2] rounded-md h-10 bg-[#1F1B1B] outline-none"
                    />
                </div>

            <div className='flex items-center gap-10'>
                {isUser && (
                    <button
                        type="button"
                        className="stroke-2 stroke-[#808CB7] text-gray-700 cursor-pointer"
                        onClick={() => (window.location.href = "/user")} >
                        <UserIcon className="h-12 w-12 text-[#1F1B1B] " />
                    </button>
                )}
                <button type="button" className="cursor-pointer" onClick={() => handleLogout()}>
                    <ArrowRightEndOnRectangleIcon className="h-12 w-12 text-[#1F1B1B] " />
                </button>
            </div>
        </motion.div>
    );
}
export default Navbar;