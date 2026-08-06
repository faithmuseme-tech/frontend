import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import productService from "../services/productService";

const usePageTracking = () => {
  const { pathname } = useLocation();
  const entryTime = useRef(Date.now());
  const currentPath = useRef(pathname);

  useEffect(() => {
    // New page — flush previous
    const prev = currentPath.current;
    const seconds = Math.round((Date.now() - entryTime.current) / 1000);
    if (seconds >= 2) {
      productService.trackPage(prev, seconds).catch(() => {});
    }
    entryTime.current = Date.now();
    currentPath.current = pathname;

    // Flush on unmount / tab close
    const flush = () => {
      const s = Math.round((Date.now() - entryTime.current) / 1000);
      if (s >= 2) {
        productService.trackPage(currentPath.current, s).catch(() => {});
      }
    };
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [pathname]);
};

export default usePageTracking;
