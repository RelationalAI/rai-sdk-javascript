import { Base } from '../base';
import { Database, DatabaseOptions } from './types';

const ENDPOINT = 'database';

type ListReponse = { databases: Database[] };
type SingleReponse = { database: Database };
type DeleteResponse = {
  name: string;
  message: string;
};

export class DatabaseApi extends Base {
  async createDatabase(name: string, cloneDatabase?: string) {
    const result = await this.put<SingleReponse>(ENDPOINT, {
      body: {
        name,
        source_name: cloneDatabase,
      },
    });

    return result.database;
  }

  async listDatabases(options?: DatabaseOptions) {
    const result = await this.get<ListReponse>(ENDPOINT, options);

    return result.databases;
  }

  async getDatabase(name: string) {
    const databases = await this.listDatabases({ name });

    return databases[0];
  }

  async deleteDatabase(name: string) {
    const result = await this.delete<DeleteResponse>(ENDPOINT, {
      body: { name },
    });

    return result;
  }
}
