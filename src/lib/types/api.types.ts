export interface SuccessResponse<T> {
    success: true;
    data: T;
}

export interface ErrorResponse {
    success: false;
    error: string
    details?: string[];
}

export interface PaginationMeta{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export interface PaginatedResponse<T>{
    success: true;
    data: T[];
    meta: PaginationMeta;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse | PaginatedResponse<T>;