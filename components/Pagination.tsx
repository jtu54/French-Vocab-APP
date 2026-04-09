"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        className="pixel-button pixel-corners rounded-md px-4 py-3 text-lg font-bold text-bark disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      <div className="wood-panel pixel-corners rounded-md px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-[#fff4cf]">
        Page {currentPage} / {totalPages}
      </div>
      <button
        type="button"
        className="pixel-button pixel-corners rounded-md px-4 py-3 text-lg font-bold text-bark disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
}
