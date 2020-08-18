import { BaseController } from '@src/controllers';
import { Controller, Post } from "@overnightjs/core";
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Beach } from '@src/models/beach';

@Controller('beaches')
export class BeachesController extends BaseController{
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach(req.body);
      const result = await beach.save();
      res.status(201).send(result); // Automaticamente chama o toJSON do model
    } catch (error) {
      this.sendCreatedUpdatedErrorResponse(res, error);
    }
  }
}