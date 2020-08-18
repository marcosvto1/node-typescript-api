import mongoose from 'mongoose';
import { Response} from 'express';

export abstract class BaseController {
  protected sendCreatedUpdatedErrorResponse(
    res: Response, 
    error: mongoose.Error.ValidationError | Error): Response {

    if (error instanceof mongoose.Error.ValidationError) {
      res.status(422).send({code: 422, error: error.message});
    } else {
      res.status(500).send({code: 500, error: 'Something went wrong'});
    }

    return res;
  } 
}