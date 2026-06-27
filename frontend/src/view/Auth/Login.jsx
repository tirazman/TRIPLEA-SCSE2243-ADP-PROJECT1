import { useState, useLayoutEffect } from "react";
import "../../styles/pages/login.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    const root = document.getElementById("root");

    // Save original values
    const origBodyBg = document.body.style.backgroundColor;
    const origRootWidth = root?.style.width ?? "";
    const origRootMaxWidth = root?.style.maxWidth ?? "";
    const origRootMargin = root?.style.margin ?? "";
    const origRootBorder = root?.style.borderInline ?? "";
    const origRootDisplay = root?.style.display ?? "";
    const origRootBg = root?.style.backgroundColor ?? "";

    // Apply login-specific overrides
    document.body.style.backgroundColor = "#0d1f3c";
    if (root) {
      root.style.width = "100%";
      root.style.maxWidth = "100%";
      root.style.margin = "0";
      root.style.borderInline = "none";
      root.style.border = "none";
      root.style.display = "block";
      root.style.backgroundColor = "#0d1f3c";
    }

    // Cleanup: restore everything when navigating away
    return () => {
      document.body.style.backgroundColor = origBodyBg;
      if (root) {
        root.style.width = origRootWidth;
        root.style.maxWidth = origRootMaxWidth;
        root.style.margin = origRootMargin;
        root.style.borderInline = origRootBorder;
        root.style.border = "";
        root.style.display = origRootDisplay;
        root.style.backgroundColor = origRootBg;
      }
    };
  }, []);

  const handleSubmit = () => {
    console.log("Log Masuk:", { userId, password, remember });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* Header */}
        <div className="login-header">
          <h1>e-Urus PDK</h1>
          <h2>Log Masuk</h2>
          <p>Sila masukkan ID Pengguna dan Kata Laluan anda untuk meneruskan.</p>
        </div>

        {/* ID Pengguna */}
        <div className="form-group">
          <label htmlFor="userId">ID Pengguna</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="userId"
              type="text"
              placeholder="Contoh: zulkiflihasan"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
            />
          </div>
        </div>

        {/* Kata Laluan */}
        <div className="form-group">
          <label htmlFor="password">Kata Laluan</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan kata laluan anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Sembunyikan kata laluan" : "Tunjukkan kata laluan"}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Remember & Forgot */}
        <div className="form-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Ingat saya</span>
          </label>
          <a href="#" className="forgot-link">Lupa kata laluan?</a>
        </div>

        {/* Submit */}
        <button type="button" className="btn-login" onClick={handleSubmit}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Log Masuk
        </button>

        {/* Notice */}
        <div className="notice-box">
          <span className="notice-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </span>
          <p>
            <strong>Notis</strong>
            Sistem ini adalah untuk kegunaan dalaman Pejabat Daerah Kluang sahaja. Semua aktiviti akan direkodkan.
          </p>
        </div>

      </div>
    </div>
  );
}
