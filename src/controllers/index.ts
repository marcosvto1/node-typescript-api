import { CUSTOM_VALIDATION } from './../models/user';
import mongoose from 'mongoose';
import { Response } from 'express';
import logger from '@src/logger';
import ApiError, { APIError } from '@src/util/errors/api-error';

export abstract class BaseController {
  protected sendCreatedUpdatedErrorResponse(
    res: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      this.sendErrorResponse(res, {code: clientErrors.code, message: clientErrors.error});
    } else {
      logger.error(error);
      this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' });
    }
  }

  private handleClientErrors(
    error: mongoose.Error.ValidationError
  ): { code: number; error: string } {
    const duplicateKindErrors = Object.values(error.errors).filter(
      (error) => error.kind === CUSTOM_VALIDATION.DUPLICATED
    );
    if (duplicateKindErrors.length) {
      return {
        code: 409,
        error: error.message,
      };
    }

    return { code: 400, error: error.message };
  }

  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }
}
