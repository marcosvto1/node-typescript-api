import { SetupServe } from '@src/server';
import supertest from 'supertest';

beforeAll(() => {
  const server = new SetupServe();
  server.init();
  global.testRequest = supertest(server.getApp());
});
