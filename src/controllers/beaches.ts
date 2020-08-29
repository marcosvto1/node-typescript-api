import { Controller, Post, ClassMiddleware, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Beach } from '@src/models/beach';
import { authMiddleware } from '@src/middlewares/auth';
import { BaseController } from '@src/controllers';


@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {


  @Get('')
  public async beaches(req: Request, res: Response): Promise<Response> {
    
    const beaches = await Beach.find({user: req.decoded?.id});
    if (!beaches) {
      console.log('error');
    }
    return res.send(beaches);
  }


  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach({ ...req.body, ...{ user: req.decoded?.id } });
      const result = await beach.save();
      res.status(201).send(result); // Automaticamente chama o toJSON do model
    } catch (error) {
      this.sendCreatedUpdatedErrorResponse(res, error);
    }
  }

}
