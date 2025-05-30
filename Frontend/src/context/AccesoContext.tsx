import React, { createContext, useState, useContext } from 'react';

type state = 'home' | 'access' | 'logged' // Estados dentro de la página

interface AuthContextType { // Definicipón del tipo de contexto
  authState: state; 
  setAuthState: (state: state) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); // Creación del contexto

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => { // Componente que provee el contexto
  const [authState, setAuthState] = useState<state>('home');

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}> {/* Se provee el contexto */}
      {children} {/* Se renderiza el componente que se pasa como parámetro */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext); // Se utiliza el contexto para obtener el estado actual y el método para cambiarlo
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};