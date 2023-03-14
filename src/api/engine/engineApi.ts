/**
 * Copyright 2021 RelationalAI, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { Base, BaseOptions } from '../base';
import { Engine, EngineOptions, EngineSize, EngineState } from './types';

const ENDPOINT = 'compute';

type EmptyResponse = {};
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
  async createEngine(
    name: string,
    size: EngineSize = EngineSize.XS,
    { signal }: BaseOptions = {},
  ) {
    const result = await this.put<SingleReponse>(ENDPOINT, {
      body: {
        region: this.region,
        name,
        size,
      },
      signal,
    });

    return result.compute;
  }

  async listEngines(options?: EngineOptions, { signal }: BaseOptions = {}) {
    const result = await this.get<ListReponse>(ENDPOINT, {
      query: options,
      signal,
    });

    return result.computes;
  }

  async getEngine(name: string, { signal }: BaseOptions = {}) {
    const engines = await this.listEngines({ name }, { signal });

    return engines[0];
  }

  async deleteEngine(name: string, { signal }: BaseOptions = {}) {
    const result = await this.delete<DeleteResponse>(ENDPOINT, {
      body: { name },
      signal,
    });

    return result.status;
  }

  async suspendEngine(name: string, { signal }: BaseOptions = {}) {
    await this.patch<EmptyResponse>(`${ENDPOINT}/${name}`, {
      body: { suspend: true },
      signal,
    });
  }

  async resumeEngine(name: string, { signal }: BaseOptions = {}) {
    await this.patch<EmptyResponse>(`${ENDPOINT}/${name}`, {
      body: { suspend: false },
      signal,
    });
  }
}
