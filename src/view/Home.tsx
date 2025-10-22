import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import form from '/img/FormBox.png'
import boy from '/img/Mekoboy.png'
import drawer from '/img/dotWallpaper.png'
import country from '/img/banderaMexico.png'
import estadio from '/img/estadioBlur.png'
import moneda from '/img/moneda-de-un-dolar.png'
import { UserIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/solid'
// import terofeo from '/img/trofeo.png'
import user from '/img/User.png'


function App() {
  const [count, setCount] = useState(0)
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDrawerConfiguration, setShowDrawerConfiguration] = useState(false);
  const [showDrawerAwards, setShowDrawerAwards] = useState(false);
  const [showDialogInfo, setShowDialogInfo] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isOpenInfo, setIsOpenInfo] = useState(false);

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
          animate={{ y: 0.1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed top-0 left-0 w-full h-25 bg-[#3f4253] border-b-4 border-t-4 gap-30 border-[#1F1B1B] 
          justify-between flex items-center px-8 text-white text-2xl font-bold z-10 shadow-md"
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
              value="Nickname"
              className="pl-7 rounded-md ml-10 h-10 text-[#c4c2c2] bg-[#1F1B1B] outline-none"
            />
            <img
              src={moneda}
              alt="icono"
              className="absolute w-18 left-120 h- object-cover"
            />
            <input
              type="nomber"
              style={{ fontFamily: "Arial, sans-serif" }}
              readOnly
              value="50"
              className="pl-7 text-[#c4c2c2] rounded-md h-10 bg-[#1F1B1B] outline-none"
            />
          </div>
          <div className='flex items-center gap-10'>
            <button
              type="button"
              className="stroke-2 stroke-[#1F1B1B] text-gray-700"
              onClick={() => setIsOpenInfo(true)} >
              <UserIcon className="h-12 w-12 text-[#808CB7] " />
            </button>
            <button type="button" className="cursor-pointer" onClick={() => (window.location.href = "/")}>
              <ArrowRightEndOnRectangleIcon className="h-12 w-12 text-[#1F1B1B] " />
            </button>
          </div>
        </motion.div>
        <div className="w-full h-screen flex">
          <motion.div
            className="w-3/5 flex flex-col justify-center items-center pl-8"
            initial={{ x: -300, y: 70, opacity: 0 }}
            animate={{ x: -150, y: 70, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img src={country} alt="character" className='fixed z-10 w-50 top-43 left-20 ' />
            <img src={boy} alt="character" className='fixed' />
            <input
              type="text"
              readOnly
              value="Santiago Gimenez"
              className=" fixed top-50 text-center h-14 p-2 w-1/2 items-start text-white text-2xl rounded-xl bg-[#1F1B1B] outline-none"
            />
            <motion.button
              className="fixed bottom-35 z-10 w-30 h-30 bg-cover bg-center transition active:scale-95 cursor-pointer"
              style={{ backgroundImage: `url('/img/rowLeft.png')`, }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/rowLeft.png')")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/rowLeft.png')")}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: [1, 1.08, 1] }}
              transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
              onClick={() => setShowDrawer(true)}
            />
            <img src={form} alt="Form" className="w-3/4" />
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
                <img src={drawer} alt="Drawer" />

                {/* Botón de cerrar */}
                <button
                  onClick={() => setShowDrawer(false)}
                  className="text-4xl font-black text-white h-20 rounded"
                >
                  ✖
                </button>

                {/* Grid de personajes */}
                <div className="absolute grid grid-cols-3 gap-6 mt-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="relative group">
                      <button onClick={() => setShowDrawer(false)} className="fixed top-30 right-135 text-4xl font-black text-white h-20 rounded" > ✖ </button>
                      <motion.button
                        className={`w-32 h-40 bg-cover bg-center rounded-xl transition-all duration-200`}
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
          <div className="flex w-1/2 h-full justify-center items-center">
            {!showDrawerConfiguration && !showDrawerAwards && (
              <div className='flex flex-col items-center justify-center gap-10'>
                <motion.button
                  className="z-10 w-110 h-40 bg-cover bg-center transition active:scale-95 cursor-pointer"
                  style={{ backgroundImage: `url('/img/btn_1jugador.png')`, }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_1jugador_hover.png')")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_1jugador.png')")}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                  transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
                />
                <motion.button
                  className="z-10 w-110 h-40 bg-cover bg-center transition active:scale-95 cursor-pointer"
                  style={{ backgroundImage: `url('/img/btn_2jugadores.png')`, }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_2jugadores_hover.png')")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_2jugadores.png')")}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                  onClick={() => (window.location.href = "/game")}
                  transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
                />
              </div>
            )}
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
                key="second"
                className="absolute inset-0 flex flex-col justify-center items-center bg-transparent"
                initial={{ x: 1500, opacity: 1 }}
                animate={{ x: 500, opacity: 1 }}
                exit={{ x: 1500, opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                  <img src={drawer} alt="Drawer" />
                  <button
                    onClick={() => setShowDrawerConfiguration(false)}
                    className="absolute top-25 left-135 text-4xl font-black text-white h-20 rounded"
                  >
                    ✖
                  </button>
                  <div className='absolute flex flex-col items-center justify-center gap-10'>
                    <motion.button
                      className="z-10 w-110 h-40 bg-cover bg-center transition active:scale-95 cursor-pointer"
                      style={{ backgroundImage: `url('/img/btn_ctrl.png')`, }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_ctrl_hover.png')")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_ctrl.png')")}
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                      transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
                    />
                    <motion.button
                      className="z-10 w-110 h-40 bg-cover bg-center transition active:scale-95 cursor-pointer"
                      style={{ backgroundImage: `url('/img/btn_volumen.png')`, }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_volumen_hover.png')")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundImage = "url('/img/btn_volumen.png')")}
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                      transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
                    />
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showDrawerAwards && (
              <motion.div
                key="second"
                className="absolute inset-0 flex flex-col justify-center items-center bg-transparent"
                initial={{ x: 1500, opacity: 1 }}
                animate={{ x: 500, opacity: 1 }}
                exit={{ x: 1500, opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <img src={drawer} alt="Drawer" />
                <button
                  onClick={() => setShowDrawerAwards(false)}
                  className="absolute top-25 left-135 text-4xl font-black text-white h-20 rounded"
                >
                  ✖
                </button>
                <div className='absolute flex flex-col items-center justify-center gap-10'>
                  awards
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {isOpenInfo && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            {/* Fondo oscuro */}
            <div
              className="absolute inset-0 bg-black bg-opacity-5"
              onClick={() => setIsOpenInfo(false)}
            ></div>

            {/* Contenido del modal */}
            <div className="relative bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg z-10">
              <h2 className="text-2xl font-bold mb-4">Mi Diálogo</h2>
              <p className="mb-4">
                Este es el contenido del diálogo. Puedes poner lo que quieras aquí.
              </p>
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setIsOpenInfo(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
