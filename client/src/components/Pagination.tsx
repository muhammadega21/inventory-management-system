import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    for (let page = 1; page <= totalPages; page++) {
      pages.push(page);
    }
  } else {
    pages.push(1);

    if (currentPage > 4) pages.push("...");

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="join">
      <button
        type="button"
        className="join-item btn"
        disabled={currentPage <= 1 || totalPages === 0}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <button
            type="button"
            key={`ellipsis-${index}`}
            className="join-item btn btn-disabled"
            disabled
          >
            ...
          </button>
        ) : (
          <button
            type="button"
            key={page}
            className={`join-item btn ${currentPage === page ? "btn-primary" : ""}`}
            onClick={() => onPageChange(Number(page))}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        className="join-item btn"
        disabled={currentPage >= totalPages || totalPages === 0}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Halaman berikutnya"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
