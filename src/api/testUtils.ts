import { GetTokenCredentials } from '../credentials';
import { mkUrl } from '../rest';
import { Context } from './context';

export const host = 'example.com';
export const scheme = 'https';
export const port = '443';
export const baseUrl = mkUrl(scheme, host, port);

export function getMockContext() {
  const credentials = new GetTokenCredentials(() =>
    Promise.resolve('mock token'),
  );
  const context = new Context({
    host,
    port,
    scheme,
    credentials,
  });

  return context;
}
