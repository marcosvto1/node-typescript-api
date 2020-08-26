import './util/module-alias';

import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import expressPino from 'express-pino-logger';
import cors from 'cors';
import { BeachesController } from '@src/controllers/beaches';
import { ForecastController } from '@src/controllers/forecast';
import { UsersController } from '@src/controllers/users';

import * as database from './database';
import logger from '@src/logger';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    // this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(expressPino({logger: logger}));
    this.app.use(cors({
      origin: '*'
    }));
    this.setupControllers();

  } 

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();

    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
    // TODO - vai desligar toda aplicacao
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Server listening of port:' + this.port);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}
