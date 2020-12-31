import React, { createContext, useState } from "react"

export const CarritoContext = createContext()

export const CarritoProvider = ({ children }) => {
    const [ activador, setActivador ] = useState(true);
    const [ validacion, setValidacion ] = useState(false);

  return (
    <CarritoContext.Provider value={{activador, setActivador, validacion, setValidacion}}>
      {children}
    </CarritoContext.Provider>
  );
};