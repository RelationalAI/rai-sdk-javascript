import { Base } from './base';
import { DatabaseApi } from './database/databaseApi';
import { EdbApi } from './edb/edbApi';
import { EngineApi } from './engine/engineApi';
import { ModelApi } from './model/modelApi';
import { OAuthClientApi } from './oauthClient/oauthClientApi';
import { QueryApi } from './query/queryApi';
import { TransactionApi } from './transaction/transactionApi';
import { UserApi } from './user/userApi';
import { applyMixins } from './utils';

class Client extends Base {}

// eslint-disable-next-line no-redeclare
interface Client
  extends DatabaseApi,
    EdbApi,
    EngineApi,
    ModelApi,
    OAuthClientApi,
    QueryApi,
    TransactionApi,
    UserApi {}

applyMixins(Client, [
  DatabaseApi,
  EdbApi,
  EngineApi,
  ModelApi,
  OAuthClientApi,
  QueryApi,
  TransactionApi,
  UserApi,
]);

export default Client;
