export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "16px 0" }}>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ padding: "6px 12px", opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
      >
        ‹ Sebelum
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          style={{
            padding: "6px 12px",
            minWidth: "32px",
            borderRadius: "6px",
            border: "1px solid var(--border, #d0d5dd)",
            background: p === currentPage ? "var(--navy, #0d1f3c)" : "white",
            color: p === currentPage ? "white" : "var(--text-dark, #1a1a1a)",
            fontWeight: p === currentPage ? 700 : 500,
            fontSize: "12.5px",
            cursor: "pointer",
          }}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        className="btn-secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ padding: "6px 12px", opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
      >
        Seterus ›
      </button>
    </div>
  );
}
