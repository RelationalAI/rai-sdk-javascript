import { Credentials } from './credentials';

export const VERSION =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  typeof __RAI_SDK_VERSION__ === 'undefined'
    ? 'to-be-replaced'
    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      __RAI_SDK_VERSION__; // replaced at build time

export type Config = {
  host: string;
  port: string;
  scheme: string;
  credentials: Credentials;
};
