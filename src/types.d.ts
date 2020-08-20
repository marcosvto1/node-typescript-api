import { DecodedUser } from './services/auth';
import * as http from 'http';

// declare module global do express e subscreveu todo Request
declare module 'express-serve-static-core' {
  export interface Request extends http.IncomingMessage, Express.Request {
    decoded?: DecodedUser;
  }
}