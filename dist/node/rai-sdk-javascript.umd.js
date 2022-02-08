(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cross-fetch'), require('query-string'), require('config-ini-parser'), require('fs'), require('os')) :
  typeof define === 'function' && define.amd ? define(['exports', 'cross-fetch', 'query-string', 'config-ini-parser', 'fs', 'os'], factory) :
  (global = global || self, factory(global.raiSdkJavascript = {}, global.crossFetch, global.queryString, global.configIniParser, global.fs, global.os));
})(this, (function (exports, fetch, queryString, configIniParser, fs, os) {
  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

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
  const VERSION = // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  "1.0.0"; // replaced at build time

  const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

  function addDefaultHeaders(headers, url) {
    const sdkUserAgent = `rai-sdk-javascript/${VERSION}`;
    const defaultHeaders = {
      Accept: 'application/json',
      'Content-type': 'application/json'
    };

    if (isNode) {
      // Only in Node because Browsers won't allow to set
      const parsedUrl = new URL(url);
      defaultHeaders['Host'] = parsedUrl.hostname;
      defaultHeaders['User-agent'] = sdkUserAgent;
    }

    return _extends({}, defaultHeaders, headers);
  }

  function makeUrl(scheme, host, port) {
    scheme = scheme.replace(/[^A-Za-z]/, '');
    return `${scheme}://${host}${port ? ':' + port : ''}`;
  }
  class SdkError extends Error {
    constructor(body, response) {
      super('');
      this.status = void 0;
      this.message = void 0;
      this.details = void 0;
      this.problems = void 0;
      this.response = void 0;
      this.name = 'SdkError';
      this.status = response.statusText;
      this.response = response;

      if (body.message !== undefined) {
        this.message = body.message;
        this.details = body.details;
        this.status = body.status;
      } else if (body.problems !== undefined) {
        this.message = 'Database error. See problems.';
        this.problems = body.problems;
      } else {
        this.message = 'Unknown error occured';
      }
    }

    toString() {
      return `${this.response.status} ${this.status}: ${this.message} ${this.details || ''}`;
    }

  }
  async function request(url, options = {}) {
    const opts = {
      method: options.method || 'GET',
      body: JSON.stringify(options.body),
      headers: addDefaultHeaders(options.headers, url)
    };
    const fullUrl = options.query && Object.keys(options.query).length > 0 ? `${url}?${queryString.stringify(options.query, {
    arrayFormat: 'none'
  })}` : url;
    const response = await fetch__default["default"](fullUrl, opts);
    const contentType = response.headers.get('content-type');
    let responseBody;

    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    if (options.onResponse) {
      try {
        options.onResponse(response.clone()); // eslint-disable-next-line no-empty
      } catch (_unused) {}
    }

    if (response.ok) {
      return responseBody;
    }

    throw new SdkError(responseBody, response);
  }

  class Base {
    constructor(config, region = 'us-east') {
      this.config = void 0;
      this.region = void 0;
      this.baseUrl = void 0;
      this._onResponse = void 0;
      this.config = config;
      this.region = region;
      this.baseUrl = makeUrl(config.scheme, config.host, config.port);
    }

    onResponse(onResponse) {
      this._onResponse = onResponse;
    }

    async request(path, options = {}) {
      const url = `${this.baseUrl}/${path}`;
      const token = await this.config.credentials.getToken(url);

      const opts = _extends({}, options, {
        onResponse: this._onResponse
      });

      if (token) {
        opts.headers = {
          authorization: `Bearer ${token}`
        };
      }

      return await request(url, opts);
    }

    async get(path, query = {}) {
      return this.request(path, {
        query,
        method: 'GET'
      });
    }

    async post(path, options) {
      return this.request(path, _extends({
        method: 'POST'
      }, options));
    }

    async put(path, options) {
      return this.request(path, _extends({
        method: 'PUT'
      }, options));
    }

    async patch(path, options) {
      return this.request(path, _extends({
        method: 'PATCH'
      }, options));
    }

    async delete(path, options) {
      return this.request(path, _extends({}, options, {
        method: 'DELETE'
      }));
    }

  }

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
  const ENDPOINT$4 = 'database';
  class DatabaseApi extends Base {
    async createDatabase(name, cloneDatabase) {
      const result = await this.put(ENDPOINT$4, {
        body: {
          name,
          source_name: cloneDatabase
        }
      });
      return result.database;
    }

    async listDatabases(options) {
      const result = await this.get(ENDPOINT$4, options);
      return result.databases;
    }

    async getDatabase(name) {
      const databases = await this.listDatabases({
        name
      });
      return databases[0];
    }

    async deleteDatabase(name) {
      const result = await this.delete(ENDPOINT$4, {
        body: {
          name
        }
      });
      return result;
    }

  }

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
  function makeLabeledAction(name, action) {
    const labeledAction = {
      type: 'LabeledAction',
      name: name,
      action
    };
    return labeledAction;
  }

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
  exports.TransactionMode = void 0;

  (function (TransactionMode) {
    TransactionMode["OPEN"] = "OPEN";
    TransactionMode["CREATE"] = "CREATE";
    TransactionMode["CREATE_OVERWRITE"] = "CREATE_OVERWRITE";
    TransactionMode["OPEN_OR_CREATE"] = "OPEN_OR_CREATE";
    TransactionMode["CLONE"] = "CLONE";
    TransactionMode["CLONE_OVERWRITE"] = "CLONE_OVERWRITE";
  })(exports.TransactionMode || (exports.TransactionMode = {}));

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
  const ENDPOINT$3 = 'transaction';
  class TransactionApi extends Base {
    async runTransaction(database, engine, transaction, mode = exports.TransactionMode.OPEN) {
      const query = {
        dbname: database,
        compute_name: engine,
        open_mode: mode,
        region: this.region
      };
      return await this.post(ENDPOINT$3, {
        query,
        body: transaction
      });
    }

    async runActions(database, engine, actions, readonly = true) {
      const labeledActions = actions.map((action, i) => makeLabeledAction(`action-${i}`, action));
      const transaction = {
        type: 'Transaction',
        abort: false,
        dbname: database,
        mode: exports.TransactionMode.OPEN,
        nowait_durable: false,
        readonly,
        version: 0,
        actions: labeledActions,
        computeName: engine
      };
      return await this.runTransaction(database, engine, transaction);
    }

  }

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
  class EdbApi extends TransactionApi {
    async listEdbs(database, engine) {
      var _result$actions$, _result$actions$$resu;

      const action = {
        type: 'ListEdbAction'
      };
      const result = await this.runActions(database, engine, [action]);

      if (((_result$actions$ = result.actions[0]) == null ? void 0 : (_result$actions$$resu = _result$actions$.result) == null ? void 0 : _result$actions$$resu.type) === 'ListEdbActionResult') {
        return result.actions[0].result.rels;
      }

      throw new Error('ListEdbActionResult is missing');
    }

    async deleteEdb(database, engine, name) {
      var _result$actions$2, _result$actions$2$res;

      const action = {
        type: 'ModifyWorkspaceAction',
        delete_edb: name
      };
      const result = await this.runActions(database, engine, [action], false);

      if (((_result$actions$2 = result.actions[0]) == null ? void 0 : (_result$actions$2$res = _result$actions$2.result) == null ? void 0 : _result$actions$2$res.type) === 'ModifyWorkspaceActionResult') {
        return result.actions[0].result.delete_edb_result;
      }

      throw new Error('ModifyWorkspaceActionResult is missing');
    }

  }

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
  exports.EngineSize = void 0;

  (function (EngineSize) {
    EngineSize["XS"] = "XS";
    EngineSize["S"] = "S";
    EngineSize["M"] = "M";
    EngineSize["L"] = "L";
    EngineSize["XL"] = "XL";
  })(exports.EngineSize || (exports.EngineSize = {}));

  exports.EngineState = void 0;

  (function (EngineState) {
    EngineState["REQUESTED"] = "REQUESTED";
    EngineState["PROVISIONING"] = "PROVISIONING";
    EngineState["REGISTERING"] = "REGISTERING";
    EngineState["PROVISIONED"] = "PROVISIONED";
    EngineState["PROVISION_FAILED"] = "PROVISION_FAILED";
    EngineState["DELETE_REQUESTED"] = "DELETE_REQUESTED";
    EngineState["STOPPING"] = "STOPPING";
    EngineState["DELETING"] = "DELETING";
    EngineState["DELETED"] = "DELETED";
    EngineState["DELETION_FAILED"] = "DELETION_FAILED";
  })(exports.EngineState || (exports.EngineState = {}));

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
  const ENDPOINT$2 = 'compute';
  class EngineApi extends Base {
    async createEngine(name, size = exports.EngineSize.XS) {
      const result = await this.put(ENDPOINT$2, {
        body: {
          region: this.region,
          name,
          size
        }
      });
      return result.compute;
    }

    async listEngines(options) {
      const result = await this.get(ENDPOINT$2, options);
      return result.computes;
    }

    async getEngine(name) {
      const engines = await this.listEngines({
        name
      });
      return engines[0];
    }

    async deleteEngine(name) {
      const result = await this.delete(ENDPOINT$2, {
        body: {
          name
        }
      });
      return result.status;
    }

  }

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
  class ModelApi extends TransactionApi {
    async installModels(database, engine, models) {
      var _result$actions$, _result$actions$$resu;

      const action = {
        type: 'InstallAction',
        sources: models
      };
      const result = await this.runActions(database, engine, [action], false);

      if (((_result$actions$ = result.actions[0]) == null ? void 0 : (_result$actions$$resu = _result$actions$.result) == null ? void 0 : _result$actions$$resu.type) === 'InstallActionResult') {
        return result.actions[0].result;
      }

      throw new Error('InstallActionResult is missing');
    }

    async listModels(database, engine) {
      var _result$actions$2, _result$actions$2$res;

      const action = {
        type: 'ListSourceAction'
      };
      const result = await this.runActions(database, engine, [action]);

      if (((_result$actions$2 = result.actions[0]) == null ? void 0 : (_result$actions$2$res = _result$actions$2.result) == null ? void 0 : _result$actions$2$res.type) === 'ListSourceActionResult') {
        return result.actions[0].result.sources;
      }

      throw new Error('ListSourceActionResult is missing');
    }

    async getModel(database, engine, name) {
      const models = await this.listModels(database, engine);
      const model = models.find(m => m.name === name);

      if (model) {
        return model;
      }

      throw new Error(`Model '${name}' not found`);
    }

    async deleteModel(database, engine, name) {
      var _result$actions$3, _result$actions$3$res;

      const action = {
        type: 'ModifyWorkspaceAction',
        delete_source: [name]
      };
      const result = await this.runActions(database, engine, [action], false);

      if (((_result$actions$3 = result.actions[0]) == null ? void 0 : (_result$actions$3$res = _result$actions$3.result) == null ? void 0 : _result$actions$3$res.type) === 'ModifyWorkspaceActionResult') {
        return result.actions[0].result;
      }

      throw new Error('ModifyWorkspaceActionResult is missing');
    }

  }

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
  const ENDPOINT$1 = 'oauth-clients';
  class OAuthClientApi extends Base {
    async createOAuthClient(name, permissions) {
      const result = await this.post(ENDPOINT$1, {
        body: {
          name,
          permissions
        }
      });
      return result.client;
    }

    async listOAuthClients() {
      const result = await this.get(ENDPOINT$1);
      return result.clients;
    }

    async getOAuthClient(clientId) {
      const result = await this.get(`${ENDPOINT$1}/${clientId}`);
      return result.client;
    }

    async updateOAuthClient(clientId, name, permissions) {
      const body = {};

      if (name) {
        body.name = name;
      }

      if (permissions) {
        body.permissions = permissions;
      }

      const result = await this.patch(`${ENDPOINT$1}/${clientId}`, {
        body
      });
      return result.client;
    }

    async rotateOAuthClientSecret(clientId) {
      const result = await this.post(`${ENDPOINT$1}/${clientId}/rotate-secret`, {});
      return result.client;
    }

    async deleteOAuthClient(clientId) {
      const result = await this.delete(`${ENDPOINT$1}/${clientId}`, {});
      return result;
    }

  }

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
  function makeModel(name, value) {
    const model = {
      type: 'Source',
      name,
      value,
      path: name
    };
    return model;
  }

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
  function makeQueryAction(queryString, inputs = []) {
    const action = {
      type: 'QueryAction',
      outputs: [],
      persist: [],
      source: makeModel('query', queryString),
      inputs: inputs.map(input => makeQueryInput(input.name, input.value))
    };
    return action;
  }
  const makeQueryInput = (name, value) => {
    const input = {
      rel_key: {
        values: [],
        name: name,
        keys: ['RAI_VariableSizeStrings.VariableSizeString'],
        type: 'RelKey'
      },
      type: 'Relation',
      columns: [[value]]
    };
    return input;
  };

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
  class QueryApi extends TransactionApi {
    async query(database, engine, queryString, inputs = [], readonly = true) {
      const action = makeQueryAction(queryString, inputs);
      return await this.runActions(database, engine, [action], readonly);
    }

    async loadJson(database, engine, relation, json) {
      const qs = [`def config:data = data`, `def insert:${relation} = load_json[config]`];
      const inputs = [{
        name: 'data',
        value: JSON.stringify(json)
      }];
      return this.query(database, engine, qs.join('\n'), inputs, false);
    }

    async loadCsv(database, engine, relation, csv, syntax, schema) {
      const qs = [`def config:data = data`];
      const inputs = [{
        name: 'data',
        value: csv
      }];

      if (syntax) {
        qs.push(...syntaxToRel(syntax));
      }

      if (schema) {
        qs.push(...schemaToRel(schema));
      }

      qs.push(`def insert:${relation} = load_csv[config]`);
      return this.query(database, engine, qs.join('\n'), inputs, false);
    }

  }

  function toRelLiteral(value) {
    if (typeof value === 'string') {
      if (value.length === 1) {
        const escapedValue = value.replace(/'/g, "\\'");
        return `'${escapedValue}'`;
      }

      const escapedValue = value.replace(/"/g, '\\"');
      return `"${escapedValue}"`;
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
  }

  function syntaxToRel(syntax) {
    const qs = [];
    Object.keys(syntax).forEach(k => {
      const prop = k;

      if (prop === 'header') {
        const headerStr = Object.keys(syntax.header).map(key => {
          return `(${key}, ${toRelLiteral(syntax.header[key])})`;
        }).join('; ');
        qs.push(`def config:syntax:header = ${headerStr}`);
      } else {
        qs.push(`def config:syntax:${prop} = ${toRelLiteral(syntax[prop])}`);
      }
    });
    return qs;
  }

  function schemaToRel(schema) {
    const qs = [];
    Object.keys(schema).forEach(colName => {
      qs.push(`def config:schema${colName} = ${toRelLiteral(schema[colName])}`);
    });
    return qs;
  }

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
  exports.UserStatus = void 0;

  (function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
  })(exports.UserStatus || (exports.UserStatus = {}));

  exports.UserRole = void 0;

  (function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
  })(exports.UserRole || (exports.UserRole = {}));

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
  const ENDPOINT = 'users';
  class UserApi extends Base {
    async createUser(email, roles) {
      const result = await this.post(ENDPOINT, {
        body: {
          email,
          roles
        }
      });
      return result.user;
    }

    async listUsers() {
      const result = await this.get(ENDPOINT);
      return result.users;
    }

    async getUser(userId) {
      const result = await this.get(`${ENDPOINT}/${userId}`);
      return result.user;
    }

    async updateUser(userId, status, roles) {
      const body = {};

      if (status) {
        body.status = status;
      }

      if (roles && roles.length) {
        body.roles = roles;
      }

      const result = await this.patch(`${ENDPOINT}/${userId}`, {
        body
      });
      return result.user;
    }

    async enableUser(userId) {
      return await this.updateUser(userId, exports.UserStatus.ACTIVE);
    }

    async disableUser(userId) {
      return await this.updateUser(userId, exports.UserStatus.INACTIVE);
    }

    async deleteUser(userId) {
      const result = await this.delete(`${ENDPOINT}/${userId}`, {});
      return result;
    }

  }

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
  // See https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern
  function applyMixins(derivedCtor, constructors) {
    constructors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null));
      });
    });
  }

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

  class Client extends Base {}

  applyMixins(Client, [DatabaseApi, EdbApi, EngineApi, ModelApi, OAuthClientApi, QueryApi, TransactionApi, UserApi]);

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
  class Credentials {}
  class GetTokenCredentials extends Credentials {
    constructor(getToken) {
      super();
      this.getToken = void 0;
      this.getToken = getToken;
    }

  }

  class AccessToken {
    constructor(token, experiesIn, createdOn) {
      this.token = void 0;
      this.experiesIn = void 0;
      this.createdOn = void 0;
      this.token = token;
      this.experiesIn = experiesIn;
      this.createdOn = createdOn;
    }

    get isExpired() {
      const delta = Date.now() - this.createdOn; // experiesIn stored in seconds

      return delta / 1000 >= this.experiesIn;
    }

  }

  class ClientCredentials extends Credentials {
    constructor(clientId, clientSecret, clientCredentialsUrl, readCache, writeCache) {
      super();
      this.readCache = void 0;
      this.writeCache = void 0;
      this.clientId = void 0;
      this.clientSecret = void 0;
      this.clientCredentialsUrl = void 0;
      this.accessToken = void 0;
      this.readCache = readCache;
      this.writeCache = writeCache;
      this.clientId = clientId;
      this.clientSecret = clientSecret;
      this.clientCredentialsUrl = clientCredentialsUrl;
    }

    async getToken(requestedUrl) {
      await this.readTokenFromCache();

      if (this.accessToken && !this.accessToken.isExpired) {
        return this.accessToken.token;
      }

      return this.requestToken(requestedUrl);
    }

    async readTokenFromCache() {
      if (!this.accessToken && this.readCache) {
        const cache = await this.readCache();

        if (cache) {
          this.accessToken = new AccessToken(cache.access_token, cache.expires_in, cache.created_on);
        }
      }
    }

    async requestToken(requestedUrl) {
      const parsedUrl = new URL(requestedUrl);
      const body = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
        // ensure the audience contains the protocol scheme
        audience: `https://${parsedUrl.hostname}`
      };
      const data = await request(this.clientCredentialsUrl, {
        method: 'POST',
        body
      });
      const token = {
        access_token: data.access_token,
        expires_in: data.expires_in,
        created_on: Date.now()
      };
      this.accessToken = new AccessToken(token.access_token, token.expires_in, token.created_on);

      if (this.writeCache) {
        await this.writeCache(token);
      }

      return this.accessToken.token;
    }

  }

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
  const {
    readFile,
    writeFile
  } = fs.promises;
  async function readConfig(profile = 'default', configPath = '~/.rai/config') {
    configPath = resolveHome(configPath);

    try {
      const strCfg = await readFile(configPath, 'utf-8');
      const configParser = new configIniParser.ConfigIniParser();
      configParser.parse(strCfg);

      if (!configParser.isHaveSection(profile)) {
        throw new Error(`Profile '${profile}' not found in ${configPath}`);
      }

      return readClientCredentials(configParser, profile);
    } catch (error) {
      if (isNodeError(error) && error.code === 'ENOENT') {
        throw new Error(`Can't find file: ${configPath}`);
      } else {
        throw error;
      }
    }
  }
  const REQUIRED_FIELDS = ['host', 'client_id', 'client_secret'];
  const DEFAULT_PORT = '443';
  const DEFAULT_SCHEME = 'https';
  const DEFAULT_CLIENT_CREDENTIALS_URL = 'https://login.relationalai.com/oauth/token';

  function readClientCredentials(configParser, profile) {
    for (const field of REQUIRED_FIELDS) {
      if (!configParser.get(profile, field, '')) {
        throw new Error(`Can't find ${field} field in ${profile} profile`);
      }
    }

    const config = {
      host: configParser.get(profile, 'host', ''),
      port: configParser.get(profile, 'port', DEFAULT_PORT),
      scheme: configParser.get(profile, 'scheme', DEFAULT_SCHEME),
      credentials: new ClientCredentials(configParser.get(profile, 'client_id', ''), configParser.get(profile, 'client_secret', ''), configParser.get(profile, 'client_credentials_url', DEFAULT_CLIENT_CREDENTIALS_URL), async () => await readTokenCache(profile), async cache => await writeTokenCache(cache, profile))
    };
    return config;
  }

  function isNodeError(error) {
    return error instanceof Error;
  }

  function resolveHome(path) {
    if (path.startsWith('~/')) {
      return `${os.homedir()}/${path.slice(2)}`;
    }

    return path;
  }

  function makeTokenCachePath(profile) {
    return resolveHome(`~/.rai/${profile}_cache.json`);
  }

  async function readTokenCache(profile = 'default') {
    const cachePath = makeTokenCachePath(profile);

    try {
      const cachedStr = await readFile(cachePath, 'utf-8');
      const cache = JSON.parse(cachedStr);

      if (cache.access_token && cache.created_on && cache.expires_in) {
        return cache;
      } // eslint-disable-next-line no-empty

    } catch (_unused) {}
  }

  async function writeTokenCache(token, profile = 'default') {
    const cachePath = makeTokenCachePath(profile);
    const cacheStr = JSON.stringify(token, null, 2);
    await writeFile(cachePath, cacheStr, 'utf-8');
  }

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
  exports.DatabaseState = void 0;

  (function (DatabaseState) {
    DatabaseState["CREATED"] = "CREATED";
    DatabaseState["CREATING"] = "CREATING";
    DatabaseState["CREATION_FAILED"] = "CREATION_FAILED";
    DatabaseState["DELETED"] = "DELETED";
  })(exports.DatabaseState || (exports.DatabaseState = {}));

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
  exports.Permission = void 0;

  (function (Permission) {
    // engines
    Permission["CREATE_COMPUTE"] = "create:compute";
    Permission["DELETE_COMPUTE"] = "delete:compute";
    Permission["LIST_COMPUTES"] = "list:compute";
    Permission["READ_COMPUTE"] = "read:compute"; // databases

    Permission["LIST_DATABASES"] = "list:database";
    Permission["UPDATE_DATABASE"] = "update:database";
    Permission["DELETE_DATABASE"] = "delete:database"; // transactions

    Permission["RUN_TRANSACTION"] = "run:transaction"; // credits

    Permission["READ_CREDITS_USAGE"] = "read:credits_usage"; // oauth clients

    Permission["CREATE_OAUTH_CLIENT"] = "create:oauth_client";
    Permission["READ_OAUTH_CLIENT"] = "read:oauth_client";
    Permission["LIST_OAUTH_CLIENTS"] = "list:oauth_client";
    Permission["UPDATE_OAUTH_CLIENT"] = "update:oauth_client";
    Permission["DELETE_OAUTH_CLIENT"] = "delete:oauth_client";
    Permission["ROTATE_OAUTH_CLIENT_SECRET"] = "rotate:oauth_client_secret"; // users

    Permission["CREATE_USER"] = "create:user";
    Permission["LIST_USERS"] = "list:user";
    Permission["READ_USER"] = "read:user";
    Permission["UPDATE_USER"] = "update:user"; // roles

    Permission["LIST_ROLES"] = "list:role";
    Permission["READ_ROLE"] = "read:role"; // permissions

    Permission["LIST_PERMISSIONS"] = "list:permission"; // access keys

    Permission["CREATE_ACCESS_KEY"] = "create:accesskey";
    Permission["LIST_ACCESS_KEYS"] = "list:accesskey";
  })(exports.Permission || (exports.Permission = {}));

  exports.Client = Client;
  exports.ClientCredentials = ClientCredentials;
  exports.Credentials = Credentials;
  exports.GetTokenCredentials = GetTokenCredentials;
  exports.SdkError = SdkError;
  exports.VERSION = VERSION;
  exports.readConfig = readConfig;

}));
//# sourceMappingURL=rai-sdk-javascript.umd.js.map
