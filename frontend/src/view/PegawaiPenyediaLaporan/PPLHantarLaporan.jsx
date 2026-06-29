import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/common/navbar";
import { assignedTasks } from "../../data/pplData";
import "../../styles/pages/PPLTugasanDetail.css";

export default function PPLHantarLaporan() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const task = assignedTasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <>
        <Navbar title="Hantar Laporan" breadcrumbItems={["e-Urus PDK", "Pegawai Penyedia Laporan", "Hantar Laporan"]} />
        <div className="content">
          <p>Tugasan tidak dijumpai.</p>
          <Link to="/pegawai-penyedia/arahan" className="kembali-link">Kembali ke Senarai Tugasan</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar
        title="Hantar Laporan"
        breadcrumbItems={["e-Urus PDK", "Pegawai Penyedia Laporan", "Hantar Laporan"]}
        userName="Amirul Haziq Abdullah"
        userRole="Pegawai Penyedia Laporan"
      />

      <div className="content">
        <Link to="/pegawai-penyedia/arahan" className="kembali-link">
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali ke Senarai Tugasan
        </Link>

        <div className="stepper-track">
          <div className="stepper-step">
            <div className="stepper-circle done">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="stepper-label done">Butiran Kes</span>
          </div>
          <div className="stepper-line done"></div>
          <div className="stepper-step">
            <div className="stepper-circle active">2</div>
            <span className="stepper-label active">Muat Naik Laporan</span>
          </div>
        </div>

        {/* sambung buat content kat sini */}

      </div>
    </>
  );
}