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
export declare type Engine = {
    id: string;
    name: string;
    size: string;
    region: string;
    state: string;
    created_by: string;
    requested_on: string;
    created_on: string;
    deleted_on: string;
};
export declare type EngineOptions = {
    id?: string | string[];
    name?: string | string[];
    size?: string | string[];
    state?: EngineState | EngineState[];
};
export declare enum EngineSize {
    XS = "XS",
    S = "S",
    M = "M",
    L = "L",
    XL = "XL"
}
export declare enum EngineState {
    REQUESTED = "REQUESTED",
    PROVISIONING = "PROVISIONING",
    REGISTERING = "REGISTERING",
    PROVISIONED = "PROVISIONED",
    PROVISION_FAILED = "PROVISION_FAILED",
    DELETE_REQUESTED = "DELETE_REQUESTED",
    STOPPING = "STOPPING",
    DELETING = "DELETING",
    DELETED = "DELETED",
    DELETION_FAILED = "DELETION_FAILED"
}
