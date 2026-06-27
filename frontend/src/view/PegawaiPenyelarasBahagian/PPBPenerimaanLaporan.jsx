import { useState, useRef } from "react";
import Navbar from "../../components/common/navbar";
import CaseListView from "./components/CaseListView";
import CaseDetailView from "./components/CaseDetailView";
import AiLoadingOverlay from "./components/AiLoadingOverlay";
import Toast from "./components/Toast";
import { caseList, departmentReports, STRATEGI_MAPPING } from "../../data/caseData";
import "./PenerimaanLaporan.css";

export default function PPBPenerimaanLaporan() {
  const [view, setView] = useState("list"); 
  const [selectedCase, setSelectedCase] = useState(null);

  const [openCards, setOpenCards] = useState({});
  const [isConsolidating, setIsConsolidating] = useState(false);
  const [progress, setProgress] = useState({ pct: 0, msg: "" });
  const [draftGenerated, setDraftGenerated] = useState(false);
  const [draftTimestamp, setDraftTimestamp] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const stepIndexRef = useRef(0);

  const resetDetailState = () => {
    setOpenCards({});
    setIsConsolidating(false);
    setProgress({ pct: 0, msg: "" });
    setDraftGenerated(false);
    setDraftTimestamp("");
    setUploadedFile(null);
    setIsSubmitting(false);
    setIsSubmitted(false);
    stepIndexRef.current = 0;
  };

  const handleOpenCase = (caseItem) => {
    setSelectedCase(caseItem);
    resetDetailState();
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setView("list");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleCard = (id) => {
    setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };


  const handleStartConsolidation = () => {
    setIsConsolidating(true);
    stepIndexRef.current = 0;

    const advance = () => {
      const idx = stepIndexRef.current;
      if (idx >= STRATEGI_MAPPING.length) {
        setTimeout(() => {
          setIsConsolidating(false);
          finishGeneratingDraft();
        }, 400);
        return;
      }
      setProgress({ pct: STRATEGI_MAPPING[idx].pct, msg: STRATEGI_MAPPING[idx].msg });
      stepIndexRef.current += 1;
      setTimeout(advance, 600);
    };
    advance();
  };

  const finishGeneratingDraft = () => {
    const timestamp = new Date().toLocaleString("ms-MY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setDraftTimestamp(timestamp);
    setDraftGenerated(true);
  };

  const handleDownloadDraft = () => {
    const link = document.createElement("a");
    link.href = "data:application/octet-stream,";
    link.download = "Draf_Laporan_Konsolidasi_AI.docx";
    link.click();
  };

  const handleFileSelect = (file) => {
    setUploadedFile(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setToast({
        show: true,
        message: `Laporan lengkap ${selectedCase?.ref ?? ""} telah dikemukakan kepada Ketua Jabatan untuk semakan dan kelulusan.`,
      });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 6000);
    }, 1000);
  };

  const closeToast = () => setToast((t) => ({ ...t, show: false }));

  return (
    <>
      <Navbar
        title="Penerimaan Laporan"
        breadcrumbItems={["e-Urus PDK", "Subsistem 3", "Penerimaan Laporan"]}
        statusText={`${caseList.length} Kes Menunggu Tindakan`}
      />

      <div className="content">
        {view === "list" ? (
          <CaseListView cases={caseList} onOpenCase={handleOpenCase} />
        ) : (
          <CaseDetailView
            caseItem={selectedCase}
            onBack={handleBackToList}
            reports={departmentReports}
            openCards={openCards}
            onToggleCard={handleToggleCard}
            isConsolidating={isConsolidating}
            onStartConsolidation={handleStartConsolidation}
            draftGenerated={draftGenerated}
            draftTimestamp={draftTimestamp}
            onDownloadDraft={handleDownloadDraft}
            uploadedFile={uploadedFile}
            onFileSelect={handleFileSelect}
            onRemoveFile={handleRemoveFile}
            isSubmitting={isSubmitting}
            isSubmitted={isSubmitted}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      <AiLoadingOverlay show={isConsolidating} progressPct={progress.pct} progressMsg={progress.msg} />
      <Toast show={toast.show} message={toast.message} onClose={closeToast} />
    </>
  );
}