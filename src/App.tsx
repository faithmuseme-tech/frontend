import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import AppRoutes from "./routes/AppRoutes";
import InstallPrompt from "./components/InstallPrompt/InstallPrompt";
import CartNudgeToast from "./components/CartNudge/CartNudgeToast";
import CookieConsent from "./components/CookieConsent/CookieConsent";

const basename = process.env.NODE_ENV === 'production' ? '/frontend' : '/';

function App() {
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <SiteSettingsProvider>
          <CartProvider>
            <WishlistProvider>
              <AppRoutes />
              <InstallPrompt />
              <CartNudgeToast />
              <CookieConsent />
            </WishlistProvider>
          </CartProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
