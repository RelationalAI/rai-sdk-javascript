import { Credentials } from './credentials';

export type Config = {
  host: string;
  port: string;
  scheme: string;
  credentials: Credentials;
};
