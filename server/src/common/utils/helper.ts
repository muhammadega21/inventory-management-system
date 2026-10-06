import { Request } from "express";

export interface CommonQuery {
  id?: string;
  search?: string;
  page: number;
  limit: number;
  isActive?: boolean;
  sortBy?: string;
  sortOrder: "asc" | "desc";
  categoryId?: number;
}

export function paginationMeta(total: number, page: number, limit?: number) {
  return {
    page,
    limit: limit ?? total,
    total,
    totalPages: limit ? Math.ceil(total / limit) : 1,
  };
}

// parsing query parameter page dan limit menjadi integer positif, jika value tidak valid maka akan mengembalikan fallback, jika value lebih besar dari max maka akan mengembalikan max
const toPositiveInteger = (value: unknown, fallback: number, max: number) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
};

// memparsing filter aktif, jika value adalah "true" maka akan mengembalikan true, jika "false" maka akan mengembalikan false, jika "all" maka akan mengembalikan undefined, jika value tidak valid maka akan mengembalikan undefined
const parseActiveFilter = (value: unknown): boolean | undefined => {
  if (value === undefined) return undefined;

  const normalized = String(value).toLowerCase();

  if (normalized === "true") return true;
  if (normalized === "false") return false;
  if (normalized === "all") return undefined;

  return undefined;
};

export const getCommonQuery = (req: Request): CommonQuery => {
  const searchValue =
    typeof req.query.search === "string" ? req.query.search.trim() : "";
  const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";
  const categoryId =
    typeof req.query.categoryId === "string"
      ? Number(req.query.categoryId)
      : undefined;

  return {
    id: req.params.id as string,
    search: searchValue || undefined,
    page: toPositiveInteger(req.query.page, 1, Number.MAX_SAFE_INTEGER),
    limit: toPositiveInteger(req.query.limit, 10, 100),
    isActive: parseActiveFilter(req.query.is_active),
    sortBy: typeof req.query.sortBy === "string" ? req.query.sortBy : undefined,
    sortOrder,
    categoryId,
  };
};
