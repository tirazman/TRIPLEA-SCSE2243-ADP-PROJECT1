import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./view/Auth/Login";

import PTDashboard from "./view/PembantuTadbir/PTDashboard";
import KJDashboard from "./view/KetuaJabatan/KJDashboard";
import KBDashboard from "./view/KetuaBahagian/KBDashboard";
import PPLDashboard from "./view/PegawaiPenyediaLaporan/PPLDashboard";
import PPBDashboard from "./view/PegawaiPenyelarasBahagian/PPBDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/pembantu-tadbir" element={<PTDashboard />} />
        <Route path="/ketua-jabatan" element={<KJDashboard />} />
        <Route path="/ketua-bahagian" element={<KBDashboard />} />
        <Route path="/pegawai-penyedia" element={<PPLDashboard />} />
        <Route path="/pegawai-penyelaras" element={<PPBDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;