export interface PaginationParams {
  page: number;
  limit: number;
}

export function getPaginationParams(query: { page?: string; limit?: string }): PaginationParams {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(query.limit || "10", 10)));

  return { page, limit };
}

export function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = items.slice(start, end);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
}
