import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/api";

const SiteSettingsContext = createContext({ sellerOpen: false, loaded: false, refresh: () => {} });

const CACHE_KEY = "site_settings_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const SiteSettingsProvider = ({ children }) => {
  const cached = (() => { try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch { return null; } })();
  const [sellerOpen, setSellerOpen] = useState(cached?.sellerOpen ?? false);
  const [loaded, setLoaded] = useState(!!cached);

  const refresh = useCallback(() => {
    api.get("/admin/settings/")
      .then((r) => {
        const val = r.data.seller_registration_open;
        setSellerOpen(val);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ sellerOpen: val, ts: Date.now() }));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (cached && Date.now() - cached.ts < CACHE_TTL) return; // still fresh
    refresh();
  }, [refresh, cached?.ts]);

  return (
    <SiteSettingsContext.Provider value={{ sellerOpen, loaded, refresh }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
