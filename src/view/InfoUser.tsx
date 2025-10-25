import { motion, AnimatePresence } from "framer-motion";
import estadio from '/img/estadioBlur.png'
import moneda from '/img/moneda-de-un-dolar.png'
import user from '/img/User.png'
import dialog from '/img/infoDialog.png'
import mcLovin from '/img/mclovin.jpeg'
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";

function infoUser() {
    return (
        <>
            <div>
                <img
                    src={estadio}
                    alt="Fondo"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="fixed z-50 top-0 left-0 w-full h-25 bg-[#3f4253] border-b-4 border-t-4 border-[#1F1B1B]
                     justify-between flex items-center px-8 text-white text-2xl font-bold shadow-md"
                    style={{
                        boxShadow: "inset 0 4px 0 #808CB7",
                    }}
                >
                    <div className="flex items-center gap-30">
                        <img
                            src={user}
                            alt="icono"
                            className="absolute w-16 left-5 h-16 object-cover"
                        />
                        <input
                            type="text"
                            style={{ fontFamily: "Arial, sans-serif" }}
                            readOnly
                            value="Nickname"
                            className="pl-7 rounded-md ml-10 h-10 text-[#c4c2c2] bg-[#1F1B1B] outline-none"
                        />
                        <img
                            src={moneda}
                            alt="icono"
                            className="absolute w-18 left-120 h- object-cover"
                        />
                        <input
                            type="number"
                            style={{ fontFamily: "Arial, sans-serif" }}
                            readOnly
                            value="50"
                            className="pl-7 text-[#c4c2c2] rounded-md h-10 bg-[#1F1B1B] outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-10">
                        <button
                            type="button"
                            className="cursor-pointer"
                            onClick={() => (window.location.href = "/")}
                        >
                            <ArrowRightEndOnRectangleIcon className="h-12 w-12 text-[#1F1B1B]" />
                        </button>
                    </div>
                </motion.div>
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
                                className="absolute text-5xl top-2 left-1 text-amber-500 p-2 rounded-full z-10"
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
                        <form className="flex flex-col gap-3 w-1/2">
                            <label className="text-black text-left text-2xl">Nombre</label>
                            <input
                                type="text"
                                style={{ fontFamily: "Arial, sans-serif" }}
                                className="p-2 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                            />

                            <label className="text-black text-left text-2xl">Correo</label>
                            <input
                                type="email"
                                style={{ fontFamily: "Arial, sans-serif" }}
                                className="p-2 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                            />

                            <label className="text-black text-left text-2xl">Contraseña</label>
                            <input
                                type="password"
                                style={{ fontFamily: "Arial, sans-serif" }}
                                className="p-2 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                            />

                            <label className="text-black text-left text-2xl">
                                Fecha de nacimiento
                            </label>
                            <input
                                type="date"
                                style={{ fontFamily: "Arial, sans-serif" }}
                                className="h-14 p-2 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                            />

                            <button
                                type="button"
                                className="mt-6 text-amber-500 text-2xl underline decoration-2"
                            >
                                Editar información
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default infoUser;