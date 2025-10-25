import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }: { children: React.ReactNode }) => {
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RutaProtegida;