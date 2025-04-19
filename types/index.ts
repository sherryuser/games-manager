// types/index.ts
export interface Item {
  id: number;
  name: string;
  order: number;
  displayNumber?: string;
  subCategories?: string;
  itemCount?: number;
  children?: Item[];
  parentId?: number | null;
  collapsed?: boolean;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface HistoryState {
  itemsState: Item[];
  timestamp: number;
}