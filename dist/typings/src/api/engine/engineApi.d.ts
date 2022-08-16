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
import { Base } from '../base';
import { Engine, EngineOptions, EngineSize, EngineState } from './types';
export declare class EngineApi extends Base {
    createEngine(name: string, size?: EngineSize): Promise<Engine>;
    listEngines(options?: EngineOptions): Promise<Engine[]>;
    getEngine(name: string): Promise<Engine>;
    deleteEngine(name: string): Promise<{
        name: string;
        state: EngineState;
        message: string;
    }>;
}
