import { Context } from "hono";
import { ApiResponse } from "../types/index.js";

export function successResponse<T>(
  c: Context,
  data: T,
  message: string = "Success",
  statusCode: number = 200,
  metadata?: Record<string, unknown>
) {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  if (metadata) {
    response.metadata = metadata;
  }

  return c.json(response, { status: statusCode } as unknown as undefined);
}

export function errorResponse(
  c: Context,
  message: string = "Error",
  statusCode: number = 400,
  error?: string
) {
  const response: ApiResponse<null> = {
    success: false,
    message,
    error: error || message,
  };

  return c.json(response, { status: statusCode } as unknown as undefined);
}

export function notFoundResponse(c: Context, message: string = "Resource not found") {
  return errorResponse(c, message, 404);
}

export function serverErrorResponse(
  c: Context,
  error?: string
) {
  return errorResponse(
    c,
    "Internal server error",
    500,
    error
  );
}
