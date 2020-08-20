import { CUSTOM_VALIDATION } from './../models/user';
import mongoose from 'mongoose';
import { Response} from 'express';

export abstract class BaseController {
  protected sendCreatedUpdatedErrorResponse(
    res: Response, 
    error: mongoose.Error.ValidationError | Error): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      res
        .status(clientErrors.code)
        .send(clientErrors);
    } else {
      res.status(500).send({code: 500, error: 'Something went wrong'});
    }
  } 

  private handleClientErrors(
    error: mongoose.Error.ValidationError): 
    {code: number, error: string} {
      const duplicateKindErrors = Object.values(error.errors).filter((error) => error.kind === CUSTOM_VALIDATION.DUPLICATED)
      if (duplicateKindErrors.length) {
        return {
          code: 409,
          error: error.message
        };
      }
      
      return {code: 422, error: error.message};
  }
}