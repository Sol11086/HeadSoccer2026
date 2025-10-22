import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import estadio from '/img/estadioBlur.png'
import logo from '/img/KickHeadz_logo_2 1.png'
import form from '/img/FormBox.png'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom';


function App() {
    const [showForm, setShowForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [nickname, setNickname] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contrasena })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Error en el login');
            } else {
                setUsuario(data.usuario); // Guarda el usuario en estado
                console.log('Usuario logueado:', data.usuario);

                // Navegar sin recargar la página
                navigate('/home');
            }
        } catch (err) {
            console.error('Error de conexión:', err);
            setError('No se pudo conectar al servidor');
        }
    };

    const handleRegistro = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMensaje("");

        try {
            const response = await fetch("http://localhost:4000/api/usuarios/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nickname, correo, contrasena, fechaNacimiento }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detalle || data.message || "Error registrando usuario");
            }

            setMensaje("Usuario registrado con éxito");
            // Opcional: limpiar formulario
            setNickname("");
            setCorreo("");
            setContrasena("");
            setFechaNacimiento("");

        } catch (err: any) {
            setError(err.message);
            console.error("Error en registro:", err);
        }
    };

    return (
        <>
            <div className='overflow-hidden'>
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
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{ opacity: showForm ? 1 : 0, scale: 1, y: showForm ? -500 : 0 }}
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
                                <form onSubmit={handleLogin} className="w-3/4 flex flex-col gap-6">
                                    <div className="flex flex-col w-full relative">
                                        <span className="text-[#ACACAC] mb-4 text-left text-2xl">Correo</span>
                                        <input
                                            type="text"
                                            style={{ fontFamily: "Arial, sans-serif" }}
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                            className="p-2 rounded-md mb-14 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                                        />
                                        <span className="text-[#ACACAC] mb-4 text-left text-2xl">Contraseña</span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            style={{ fontFamily: "Arial, sans-serif" }}
                                            value={contrasena}
                                            onChange={(e) => setContrasena(e.target.value)}
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
                                    {error && <span className="text-red-500">{error}</span>}
                                </form>
                                {/* {usuario && (
                                    <div className="mt-4">
                                        <h2>Bienvenido, {usuario.nickname}</h2>
                                        <p>Correo: {usuario.correo}</p>
                                        <p>Monedas: {usuario.monedas}</p>
                                    </div>
                                )} */}
                            </div>
                        </div>
                        <div className="absolute inset-0 backface-hidden rotateY-180">
                            <img src={form} alt="Form" className="w-full" />
                            <div className="absolute inset-0 flex flex-col items-center justify-start pt-25">
                                <form onSubmit={handleRegistro} className="w-3/4 flex flex-col gap-3">
                                    <span className="text-[#ACACAC] text-left text-2xl">Nombre</span>
                                    <input
                                        type="text"
                                        style={{ fontFamily: "Arial, sans-serif" }}
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        className="p-2 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                                    />
                                    <span className="text-[#ACACAC] text-left text-2xl">Correo</span>
                                    <input
                                        type="email"
                                        style={{ fontFamily: "Arial, sans-serif" }}
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        className="p-2 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                                    />
                                    <span className="text-[#ACACAC] text-left text-2xl">Contraseña</span>
                                    <input
                                        type="password"
                                        style={{ fontFamily: "Arial, sans-serif" }}
                                        value={contrasena}
                                        onChange={(e) => setContrasena(e.target.value)}
                                        className="p-2 h-14 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                                    />
                                    <span className="text-[#ACACAC] text-left text-2xl">Fecha de nacimiento</span>
                                    <input
                                        type="date"
                                        style={{ fontFamily: "Arial, sans-serif" }}
                                        value={fechaNacimiento}
                                        onChange={(e) => setFechaNacimiento(e.target.value)}
                                        className=" h-14 p-2 border-4 w-full bg-[#EBECE9] border-[#24262e] outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsFlipped(false)}
                                        className="mt-6 text-amber-500 text-2xl underline decoration-2"
                                    >
                                        Volver a Iniciar Sesión
                                    </button>
                                    {error && <span className="text-red-500 mt-2">{error}</span>}
                                    {mensaje && <span className="text-green-500 mt-2">{mensaje}</span>}
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
                {!isFlipped ? (
                    <motion.button
                        className="relative z-10 w-92 h-36 bg-cover bg-center transition active:scale-95 cursor-pointer overflow-hidden"
                        style={{ backgroundImage: `url('/img/btn_iniciar_hover.png')` }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_iniciar_hover.png')")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/Btn_Iniciar.png')")}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={showForm ? { scale: 1, y: -650 } : { scale: [1, 1, 1], y: 0 }}
                        transition={{ duration: 1, times: [0, 1, 1], ease: "easeInOut" }}
                        onClick={handleLogin}
                    />
                ) : (
                    <motion.button
                        className="relative z-10 w-92 h-36 bg-cover bg-center transition active:scale-95 cursor-pointer overflow-hidden"
                        style={{ backgroundImage: `url('/img/btn_iniciar_hover.png')` }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_iniciar_hover.png')")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/Btn_Iniciar.png')")}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={showForm ? { scale: 1, y: -650 } : { scale: [1, 1, 1], y: 0 }}
                        transition={{ duration: 1, times: [0, 1, 1], ease: "easeInOut" }}
                        onClick={handleRegistro}
                    />
                )}
            </div>


        </>
    )
}

export default App
