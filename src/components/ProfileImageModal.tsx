import { motion } from "framer-motion";
import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface ProfileImageModalProps {
    onClose: () => void;
    onSelectImage: (img: string) => void;
}

export default function ChangeImageModal({ onClose , onSelectImage }: ProfileImageModalProps) {

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 p-10 rounded-3xl border-8 border-blue-600 shadow-2xl text-center">

                <h1 className="text-3xl text-white mb-6">Cambiar Imagen</h1>

                <p className="text-white mb-6">Sube tu nueva foto de perfil</p>

                <div className="flex gap-10 m-10">
                    <motion.button
                        className={`relative z-10 w-50 h-50 bg-cover bg-center transition cursor-pointer rounded-xl 
                            ${selectedImage === "/img/DefoultIMG.png" ? "ring-4 ring-green-400 shadow-[0_0_20px_5px_rgba(0,255,0,0.6)]" : ""}
                        `}
                        style={{ backgroundImage: `url('/img/DefoultIMG.png')` }}

                        onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(1.15)")}
                        onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(1)")}

                        onClick={() => {
                            onSelectImage('/img/DefoultIMG.png'); 
                            onClose();                             
                        }}

                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}

                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 1, scale: [1, 1.05, 1] }}

                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    />

                    {/* ----------- MEX ------------- */}

                    <motion.button
                        className={`relative z-10 w-50 h-50 bg-cover bg-center transition cursor-pointer rounded-xl 
                            ${selectedImage === "/img/MexProfile.png" ? "ring-4 ring-green-400 shadow-[0_0_20px_5px_rgba(0,255,0,0.6)]" : ""}
                        `}
                        style={{ backgroundImage: `url('/img/MexProfile.png')` }}

                        onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(1.15)")}
                        onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(1)")}

                        onClick={() => {
                            onSelectImage('/img/MexProfile.png'); 
                            onClose();                             
                        }}

                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}

                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 1, scale: [1, 1.05, 1] }}

                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    />

                    {/* ------------ USA ------------- */}

                    <motion.button
                        className={`relative z-10 w-50 h-50 bg-cover bg-center transition cursor-pointer rounded-xl 
                            ${selectedImage === "/img/USAprofile.png" ? "ring-4 ring-green-400 shadow-[0_0_20px_5px_rgba(0,255,0,0.6)]" : ""}
                        `}
                        style={{ backgroundImage: `url('/img/USAprofile.png')` }}

                        onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(1.15)")}
                        onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(1)")}

                        onClick={() => {
                            onSelectImage('/img/USAprofile.png'); 
                            onClose();                             
                        }}

                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}

                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 1, scale: [1, 1.05, 1] }}

                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                </div>
                <div className="mt-6 px-5 py-4 bg-blue-600 text-black rounded-lg shadow-lg text-center mb-10 justify-center flex items-center gap-4">
                    <InformationCircleIcon className="h-10 w-10" />
                    Compra más personajes para desbloquear más imágenes de perfil!
                </div>

                <button
                    onClick={onClose}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}