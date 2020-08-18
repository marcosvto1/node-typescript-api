import { Controller, Post } from "@overnightjs/core";
import { Response, Request } from 'express';
import { User } from '@src/models/user';
import mongoose from 'mongoose';
import { BaseController } from "@src/controllers";

@Controller('users')
export class UsersController extends BaseController {
  
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const result = await user.save();
      res.status(201).send(result);
    } catch (error) {
      this.sendCreatedUpdatedErrorResponse(res, error);
    }

  }
}