import { Context } from './src/api';
import { GetTokenCredentials } from './src/credentials';

describe('foo', () => {
  it('foo test', async () => {
    const creds = new GetTokenCredentials(() => Promise.resolve('foo'));
    const aa = new Context(creds, 'foo');

    expect(aa.host).toBe('bab');
  });
});
