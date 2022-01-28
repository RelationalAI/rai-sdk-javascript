import { TransactionApi } from '../transaction/transactionApi';
import { ListEdbAction, ModifyWorkspaceAction } from '../transaction/types';

export class EdbApi extends TransactionApi {
  async listEdbs(database: string, engine: string) {
    const action: ListEdbAction = {
      type: 'ListEdbAction',
    };
    const result = await this.runActions(database, engine, [action]);

    if (result.actions[0]?.result?.type === 'ListEdbActionResult') {
      return result.actions[0].result.rels;
    }

    throw new Error('ListEdbActionResult is missing');
  }

  async deleteEdb(database: string, engine: string, name: string) {
    const action: ModifyWorkspaceAction = {
      type: 'ModifyWorkspaceAction',
      delete_edb: name,
    };
    const result = await this.runActions(database, engine, [action], false);

    if (result.actions[0]?.result?.type === 'ModifyWorkspaceActionResult') {
      return result.actions[0].result.delete_edb_result;
    }

    throw new Error('ModifyWorkspaceActionResult is missing');
  }
}
