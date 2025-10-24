import { Routes, Route } from "react-router-dom";
import Login from "./view/Login.tsx";
import Home from "./view/Home.tsx";
import SecurityPath from "./components/SecurityPath.tsx";
import './App.css'

function App() {

  //USAR App.tsx para establecer las rutas de la aplicacion
  //  cuando ya se tengan las vistas no hacer vistas aqui

  return (
    <>
      <div>
        {/* Menú de navegación
        <nav>
          <Link to="/">Login</Link> |{" "}
          <Link to="/home">Acerca de</Link> |{" "}
          <Link to="/contact">Contacto</Link>
        </nav> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/home" 
            element={
              <SecurityPath>
                <Home />
              </SecurityPath>
            } 
          />
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </div>
    </>
  )
}

export default App
