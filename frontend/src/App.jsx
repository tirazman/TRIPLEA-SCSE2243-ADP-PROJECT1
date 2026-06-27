import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./view/Auth/Login";

import PTDashboard from "./view/PembantuTadbir/PTDashboard";
import KJDashboard from "./view/KetuaJabatan/KJDashboard";
import KBDashboard from "./view/KetuaBahagian/KBDashboard";
import PPLDashboard from "./view/PegawaiPenyediaLaporan/PPLDashboard";

import PPBDashboard from "./view/PegawaiPenyelarasBahagian/PPBDashboard";
import PPBPenerimaanLaporan from "./view/PegawaiPenyelarasBahagian/PPBPenerimaanLaporan";
import PPBLaporanDihantar from "./view/PegawaiPenyelarasBahagian/PPBLaporanDihantar";
import PPBStatusKerja from "./view/PegawaiPenyelarasBahagian/PPBStatusKerja";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/pembantu-tadbir" element={<PTDashboard />} />
        <Route path="/ketua-jabatan" element={<KJDashboard />} />
        <Route path="/ketua-bahagian" element={<KBDashboard />} />
        <Route path="/pegawai-penyedia" element={<PPLDashboard />} />

        {/* Pegawai Penyelaras Bahagian — nested so Outlet inside PPBDashboard has somewhere to render */}
        <Route path="/pegawai-penyelaras" element={<PPBDashboard />}>
          <Route index element={<Navigate to="penerimaan" replace />} />
          <Route path="penerimaan" element={<PPBPenerimaanLaporan />} />
          <Route path="laporan" element={<PPBLaporanDihantar />} />
          <Route path="status" element={<PPBStatusKerja />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;