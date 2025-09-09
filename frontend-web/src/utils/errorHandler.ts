import { ErrorResponse } from '@fourth/shared-types';
import toast from 'react-hot-toast';

export class ErrorHandler {
  static handle(error: any): string {
    let message = 'An unexpected error occurred';

    if (error.response?.data) {
      const errorData: ErrorResponse = error.response.data;
      message = errorData.message || message;
    } else if (error.message) {
      message = error.message;
    }

    return message;
  }

  static handleWithToast(error: any, customMessage?: string): void {
    const message = customMessage || this.handle(error);
    toast.error(message);
  }

  static isNetworkError(error: any): boolean {
    return !error.response && error.request;
  }

  static isServerError(error: any): boolean {
    return error.response?.status >= 500;
  }

  static isClientError(error: any): boolean {
    return error.response?.status >= 400 && error.response?.status < 500;
  }

  static isAuthError(error: any): boolean {
    return error.response?.status === 401 || error.response?.status === 403;
  }

  static getErrorCode(error: any): string | undefined {
    return error.response?.data?.error?.code;
  }

  static getErrorDetails(error: any): any {
    return error.response?.data?.error?.details;
  }

  static logError(error: any, context?: string): void {
    console.error('Error occurred:', {
      context,
      error: error.response?.data || error.message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      timestamp: new Date().toISOString()
    });
  }
}

export default ErrorHandler;
