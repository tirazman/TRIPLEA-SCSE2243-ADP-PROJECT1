import { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom"; // Required for navigation
import "../../styles/pages/login.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(""); // This acts as the 'username' for your schema[cite: 2]
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const root = document.getElementById("root");
    const origBodyBg = document.body.style.backgroundColor;
    const origRootWidth = root?.style.width ?? "";
    const origRootMaxWidth = root?.style.maxWidth ?? "";
    const origRootMargin = root?.style.margin ?? "";
    const origRootBorder = root?.style.borderInline ?? "";
    const origRootDisplay = root?.style.display ?? "";
    const origRootBg = root?.style.backgroundColor ?? "";

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

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info for session persistence
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        // Map database roles to your App.jsx routes
        const roleRoutes = {
          'KetuaJabatan': '/ketua-jabatan',
          'KetuaBahagian': '/ketua-bahagian',
          'PegawaiPenyediaLaporan': '/pegawai-penyedia',
          'PegawaiPenyelarasBahagian': '/pegawai-penyelaras',
          'PembantuTadbir': '/pembantu-tadbir'
        };

        const targetRoute = roleRoutes[data.user.role];
        
        if (targetRoute) {
          navigate(targetRoute);
        } else {
          alert("Role tidak dikenali: " + data.user.role);
        }
      } else {
        alert(data.message || "ID atau Kata Laluan Salah");
      }
    } catch (error) {
      console.error("Ralat sambungan:", error);
      alert("Tidak dapat menghubungi pelayan");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h1>e-Urus PDK</h1>
          <h2>Log Masuk</h2>
          <p>Sila masukkan ID Pengguna dan Kata Laluan anda untuk meneruskan.</p>
        </div>

        <div className="form-group">
          <label htmlFor="username">ID Pengguna</label>
          <div className="input-wrapper">
            <input
              id="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Kata Laluan</label>
          <div className="input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Sembunyi" : "Tunjuk"}
            </button>
          </div>
        </div>

        <button type="button" className="btn-login" onClick={handleSubmit}>
          Log Masuk
        </button>
      </div>
    </div>
  );
}