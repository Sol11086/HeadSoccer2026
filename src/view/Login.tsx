import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import estadio from '/img/estadioBlur.png'
import logo from '/img/KickHeadz_logo_2 1.png'
import form from '/img/FormBox.png'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'



function App() {
    const [showForm, setShowForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <>
            <div>
                <img
                    src={estadio}
                    alt="Fondo"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <motion.img
                    src={logo}
                    alt="Logo"
                    className="w-3/4 mx-auto my-8 relative z-10"
                    initial={{ scale: 1 }}
                    animate={showForm ? { scale: 0.55, y: -200 } : { scale: [1, 1.08, 1], y: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />
                {!showForm && (
                    <motion.button
                        className="relative z-10 w-92 h-36 bg-cover bg-center transition active:scale-95 cursor-pointer"
                        style={{ backgroundImage: `url('/img/Btn_Comenzar.png')`, }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/Btn_comenzar_hover.png')")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/Btn_Comenzar.png')")}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: showForm ? 0 : 1, scale: [1, 1.08, 1] }}
                        transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
                        onClick={() => setShowForm(true)}
                    />
                )}
                <motion.div
                    className="w-2/4 mx-auto my-8 perspective"
                    initial={{ opacity: 0, scale: 0 , y: 0}}
                    animate={{  opacity: showForm ? 1 : 0, scale: 1 , y: showForm ? -500 : 0}}
                    transition={{ duration: 1, ease: "easeInOut" }}
                >
                    <motion.div
                        className="relative w-full h-full preserve-3d"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    >
                        <div className=" inset-0 backface-hidden">
                            <img src={form} alt="Form" className="w-full" />
                            <div className="absolute inset-0 flex flex-col items-center justify-start pt-35">
                                <form className="w-3/4 flex flex-col gap-6">
                                    <div className="flex flex-col w-full relative">
                                        <span className="text-[#ACACAC] mb-4 text-left text-2xl">Usuario</span>
                                        <input
                                            type="text"
                                            style={{ fontFamily: "Arial, sans-serif" }}
                                            className="p-2 rounded-md mb-14 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                                        />
                                        <span className="text-[#ACACAC] mb-4 text-left text-2xl">Contraseña</span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            style={{ fontFamily: "Arial, sans-serif" }}
                                            className="p-2 pr-12 rounded-md border-4 h-14 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 bottom-4 flex items-center text-gray-700"
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-6 w-6" />
                                            ) : (
                                                <EyeIcon className="h-6 w-6" />
                                            )}
                                        </button>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="rememberMe" className="w-4 h-4" />
                                            <span className="text-amber-50">Recordar mi contraseña</span>
                                        </div>
                                        <div className="flex flex-col gap-2 items-center justify-center w-full mt-15">
                                            <span className="text-white text-2xl">¿No tienes cuenta?</span>
                                            <button
                                                type="button"
                                                onClick={() => setIsFlipped(true)}
                                                className="text-amber-500 text-2xl underline decoration-2"
                                            >
                                                Regístrate
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="absolute inset-0 backface-hidden rotateY-180">
                            <img src={form} alt="Form" className="w-full" />
                            <div className="absolute inset-0 flex flex-col items-center justify-start pt-25">
                                <form className="w-3/4 flex flex-col gap-3">
                                    <span className="text-[#ACACAC] text-left text-2xl">Nombre</span>
                                    <input
                                        type="text"
                                        style={{ fontFamily: "Arial, sans-serif" }}
                                        className="p-2 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                                    />
                                    <span className="text-[#ACACAC] text-left text-2xl">Correo</span>
                                    <input
                                        type="email"
                                        style={{ fontFamily: "Arial, sans-serif" }}
                                        className="p-2 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                                    />
                                    <span className="text-[#ACACAC] text-left text-2xl">Contraseña</span>
                                    <input
                                        type="password"
                                        style={{ fontFamily: "Arial, sans-serif" }}
                                        className="p-2 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                                    />
                                    <span className="text-[#ACACAC] text-left text-2xl">Fecha de nacimiento</span>
                                    <input
                                        type="date"
                                        style={{ fontFamily: "Arial, sans-serif" }}
                                        className=" h-14 p-2 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsFlipped(false)}
                                        className="mt-6 text-amber-500 text-2xl underline decoration-2"
                                    >
                                        Volver a Iniciar Sesión
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
                <motion.button
                    className="relative z-10 w-92 h-36 bg-cover bg-center transition active:scale-95 cursor-pointer overflow-hidden"
                    style={{ backgroundImage: `url('/img/btn_iniciar_hover.png')` }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_iniciar_hover.png')")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/Btn_Iniciar.png')")}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={showForm ? { scale: 1, y: -650 } : { scale: [1, 1, 1], y: 0 }}
                    transition={{ duration: 1, times: [0, 1, 1], ease: "easeInOut" }}
                    onClick={() => (window.location.href = "/home")}
                ></motion.button>
            </div>


        </>
    )
}

export default App
