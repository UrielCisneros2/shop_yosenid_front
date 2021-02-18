import React, { createContext, useState } from "react"

export const MenuContext = createContext()

export const MenuProvider = ({ children }) => {
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [reloadFilter, setReloadFilter] = useState(true);

  return (
    <MenuContext.Provider value={{active,setActive, loading, setLoading, reloadFilter, setReloadFilter}}>
      {children}
    </MenuContext.Provider>
  );
};