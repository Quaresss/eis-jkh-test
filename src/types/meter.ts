export const PAGE_SIZE = 20;

export type MeterApi = {
  id: string;
  _type: string[];
  area: { id: string };
  is_automatic: boolean;
  description: string;
  installation_date: string;
  initial_values: number[];
};

export type AreaApi = {
  id: string;
  str_number?: string;
  house?: { address?: string };
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
