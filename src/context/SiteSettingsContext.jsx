import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const SiteSettingsContext = createContext({ sellerOpen: false });

export const SiteSettingsProvider = ({ children }) => {
  const [sellerOpen, setSellerOpen] = useState(false);

  useEffect(() => {
    api.get("/admin/settings/")
      .then((r) => setSellerOpen(r.data.seller_registration_open))
      .catch(() => {});
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ sellerOpen }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
