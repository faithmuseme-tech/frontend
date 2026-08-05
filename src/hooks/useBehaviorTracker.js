import { useEffect, useRef } from 'react';
import productService from '../services/productService';

/**
 * Tracks time a user spends on a product page and sends it to the backend.
 * Call with the product slug; fires on unmount (or after 30 s of continuous viewing).
 */
const useBehaviorTracker = (slug) => {
  const startRef = useRef(Date.now());
  const firedRef = useRef(false);

  useEffect(() => {
    if (!slug) return;
    startRef.current = Date.now();
    firedRef.current = false;

    // Auto-fire after 30 s so long sessions are captured even without navigation
    const timer = setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true;
        productService.trackView(slug, 30).catch(() => {});
      }
    }, 30000);

    return () => {
      clearTimeout(timer);
      if (!firedRef.current) {
        const seconds = Math.round((Date.now() - startRef.current) / 1000);
        if (seconds >= 2) {
          firedRef.current = true;
          productService.trackView(slug, seconds).catch(() => {});
        }
      }
    };
  }, [slug]);
};

export default useBehaviorTracker;
