import { Credentials } from './credentials';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const VERSION = __RAI_SDK_VERSION__; // replaced at build time

export type Config = {
  host: string;
  port: string;
  scheme: string;
  credentials: Credentials;
};
