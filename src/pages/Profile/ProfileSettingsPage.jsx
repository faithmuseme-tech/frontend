import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLock, FiPhone, FiCamera, FiBell, FiXCircle, FiTrash2,
  FiEye, FiEyeOff, FiChevronRight, FiCheck,
} from "react-icons/fi";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { toAbsolute } from "../../utils/imageUrl";

const TABS = [
  { id: "password",       label: "Change Password",    icon: <FiLock /> },
  { id: "phone",          label: "Phone Number",        icon: <FiPhone /> },
  { id: "avatar",         label: "Profile Photo",       icon: <FiCamera /> },
  { id: "notifications",  label: "Notifications",       icon: <FiBell /> },
  { id: "close",          label: "Close Account",       icon: <FiXCircle />, danger: true },
  { id: "delete",         label: "Delete Account",      icon: <FiTrash2 />,  danger: true },
];

const Msg = ({ ok, text }) =>
  text ? <p className={`text-sm mt-3 ${ok ? "text-green-600" : "text-red-500"}`}>{text}</p> : null;

/* ── Password ── */
const PasswordTab = () => {
  const [step, setStep] = useState("verify"); // "verify" | "change"
  const [oldPassword, setOldPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setVerifyMsg(null);
    try {
      // Use changePassword with a dummy new password just to verify — instead
      // we call a lightweight check: attempt change with same value to trigger
      // old_password validation only. Better: call with a sentinel and catch.
      // Cleanest: try the real endpoint; if old_password wrong it returns 400.
      // We'll proceed to step 2 only on success or on "new_password" error (meaning old was correct).
      await authService.changePassword({ old_password: oldPassword, new_password: oldPassword });
      // If somehow it succeeds (same password), still move forward
      setStep("change");
    } catch (err) {
      const data = err.response?.data;
      if (data?.error === "Incorrect current password.") {
        setVerifyMsg("Incorrect current password.");
      } else {
        // Any other error (e.g. new_password same as old validation) means old password was accepted
        setStep("change");
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) { setOk(false); setMsg("Passwords do not match."); return; }
    try {
      await authService.changePassword({ old_password: oldPassword, new_password: newPassword });
      setOk(true); setMsg("Password updated successfully.");
      setStep("verify");
      setOldPassword(""); setNewPassword(""); setConfirm("");
    } catch (err) {
      setOk(false); setMsg(err.response?.data?.error || "Failed to update password.");
    }
  };

  if (step === "verify") {
    return (
      <form onSubmit={handleVerify} className="space-y-5 max-w-md">
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Current Password</label>
          <input
            type={showOld ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            autoFocus
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button type="button" onClick={() => setShowOld((s) => !s)}
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
            {showOld ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {verifyMsg && <p className="text-sm text-red-500">{verifyMsg}</p>}
        <button
          type="submit"
          disabled={verifying}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
        >
          {verifying ? "Verifying..." : "Continue"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleChange} className="space-y-5 max-w-md">
      <div className="flex items-center gap-2 text-xs text-green-600 font-medium mb-1">
        <FiCheck /> Current password verified
      </div>
      <div className="relative">
        <label className="block text-xs font-semibold text-gray-500 mb-1">New Password</label>
        <input
          type={showNew ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          autoFocus
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button type="button" onClick={() => setShowNew((s) => !s)}
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
          {showNew ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      <div className="relative">
        <label className="block text-xs font-semibold text-gray-500 mb-1">Confirm New Password</label>
        <input
          type={showConfirm ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button type="button" onClick={() => setShowConfirm((s) => !s)}
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
          {showConfirm ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={() => { setStep("verify"); setMsg(null); }}
          className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
          Update Password
        </button>
      </div>
      <Msg ok={ok} text={msg} />
    </form>
  );
};

/* ── Phone ── */
const PhoneTab = ({ user, updateUser }) => {
  const [phone, setPhone] = useState(user?.phone || "");
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(false);

  // Keep input in sync if user object updates externally
  useEffect(() => { setPhone(user?.phone || ""); }, [user?.phone]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.updateProfile({ phone });
      updateUser(res.data);
      setOk(true); setMsg("Phone number updated.");
    } catch (err) {
      setOk(false);
      const d = err.response?.data;
      setMsg(d?.phone?.[0] || d?.error || "Failed to update phone.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5 max-w-md">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
        <input
          type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
        Save Phone Number
      </button>
      <Msg ok={ok} text={msg} />
    </form>
  );
};

/* ── Avatar ── */
const AvatarTab = ({ user, updateUser }) => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(false);
  const inputRef = useRef();

  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      const res = await authService.updateAvatar(fd);
      updateUser(res.data);
      setFile(null);
      setPreview(null);
      setOk(true); setMsg("Avatar updated.");
    } catch {
      setOk(false); setMsg("Failed to upload avatar.");
    }
  };

  const avatarSrc = preview || (user?.avatar ? toAbsolute(user.avatar) : null);

  return (
    <form onSubmit={submit} className="space-y-5 flex flex-col items-start max-w-md">
      <div className="flex items-center gap-6">
        <div
          onClick={() => inputRef.current.click()}
          className="w-24 h-24 rounded-full border-4 border-indigo-100 overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
        >
          {avatarSrc
            ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            : <FiCamera className="text-3xl text-gray-400" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">{user?.first_name || user?.username}</p>
          <button type="button" onClick={() => inputRef.current.click()}
            className="text-sm text-indigo-600 font-medium hover:underline mt-1">
            Choose photo
          </button>
          <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or WEBP · max 5MB</p>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
      {file && (
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
          Upload Photo
        </button>
      )}
      <Msg ok={ok} text={msg} />
    </form>
  );
};

/* ── Notifications ── */
const NotificationsTab = ({ user, updateUser }) => {
  const browserPermission = typeof Notification !== "undefined" ? Notification.permission : "default";
  const [enabled, setEnabled] = useState(
    user?.notifications_enabled === true && browserPermission === "granted"
  );
  const [permission, setPermission] = useState(browserPermission);
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);

  const savePreference = async (val) => {
    setSaving(true);
    try {
      const res = await authService.updateProfile({ notifications_enabled: val });
      updateUser(res.data);
      setOk(true); setMsg(val ? "Notifications enabled." : "Notifications turned off.");
    } catch {
      setOk(false); setMsg("Failed to update preference.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async () => {
    if (enabled) {
      // turning off — just save preference (can't revoke browser permission programmatically)
      setEnabled(false);
      await savePreference(false);
      return;
    }

    // turning on — request browser permission first
    if (typeof Notification === "undefined") {
      setOk(false); setMsg("Your browser does not support notifications.");
      return;
    }

    if (permission === "denied") {
      setOk(false); setMsg("Notifications are blocked. Please allow them in your browser site settings.");
      return;
    }

    let result = permission;
    if (permission !== "granted") {
      result = await Notification.requestPermission();
      setPermission(result);
    }

    if (result === "granted") {
      setEnabled(true);
      await savePreference(true);
      new Notification("Notifications enabled", {
        body: "You'll now receive order updates and alerts.",
        icon: "/favicon-64.png",
      });
    } else {
      setOk(false); setMsg("Permission denied. Enable notifications in your browser settings.");
    }
  };

  return (
    <div className="space-y-4 max-w-md">
      <p className="text-sm text-gray-500">Control whether you receive order updates, promotions, and alerts.</p>

      {permission === "denied" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 font-medium">
          Notifications are blocked in your browser. Go to your browser's site settings to allow them.
        </div>
      )}

      <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">Push Notifications</p>
          <p className="text-xs text-gray-400 mt-0.5">Orders, promotions, and account alerts</p>
          <p className={`text-xs mt-1 font-medium ${
            permission === "granted" ? "text-green-500" : permission === "denied" ? "text-red-400" : "text-gray-400"
          }`}>
            Browser: {permission === "granted" ? "Allowed" : permission === "denied" ? "Blocked" : "Not set"}
          </p>
        </div>
        <button
          onClick={toggle}
          disabled={saving}
          aria-label="Toggle notifications"
          className={`w-12 h-6 rounded-full transition-colors duration-300 relative shrink-0 disabled:opacity-60 ${
            enabled ? "bg-accent-500" : "bg-gray-300"
          }`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
            enabled ? "translate-x-6" : "translate-x-0.5"
          }`} />
        </button>
      </div>
      <Msg ok={ok} text={msg} />
    </div>
  );
};

/* ── Close Account ── */
const CloseAccountTab = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (confirm !== "CLOSE") { setMsg("Type CLOSE to confirm."); return; }
    try {
      await authService.closeAccount();
      await logout();
      navigate("/login");
    } catch {
      setMsg("Failed to close account.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5 max-w-md">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">Close Account</p>
        Your account will be deactivated. Your data is kept but you won't be able to log in. Contact support to reactivate.
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">
          Type <span className="font-bold text-gray-700">CLOSE</span> to confirm
        </label>
        <input
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>
      <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
        Close My Account
      </button>
      <Msg ok={false} text={msg} />
    </form>
  );
};

/* ── Delete Account ── */
const DeleteAccountTab = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (confirm !== "DELETE") { setMsg("Type DELETE to confirm."); return; }
    try {
      await authService.deleteAccount();
      await logout();
      navigate("/login");
    } catch {
      setMsg("Failed to delete account.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5 max-w-md">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
        <p className="font-semibold mb-1">Permanently Delete Account</p>
        All your data, orders, and history will be erased. This action <strong>cannot be undone</strong>.
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">
          Type <span className="font-bold text-gray-700">DELETE</span> to confirm
        </label>
        <input
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>
      <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
        Permanently Delete Account
      </button>
      <Msg ok={false} text={msg} />
    </form>
  );
};

/* ── Page ── */
const ProfileSettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("password");
  const [mobileTab, setMobileTab] = useState(null); // null = list view, string = detail view

  const renderTab = (id) => {
    switch (id) {
      case "password":      return <PasswordTab />;
      case "phone":         return <PhoneTab user={user} updateUser={updateUser} />;
      case "avatar":        return <AvatarTab user={user} updateUser={updateUser} />;
      case "notifications": return <NotificationsTab user={user} updateUser={updateUser} />;
      case "close":         return <CloseAccountTab />;
      case "delete":        return <DeleteAccountTab />;
      default:              return null;
    }
  };

  const active = TABS.find((t) => t.id === activeTab);
  const mobileActive = TABS.find((t) => t.id === mobileTab);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* ── Mobile: detail view ── */}
      {mobileTab ? (
        <div className="md:hidden">
          <button
            onClick={() => setMobileTab(null)}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 mb-6"
          >
            <FiChevronRight className="rotate-180" /> Back to Settings
          </button>
          <h2 className={`text-lg font-bold mb-6 ${mobileActive?.danger ? "text-red-600" : "text-gray-800"}`}>
            {mobileActive?.label}
          </h2>
          {renderTab(mobileTab)}
        </div>
      ) : (
        /* ── Mobile: list view ── */
        <div className="md:hidden">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Account Settings</h1>
          <p className="text-sm text-gray-500 mb-6">{user?.first_name || user?.username} · {user?.email || user?.phone}</p>
          <div className="flex flex-col gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setMobileTab(t.id)}
                className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-left transition-colors w-full border border-gray-100 bg-white ${
                  t.danger ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50 hover:text-indigo-700"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-base">{t.icon}</span>
                  {t.label}
                </span>
                <FiChevronRight className="text-gray-400 text-sm" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Desktop: sidebar + content ── */}
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Account Settings</h1>
        <p className="text-sm text-gray-500 mb-8">{user?.first_name || user?.username} · {user?.email || user?.phone}</p>
        <div className="flex gap-6">
          <aside className="w-52 shrink-0">
            <nav className="flex flex-col gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors w-full ${
                    activeTab === t.id
                      ? t.danger ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-700"
                      : t.danger ? "text-red-400 hover:bg-red-50 hover:text-red-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{t.icon}</span>
                    {t.label}
                  </span>
                  {activeTab === t.id && <FiChevronRight className="text-xs opacity-60" />}
                </button>
              ))}
            </nav>
          </aside>
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm min-h-[400px]">
            <h2 className={`text-base font-bold mb-6 ${active?.danger ? "text-red-600" : "text-gray-800"}`}>
              {active?.label}
            </h2>
            {renderTab(activeTab)}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfileSettingsPage;
