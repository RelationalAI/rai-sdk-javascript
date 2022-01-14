import * as api from './src/api';
import { readConfig } from './src/config';

describe('foo', () => {
  // it('foo test', async () => {
  //   const creds = new GetTokenCredentials(() => Promise.resolve('foo'));
  //   const aa = new Context(creds, 'foo');

  //   expect(aa.host).toBe('bab');
  // });

  it('config', async () => {
    const config = await readConfig();
    const ctx = new api.Context(config);
    const res = await api.getEngine(ctx, 'dg-test123');

    //98768f5a-07e3-1568-caa2-06011081d0c1

    console.log('result', res);
  });
});
