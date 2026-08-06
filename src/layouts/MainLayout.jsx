import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import AnnouncementBar from "../components/Banner/AnnouncementBar";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import CartNudgeToast from "../components/CartNudge/CartNudgeToast";
import WishlistNudgeToast from "../components/CartNudge/WishlistNudgeToast";
import { MessageCircle } from "lucide-react";

const MainLayout = () => {
  const [tooltip, setTooltip] = useState(false);
  const { pathname } = useLocation();
  const onChatPage = pathname === "/chat";

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Floating chat button — hidden on chat page */}
      {!onChatPage && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {tooltip && (
            <div className="bg-white border border-gray-100 shadow-lg rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">
              Chat with the Team
            </div>
          )}
          <Link
            to="/chat"
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-xl flex items-center justify-center transition-all active:scale-95 animate-bounce"
            aria-label="Chat with the Team"
          >
            <MessageCircle size={24} />
          </Link>
        </div>
      )}

      <CartNudgeToast />
      <WishlistNudgeToast />
    </div>
  );
};

export default MainLayout;
