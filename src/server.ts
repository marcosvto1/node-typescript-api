import './util/module-alias';

import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import * as http from 'http';
import { Application } from 'express';
import expressPino from 'express-pino-logger';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import apiSchema  from './api.schema.json';

import { OpenApiValidator } from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

import { BeachesController } from '@src/controllers/beaches';
import { ForecastController } from '@src/controllers/forecast';
import { UsersController } from '@src/controllers/users';

import * as database from './database';
import logger from '@src/logger';
import { apiErrorValidator } from '@src/middlewares/api-error-validator';

export class SetupServer extends Server {
  private server?: http.Server;

  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    await this.docsSetup();
    this.setupControllers();
    await this.databaseSetup();
    //must be the last
    this.setupErrorHandlers();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(expressPino({logger}));
    this.app.use(cors({
      origin: '*'
    }));
  } 

  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator);
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

  private async docsSetup(): Promise<void> {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema));
     await new OpenApiValidator({
      apiSpec: apiSchema as OpenAPIV3.Document,
      validateRequests: true,
      validateResponses: true
    }).install(this.app);
  }

  public getApp(): Application {
    return this.app;
  }
}
