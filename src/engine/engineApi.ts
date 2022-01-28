import { Base } from '../base';
import { Engine, EngineOptions, EngineSize, EngineState } from './types';

const ENDPOINT = 'compute';

type ListReponse = { computes: Engine[] };
type SingleReponse = { compute: Engine };
type DeleteResponse = {
  status: {
    name: string;
    state: EngineState;
    message: string;
  };
};

export class EngineApi extends Base {
  async createEngine(name: string, size: EngineSize = EngineSize.XS) {
    const result = await this.put<SingleReponse>(ENDPOINT, {
      body: {
        region: this.region,
        name,
        size,
      },
    });

    return result.compute;
  }

  async listEngines(options?: EngineOptions) {
    const result = await this.get<ListReponse>(ENDPOINT, options);

    return result.computes;
  }

  async getEngine(name: string) {
    const engines = await this.listEngines({ name });

    return engines[0];
  }

  async deleteEngine(name: string) {
    const result = await this.delete<DeleteResponse>(ENDPOINT, {
      body: { name },
    });

    return result.status;
  }
}
