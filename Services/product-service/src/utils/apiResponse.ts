import type { Response } from 'express';

export class ApiResponse {
  // Success response (200)

  static success(
    res: Response,
    data: any,
    message: string = 'Success!',
    meta: Record<string, any> = {},
  ) {
    return res.status(200).json({
      success: true,
      message,
      data,
      ...meta,
    });
  }

  static created(
    res: Response,
    data: any,
    message: string = 'Resource created successfully!',
  ) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
