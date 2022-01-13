import { Context } from './src/api';
import { readConfig } from './src/config';
import { ClientCredentials } from './src/credentials';

describe('foo', () => {
  // it('foo test', async () => {
  //   const creds = new GetTokenCredentials(() => Promise.resolve('foo'));
  //   const aa = new Context(creds, 'foo');

  //   expect(aa.host).toBe('bab');
  // });

  it('config', async () => {
    const config = await readConfig();
    const creds = new ClientCredentials(config);
    const ctx = new Context(creds, config.host, config.port, config.scheme);

    const res = await ctx.request('/compute');

    console.log('result', res);
  });
});
