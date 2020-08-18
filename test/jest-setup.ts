import { SetupServe } from '@src/server';
import supertest from 'supertest';

let server: SetupServe;

beforeAll(async () => {
  server = new SetupServe();
  await server.init();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => await server.close());