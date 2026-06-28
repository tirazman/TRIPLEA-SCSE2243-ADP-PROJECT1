import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./view/Auth/Login";

import PTDashboard from "./view/PembantuTadbir/PTDashboard";
import KJDashboard from "./view/KetuaJabatan/KJDashboard";

import KBDashboard from "./view/KetuaBahagian/KBDashboard";
import KBArahanKetuaJabatan from "./view/KetuaBahagian/KBArahanKetuaJabatan";
import KBPengagihanTugasan from "./view/KetuaBahagian/KBPengagihanTugasan";
import KBLaporanDihantar from "./view/KetuaBahagian/KBLaporanDihantar";
import KBStatusKerja from "./view/KetuaBahagian/KBStatusKerja";

import PPLDashboard from "./view/PegawaiPenyediaLaporan/PPLDashboard";
import PPLStatusKerja from "./view/PegawaiPenyediaLaporan/PPLStatusKerja";

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

        {/*Ketua Bahagian — nested so <Outlet /> inside KBDashboard (the layout wrapper) has somewhere to render the actual page.*/}
        <Route path="/ketua-bahagian" element={<KBDashboard />}>
          <Route index element={<Navigate to="arahan-ketua-jabatan" replace />} />
          <Route path="arahan-ketua-jabatan" element={<KBArahanKetuaJabatan />} />
          <Route path="pengagihan-tugasan" element={<KBPengagihanTugasan />} />
          <Route path="laporan-dihantar" element={<KBLaporanDihantar />} />
          <Route path="status-kerja" element={<KBStatusKerja />} />
        </Route>

        {/* Pegawai Penyedia Laporan */}
        <Route path="/pegawai-penyedia" element={<PPLDashboard />}>
          <Route index element={<Navigate to="status-kerja" replace />} />
          <Route path="status-kerja" element={<PPLStatusKerja />} />
        </Route>

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
