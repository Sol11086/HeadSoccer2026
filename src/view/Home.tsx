import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '../components/navbar.tsx'
import form from '/img/FormBox.png'
import drawer from '/img/drawer_wallpaper.png'
import player from '/assets/Mexico/Santiago_Gimenez.png'
import country from '/img/banderaMexico.png'
import estadio from '/img/estadioBlur.png'


function App() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDrawerConfiguration, setShowDrawerConfiguration] = useState(false);
  const [showVolConfig, setShowVolConfig] = useState(false);
  const [showDrawerAwards, setShowDrawerAwards] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [musicVolume, setMusicVolume] = useState(50);
  const [systemVolume, setSystemVolume] = useState(50);

  const handleReset = () => {
    setMusicVolume(50);
    setSystemVolume(50);
  };

  const handleSave = () => {
    console.log({ musicVolume, systemVolume });}
  
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isOpenInfo, setIsOpenInfo] = useState(false);
 

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
          <motion.div
            className="w-3/5 flex flex-col justify-center items-center pl-8"
            initial={{ x: -300, y: 70, opacity: 0 }}
            animate={{ x: -150, y: 70, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img src={country} alt="character" className='fixed z-10 w-50 top-43 left-20 ' />
            <img src={player} alt="character" className='fixed h-100 w-100' />
            <input
              type="text"
              readOnly
              value="Santiago Gimenez"
              className=" fixed top-35 text-center h-14 p-2 w-1/2 items-start text-white text-2xl rounded-xl bg-[#1F1B1B] outline-none"
            />
            <motion.button
              className="fixed bottom-25 z-10 w-30 h-30 bg-cover bg-center transition active:scale-95 cursor-pointer"
              style={{ backgroundImage: `url('/img/rowLeft.png')`, }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/rowLeft.png')")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/rowLeft.png')")}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: [1, 1.08, 1] }}
              transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
              onClick={() => setShowDrawer(true)}
            />
            <img src={form} alt="Form" className="w-120" />
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
                <img src={drawer} alt="Drawer" className='w-1/2' />
                <div className="fixed top-50 right-111 grid grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="relative group">
                      <button onClick={() => setShowDrawer(false)}
                        className="fixed top-25 right-110 text-4xl font-black text-white h-20 rounded" > ✖ </button>
                      <motion.button
                        className={`w-42 h-54 bg-cover bg-center rounded-xl transition-all duration-200`}
                        style={{
                          backgroundImage:
                            selectedIndex === index
                              ? "url('/img/character_selected.png')"
                              : "url('/img/character.png')",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedIndex !== index) {
                            e.currentTarget.style.backgroundImage =
                              "url('/img/character_hover.png')";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedIndex !== index) {
                            e.currentTarget.style.backgroundImage =
                              "url('/img/character.png')";
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

                      {/* Tooltip */}
                      <span
                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white 
                        text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 pointer-events-none whitespace-nowrap"
                      >
                        Santiago Giménez
                      </span>
                    </div>
                  ))}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="mt-10 px-10 py-3 bg-[#ff5f57] text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-[#ff3b2f] transition-colors"
                  >
                    Cambiar
                  </motion.button>
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
                onClick={() => (window.location.href = "/game")}
                transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
              />
            </div>
            <div className='fixed bottom-4 gap-10 flex flex-col right-4 mr-10 mb-10'>
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
                <img src={drawer} alt="Drawer" className="w-2/3" />
                <button
                  onClick={() => setShowDrawerConfiguration(false)}
                  className="absolute top-25 left-75 text-4xl font-black text-white h-20 rounded"
                >
                  ✖
                </button>
                <div className="absolute flex flex-col items-center justify-center left-115 top-45 gap-10">
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
                            onClick={() => setShowVolConfig(false)}>
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
                <img src={drawer} alt="Drawer" className='w-2/3' />
                <button
                  onClick={() => setShowDrawerAwards(false)}
                  className="absolute top-25 left-75 text-4xl font-black text-white h-20 rounded"> ✖ </button>
                <div className="fixed top-50 left-100 grid grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="relative group">
                      <motion.button
                        className={`w-42 h-54 bg-cover bg-center rounded-xl transition-all duration-200`}
                        style={{
                          backgroundImage:
                            selectedIndex === index
                              ? "url('/img/award1.png')"
                              : "url('/img/award1.png')",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedIndex !== index) {
                            e.currentTarget.style.backgroundImage =
                              "url('/img/award1.png')";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedIndex !== index) {
                            e.currentTarget.style.backgroundImage =
                              "url('/img/award1.png')";
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

                      {/* Tooltip */}
                      <span
                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white 
                        text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 pointer-events-none whitespace-nowrap"
                      >
                        Nombre logro
                      </span>
                    </div>
                  ))}
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
