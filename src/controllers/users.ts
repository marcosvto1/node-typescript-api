import { Controller, Post, Get, Middleware } from '@overnightjs/core';
import { Response, Request } from 'express';
import { User } from '@src/models/user';
import { BaseController } from '@src/controllers';
import AuthService from '@src/services/auth';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';

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

  @Post('authenticate')
  public async authenticate(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return this.sendErrorResponse(res, 
        {
          code: 401,
          message: 'User not found!',
        }
      );
    }

    if (!(await AuthService.comparePasswords(password, user.password))) {
      return this.sendErrorResponse(res,{
        code: 401,
        message: 'Password does not match!',
      });
    }

    const token = AuthService.generateToken(user.toJSON());

    return res.status(200).send({
      token,
    });
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me(req: Request, res: Response): Promise<Response> {
    const email = req.decoded ? req.decoded.email : undefined;
    const user =  await User.findOne({email});
    if (!user) {
      return this.sendErrorResponse(res, { 
        code: 404,
        message: 'User not found!'
      });
    }

    return res.send({ user });
  }

  @Get('beaches')
  @Middleware(authMiddleware)
  public async beachs(req: Request, res: Response): Promise<Response> {
    const email = req.decoded ? req.decoded.email : undefined;
    const user = await User.findOne({email});
    if (!user) {
      return this.sendErrorResponse(res, { 
        code: 404,
        message: 'User not found!'
      });
    }

    const beaches = await Beach.find({
      user: req.decoded?.id,
    });

    if (!beaches) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'Beachs not found for user'
      });
    }

    return res.send(beaches);
  }
}
