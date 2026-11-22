import type { ReactNode } from "react";
import { RefreshCw, TriangleAlert, type LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  description?: string;
  value?: string | number;
  valueColor?: string;
  sideText?: string;
  sideTextClass?: string;
  icon: LucideIcon;
  iconColor?: string;
  children?: ReactNode;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const Card = ({
  title,
  description,
  value,
  valueColor,
  sideText,
  sideTextClass,
  icon: Icon,
  iconColor,
  children,
  isLoading = false,
  isFetching = false,
  isError = false,
  onRetry,
}: CardProps) => {
  const hasValue = value !== undefined && value !== null;

  // Tampilkan skeleton hanya ketika data pertama belum tersedia.
  if ((isLoading || isFetching) && !hasValue) {
    return (
      <section className="card w-full bg-base-100 shadow-sm" aria-busy="true">
        <div className="card-body gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton size-6 rounded-full" />
          </div>
          <div className="skeleton h-10 w-1/2" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </section>
    );
  }

  // Jika request pertama gagal dan belum ada data, berikan tombol retry.
  if (isError && !hasValue) {
    return (
      <section className="card w-full border border-error/30 bg-base-100 shadow-sm">
        <div className="card-body gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="card-title text-base font-semibold text-gray-700">
              {title}
            </h2>
            <TriangleAlert className="shrink-0 text-error" aria-hidden="true" />
          </div>
          <p className="text-sm text-error" role="alert">
            Gagal memuat data.
          </p>
          {onRetry && (
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={onRetry}
            >
              <RefreshCw size={14} /> Coba lagi
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="card w-full bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="card-title text-sm font-semibold uppercase text-gray-600">
            {title}
          </h2>
          <Icon
            className={`shrink-0 ${iconColor ?? "text-primary"}`}
            aria-hidden="true"
            size={22}
          />
        </div>

        <div className="min-w-0">
          <p
            className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 text-3xl font-bold ${valueColor ?? ""}`}
          >
            <span>
              {typeof value === "number"
                ? value.toLocaleString("id-ID")
                : (value ?? "—")}
            </span>
            {sideText && (
              <span
                className={`text-xs font-semibold ${sideTextClass ?? "text-gray-500"}`}
              >
                {sideText}
              </span>
            )}
          </p>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
          {isError && hasValue && (
            <p className="mt-2 text-xs text-warning" role="status">
              Gagal memperbarui; menampilkan data terakhir.
            </p>
          )}
          {isFetching && hasValue && (
            <p className="mt-1 text-xs text-gray-500" role="status">
              Memperbarui…
            </p>
          )}
        </div>

        {children && (
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3 border-t border-base-300 pt-4 text-xs">
            {children}
          </div>
        )}
      </div>
    </section>
  );
};

export default Card;
