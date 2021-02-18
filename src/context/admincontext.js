import React, { createContext, useState } from "react"

export const BannerContext = createContext()

export const BannerProvider = ({ children }) => {
  const [actualizarDatos, setActualizarDatos] = useState(false);
  const [reload, setReload] = useState(true);
  return (
    <BannerContext.Provider value={{ actualizarDatos, setActualizarDatos, reload, setReload}}>
      {children}
    </BannerContext.Provider>
  );
};