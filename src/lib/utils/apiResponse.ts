import { ErrorResponse, SuccessResponse } from "../types/api.types";

//Success Response
export function successResponse<T>(data: T): SuccessResponse<T> {
    return {
        success: true,
        data: data
    }
}

//Error Response
export function errorResponse(error: string, details?: string[]): ErrorResponse {
    return {
        success: false,
        error: error,
        details: details
    }
}