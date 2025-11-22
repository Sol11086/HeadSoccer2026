import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '../components/navbar.tsx'
import form from '/img/FormBox.png'
import drawer from '/img/drawer_wallpaper.png'
import estadio from '/img/estadioBlur.png'

import CharacterPreview from '../components/CharacterPreview.tsx';
import MatchHistoryModal from '../components/MatchHistoryModal';
import { Characters } from '../data/Characters';
import { Achivement_images } from '../data/Achievements.tsx';

import apiService from '../api/apiService.ts';

interface Logro {
  id_logro: number;
  nombre: string;
  descripcion: string;
  recompensa: number;
}

function App() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDrawerConfiguration, setShowDrawerConfiguration] = useState(false);
  const [showVolConfig, setShowVolConfig] = useState(false);
  const [showDrawerAwards, setShowDrawerAwards] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [musicVolume, setMusicVolume] = useState(50);
  const [systemVolume, setSystemVolume] = useState(50);

  const [ownedIds, setOwnedIds] = useState<number[]>([1]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [achievementToast, setAchievementToast] = useState(false);
  const [achievementToastMessage, setAchievementToastMessage] = useState("");
  const [isBuy, setIsBuy] = useState(false);

  const [logros, setLogros] = useState<Logro[]>([]);
  const [misLogrosIds, setMisLogrosIds] = useState<number[]>([]);

  // Cargar inventario al montar
  useEffect(() => {
    apiService.get('/tienda/mis-personajes')
      .then(res => {
        if (!res.data.error) setOwnedIds(res.data.body);
      })
      .catch(console.error);

    const savedSkin = localStorage.getItem('lastSkin');
    if (savedSkin) {
      const idx = Characters.findIndex(c => c.skinKey === savedSkin);
      if (idx !== -1) {
        setEquippedIndex(idx);
        setSelectedIndex(idx); // Sincronizar al inicio
      }
    }

    // Cargar Logros
    apiService.get('/logros').then(res => { if (!res.data.error) setLogros(res.data.body); });
    apiService.get('/logros/conseguidos').then(res => { if (!res.data.error) setMisLogrosIds(res.data.body); });
  }, []);

  const handleEquipCharacter = () => {
    if (ownedIds.includes(selectedChar.id)) {
      setEquippedIndex(selectedIndex);
      setShowDrawer(false);

      localStorage.setItem('lastSkin', selectedChar.skinKey);
    } else {
      setToastMessage(`Debes comprar a ${selectedChar.name} primero`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleBuy = async () => {
    try {
      const response = await apiService.post('/tienda/comprar', {
        id_personaje: currentChar.id
      });

      if (!response.data.error) {
        // 1. Actualizar lista de propiedad
        const nuevosOwned = [...ownedIds, currentChar.id];
        setOwnedIds(nuevosOwned);

        // Verificar logro "Plantel Completo"
        if (nuevosOwned.length >= Characters.length) {
          try {
            const resLogro = await apiService.post('/logros/desbloquear', { id_logro: 6 });
            if (resLogro.data.body.nuevo) {
              // Mostrar un segundo Toast o cambiar el mensaje
              setTimeout(() => {
                setAchievementToastMessage("¡Logro Desbloqueado: Plantel Completo!");
                setAchievementToast(true);
                setTimeout(() => setAchievementToast(false), 3000);
              }, 1000);


            }
          } catch (e) { console.error("Error logro plantel", e); }
        }

        // 2. Actualizar monedas en storage/navbar
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userJson = JSON.parse(userStr);
          userJson.usuario = response.data.body.usuario; // Backend devuelve usuario actualizado
          localStorage.setItem('user', JSON.stringify(userJson));
          window.dispatchEvent(new Event("storage"));
        }

        // 3. Mostrar Toast
        setToastMessage(`¡${currentChar.name} desbloqueado!`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setIsBuy(true);
      }
    } catch (error: unknown) {
      console.error("Error comprando personaje:", error);
      setToastMessage(`No se pudo comprar ${currentChar.name}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setIsBuy(false);
    }
  };

  const handleReset = () => {
    setMusicVolume(50);
    setSystemVolume(50);
  };

  const handleSave = () => {
    console.log({ musicVolume, systemVolume });
  }

  // Estado para el personaje seleccionado
  const [equippedIndex, setEquippedIndex] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Helpers
  const equippedChar = Characters[equippedIndex];
  const selectedChar = Characters[selectedIndex];

  // const [isOpenInfo, setIsOpenInfo] = useState(false);

  const currentChar = Characters[selectedIndex];
  const isOwned = ownedIds.includes(currentChar.id);

  return (
    <>
      <div>
        <img
          src={estadio}
          alt="Fondo"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div>
          <Navbar />
        </div>

        <div className="w-screen h-screen flex overflow-hidden">
          {/* Sección: Personaje */}
          <motion.div
            className="w-3/6 flex flex-col justify-center items-center pl-8 relative"
            initial={{ x: -300, y: 70, opacity: 0 }}
            animate={{ x: -150, y: 70, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img src={equippedChar.flagImg} alt="country" className='fixed z-21 top-42 left-60 w-30 h-30 object-cover rounded-[50%] border-6 border-black' />

            <div className='fixed h-100 w-100 top-25 flex justify-center items-center z-20'>
              <CharacterPreview skin={equippedChar.skinKey} />
            </div>

            <input
              type="text"
              readOnly
              value={equippedChar.name}
              className="fixed text-center h-14 p-2 w-100 top-50 items-start text-white text-2xl rounded-xl bg-[#1F1B1B] outline-none z-20"
            />

            <motion.button
              className="fixed bottom-35 z-20 w-50 h-50 bg-cover bg-center transition active:scale-95 cursor-pointer"
              style={{ backgroundImage: `url('/img/change_char.png')`, }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/change_char.png')")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/change_char.png')")}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: [1, 1.08, 1] }}
              transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
              onClick={() => { setSelectedIndex(equippedIndex); setShowDrawer(true); }}
            />
            <img src={form} alt="Form" className="w-120 z-0" />
          </motion.div>

          <AnimatePresence>
            {showDrawer && (
              <motion.div
                key="second"
                className="absolute inset-0 flex flex-col justify-center items-center bg-transparent"
                initial={{ x: -1500, opacity: 1 }}
                animate={{ x: -500, opacity: 1 }}
                exit={{ x: -1500, opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <img src={drawer} alt="Drawer" className='w-220 h-240  relative top-18 right-10 border-6 border-black' />
                <div className="fixed top-50 left-160 grid grid-cols-3 gap-6">
                  <button onClick={() => setShowDrawer(false)}
                    className="fixed top-25 right-160 text-4xl font-black text-white h-20 rounded cursor-pointer" > ✖ </button>

                  {/* Renderizado Dinámico de la lista de personajes */}
                  {Characters.map((char, index) => {
                    const charOwned = ownedIds.includes(char.id);
                    return (
                      <div key={char.id} className="relative group">


                        <motion.button
                          className={`${charOwned ? '' : 'grayscale brightness-50'} w-42 h-54 bg-cover bg-center rounded-xl transition-all duration-200`}
                          style={{
                            backgroundImage: selectedIndex === index
                              ? `url('assets/cards/${char.country ? char.country : 'character'}_selected.png')`
                              : `url('assets/cards/${char.country ? char.country : 'character'}.png')`,
                          }}
                          onMouseEnter={(e) => {
                            if (selectedIndex !== index) {
                              e.currentTarget.style.backgroundImage = `url('assets/cards/${char.country ? char.country : 'character'}_hover.png')`;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedIndex !== index) {
                              e.currentTarget.style.backgroundImage = `url('assets/cards/${char.country ? char.country : ''}.png')`;
                            }
                          }}
                          initial={{ opacity: 1, scale: 1 }}
                          animate={{ opacity: 1, scale: [1, 1.05, 1] }}
                          transition={{
                            duration: 0.8,
                            times: [0, 0.5, 1],
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 2,
                          }}
                          onClick={() => setSelectedIndex(index)}
                        />

                        {/* Tooltip Dinámico */}
                        <span
                          className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white 
                        text-m px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 pointer-events-none whitespace-nowrap"
                        >
                          {char.name}
                        </span>

                        {!charOwned && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl">🔒</span>
                            <span className="text-yellow-400 bg-[rgba(0,0,0,0.6)]  rounded-md px-1 py-1 font-black text-xl drop-shadow-md">${char.price}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {isOwned ? (
                    <motion.button
                      className="z-10 absolute w-55 h-20 top-120 bg-cover transition active:scale-95 cursor-pointer"
                      style={{
                        backgroundImage: `url('/img/btn_cambiar.png')`,
                        filter: ownedIds.includes(selectedChar.id) ? 'none' : 'grayscale(100%)'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_cambiar_hover.png')")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_cambiar.png')")}
                      initial={{ opacity: 1, scale: 1 }}
                      onClick={() => { handleEquipCharacter(); setShowDrawer(false); }}
                      animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                      transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
                    />
                  ) : (
                    <motion.button
                      className="z-10 absolute w-60 h-20 top-120 bg-green-600 text-white text-3xl rounded-xl border-4 border-green-400 shadow-lg
                       cursor-pointer flex flex-row gap-3 items-center justify-center hover:bg-green-500"
                      onClick={handleBuy}
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div>COMPRAR</div>
                      <div className="text-yellow-300 text-3xl flex flex-row items-center gap-1"><img src="/img/coin.png" alt="coin" className='w-10' />{currentChar.price}</div>
                    </motion.button>
                  )}


                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex w-20 h-full justify-center items-center">
            <div className='flex flex-col items-center justify-start gap-10'>
              <motion.button
                className="z-10 w-110 h-40 bg-cover transition active:scale-95 cursor-pointer"
                style={{ backgroundImage: `url('/img/btn_1jugador.png')`, }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_1jugador_hover.png')")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_1jugador.png')")}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
              />
              <motion.button
                className="z-10 w-110 h-40 bg-cover r transition active:scale-95 cursor-pointer"
                style={{ backgroundImage: `url('/img/btn_2jugadores.png')`, }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_2jugadores_hover.png')")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_2jugadores.png')")}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                onClick={() => (window.location.href = "/setup")}
                transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
              />
            </div>
            <div className='fixed bottom-4 gap-10 flex flex-col right-4 mr-10 mb-10'>
              <motion.button
                className="relative z-10 w-20 h-20 bg-cover bg-center transition active:scale-95 cursor-pointer"
                style={{ backgroundImage: `url('/img/btn_historial.png')`, }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_historial_hover.png')")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_historial.png')")}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
                onClick={() => setShowHistory(true)}
              />
              <motion.button
                className="relative z-10 w-20 h-20 bg-cover bg-center transition active:scale-95 cursor-pointer"
                style={{ backgroundImage: `url('/img/btn_reward.png')`, }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_reward_hover.png')")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_reward.png')")}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
                onClick={() => setShowDrawerAwards(true)}
              />
              <motion.button
                className="relative z-10 w-20 h-20 bg-cover bg-center transition active:scale-95 cursor-pointer"
                style={{ backgroundImage: `url('/img/btn_configuration.png')`, }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_configuration_hover.png')")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_configuration.png')")}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
                onClick={() => setShowDrawerConfiguration(true)}
              />
            </div>
          </div>
          <AnimatePresence>
            {showDrawerConfiguration && (
              <motion.div
                key="drawer"
                className="absolute z-10 inset-0 flex flex-col justify-center items-center bg-transparent overflow-hidden"
                initial={{ x: 1500, opacity: 0 }}
                animate={{ x: 500, opacity: 1 }}
                exit={{ x: 1500, opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <img src={drawer} alt="Drawer" className="'w-220 h-240 relative top-18 left-18 border-6 border-black" />
                <button
                  onClick={() => setShowDrawerConfiguration(false)}
                  className="absolute top-25 left-180 text-4xl font-black text-white h-20 rounded cursor-pointer"
                >
                  ✖
                </button>

                <div className="fixed flex flex-col items-center justify-center left-210 top-45 gap-10">
                  <AnimatePresence mode="wait">
                    {!showVolConfig ? (
                      // ======= BOTONES =======
                      <motion.div
                        key="buttons"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center gap-10"
                      >
                        <motion.button
                          className="z-10 w-120 h-43 bg-cover bg-center transition active:scale-95 cursor-pointer"
                          style={{ backgroundImage: `url('/img/btn_ctrl.png')` }}
                          onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundImage =
                            "url('/img/btn_ctrl_hover.png')")
                          }
                          onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundImage =
                            "url('/img/btn_ctrl.png')")
                          }
                          initial={{ opacity: 1, scale: 1 }}
                          animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                          transition={{
                            duration: 0.8,
                            times: [0, 0.5, 1],
                            ease: "easeInOut",
                            repeat: Infinity,
                          }}
                        />
                        <motion.button
                          className="z-10 w-120 h-40 bg-cover bg-center transition active:scale-95 cursor-pointer"
                          style={{ backgroundImage: `url('/img/btn_volumen.png')` }}
                          onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundImage =
                            "url('/img/btn_volumen_hover.png')")
                          }
                          onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundImage =
                            "url('/img/btn_volumen.png')")
                          }
                          initial={{ opacity: 1, scale: 1 }}
                          animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                          transition={{
                            duration: 0.8,
                            times: [0, 0.5, 1],
                            ease: "easeInOut",
                            repeat: Infinity,
                          }}
                          onClick={() => setShowVolConfig(true)}
                        />
                        <motion.button
                          className="z-10 w-120 h-45 bg-cover bg-center transition active:scale-95 cursor-pointer"
                          style={{ backgroundImage: `url('/img/btn_info.png')` }}
                          onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundImage =
                            "url('/img/btn_info_hover.png')")
                          }
                          onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundImage =
                            "url('/img/btn_info.png')")
                          }
                          initial={{ opacity: 1, scale: 1 }}
                          animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                          transition={{
                            duration: 0.8,
                            times: [0, 0.5, 1],
                            ease: "easeInOut",
                            repeat: Infinity,
                          }}
                          onClick={() => setShowVolConfig(true)}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="config"
                        className="z-10 w-full bg-green rounded-xl flex flex-col gap-10 "
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        {/* <button
                          className="self-end text-gray-500 hover:text-gray-700 text-xl"
                          onClick={() => setShowVolConfig(false)}
                        >
                          ✖
                        </button> */}

                        <div className="flex flex-col gap-5">
                          <label htmlFor="music" className="font-medium text-black text-6xl">
                            Master
                          </label>
                          <input
                            type="range"
                            id="master"
                            className='soundbar'
                            value={musicVolume}
                            onChange={(e) => setMusicVolume(Number(e.target.value))}
                          />
                        </div>

                        <div className="flex flex-col gap-5">
                          <label htmlFor="music" className="font-medium text-black text-6xl">
                            Música
                          </label>
                          <input
                            type="range"
                            id="music"
                            className='soundbar'
                            value={musicVolume}
                            onChange={(e) => setMusicVolume(Number(e.target.value))}
                          />
                        </div>
                        <div className="flex flex-col gap-5">
                          <label htmlFor="music" className="font-medium text-black text-6xl">
                            Efectos de sonido
                          </label>
                          <input
                            type="range"
                            id="sound"
                            className='soundbar'
                            value={musicVolume}
                            onChange={(e) => setMusicVolume(Number(e.target.value))}
                          />
                        </div>
                        <div className='w-full justify-center items-center flex'>
                          <motion.button
                            className="w-25 h-25 bg-cover bg-center rounded-xl transition-all duration-200"
                            style={{
                              backgroundImage: isMuted
                                ? "url('/img/btn_silenceVol.png')"
                                : "url('/img/btn_volume.png')",
                            }}
                            onMouseEnter={(e) => {
                              if (!isMuted) {
                                e.currentTarget.style.backgroundImage = "url('/img/btn_silenceVol.png')";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isMuted) {
                                e.currentTarget.style.backgroundImage = "url('/img/btn_volume.png')";
                              }
                            }}
                            initial={{ opacity: 1, scale: 1 }}
                            animate={{ opacity: 1, scale: [1, 1.05, 1] }}
                            transition={{
                              duration: 0.8,
                              times: [0, 0.5, 1],
                              ease: "easeInOut",
                              repeat: Infinity,
                              repeatDelay: 2,
                            }}
                            onClick={() => setIsMuted((prev) => !prev)}
                          />
                        </div>
                        <div className="flex gap-4 justify-end">
                          <button
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            onClick={handleReset}>
                            Restablecer
                          </button>
                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => { setShowVolConfig(false); handleSave(); }}>
                            Guardar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showDrawerAwards && (
              <motion.div
                key="second"
                className="absolute z-10 inset-0 flex flex-col justify-center items-center bg-transparent"
                initial={{ x: 1500, opacity: 1 }}
                animate={{ x: 500, opacity: 1 }}
                exit={{ x: 1500, opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}>
                <img src={drawer} alt="Drawer" className='w-220 h-240 relative top-18 left-18 border-6 border-black' />
                <button
                  onClick={() => setShowDrawerAwards(false)}
                  className="absolute top-25 left-160 text-4xl font-black text-white h-20 rounded cursor-pointer"> ✖ </button>
                <div className="fixed top-60 left-155 grid grid-cols-2 gap-3">
                  {logros.map(logro => {
                    const desbloqueado = misLogrosIds.includes(logro.id_logro);
                    return (
                      <div key={logro.id_logro} className={`p-2 rounded-xl border-4 flex justify-between items-center ${desbloqueado ? 'bg-gray-500/90 border-gray-300' : 'bg-gray-800/90 border-gray-600'}`}>

                        <div className="flex items-center text-center gap-1">
                          <div className="w-25 h-32 overflow-hidden ">
                            <img
                              src={Achivement_images[logro.id_logro]}
                              alt="Icono"
                              className={`w-full h-full object-fit ${desbloqueado ? '' : 'grayscale opacity-50'}`}
                            />
                          </div>

                          <div>
                            <h3 className={`text-2xl ${desbloqueado ? 'text-yellow-500' : 'text-gray-400'}`}>{logro.nombre}</h3>
                            <p className={`${desbloqueado ? 'text-gray-100' : 'text-gray-400'}`}>{logro.descripcion}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className={`text-xl  ${desbloqueado ? 'text-orange-400' : 'text-gray-600'}`}>${logro.recompensa}</span>
                          {desbloqueado ? <span className="text-2xl">✅</span> : <span className="text-2xl">🔒</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showHistory && (
              <MatchHistoryModal onClose={() => setShowHistory(false)} />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 20, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                {...isBuy ? {
                  className: "fixed top-4 left-1/2 -translate-x-1/2 w-100 h-20 bg-cover bg-green-600/90 flex justify-center items-center border-4 rounded-full border-green-800  z-50"
                }
                  : {
                    className: "fixed top-4 left-1/2 -translate-x-1/2 w-100 h-20 bg-cover bg-red-600/90 flex justify-center items-center border-4 rounded-full border-red-800 z-50"
                  }}
              >
                <span className="text-2xl text-white">{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
                {achievementToast && (
                    <motion.div
                        initial={{ y: -100, opacity: 0, scale: 0.5 }}
                        animate={{ y: 100, opacity: 1, scale: 1 }} 
                        exit={{ y: -100, opacity: 0, scale: 0.5 }}
                        className="fixed top-10 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 rounded-2xl border-4 border-yellow-400 shadow-[0_0_20px_rgba(255,165,0,0.6)]"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">🏆</span>
                            <div className="flex flex-col">
                                <span className="text-sm text-yellow-200 uppercase tracking-widest">¡Logro Desbloqueado!</span>
                                <span className="text-2xl text-white drop-shadow-md">{achievementToastMessage}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </>

  )
}

export default App
