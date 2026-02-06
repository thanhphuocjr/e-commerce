import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('Error', err);

  // Handle Api Error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  //Handle MySQL errors
  if (err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        return res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_ENTRY',
            message: 'Resource already exists',
            details: { sqlMessage: err.sqlMessage },
          },
        });

      case 'ER_NO_REFERENCED_ROW_2':
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REFERENCE',
            message: 'Referenced resource does not exist',
            details: { sqlMessage: err.sqlMessage },
          },
        });

      case 'ER_ROW_IS_REFERENCED_2':
        return res.status(409).json({
          success: false,
          error: {
            code: 'RESOURCE_IN_USE',
            message: 'Cannot delete resource as it is being used',
            details: { sqlMessage: err.sqlMessage },
          },
        });
    }
  }

  if (err.name == 'ValidationError') {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.errors,
      },
    });
  }
  
  return res.status(500).json({
    success: false,
    error:{
        code:'INTERNAL_ERROR',
        message: 'INTERNAL SERVER ERROR'
    }
  })
};
