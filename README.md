# The RelationalAI Software Development Kit for JavaScript

The RelationalAI (RAI) SDK for JavaScript enables developers to access the RAI
REST APIs from JavaScript. The SDK provides first class TypeScript support.

- You can find RelationalAI product documentation at
  <https://docs.relational.ai>
- You can learn more about RelationalAI at <https://relational.ai>

## Getting started

### Requirements

- Node.js 14+

### Installing the SDK

Install

```console
$ npm install @relationalai/rai-sdk-javascript
```

### Create a configuration file

In order to run the examples and, you will need to create an SDK config file.
The default location for the file is `$HOME/.rai/config` and the file should
include the following:

```conf
[default]
host = azure.relationalai.com
port = <api-port>      # optional, default: 443
scheme = <scheme>      # optional, default: https
client_id = <your client_id>
client_secret = <your client secret>
client_credentials_url = <account login URL>  # optional
# default: https://login.relationalai.com/oauth/token
```

Client credentials can be created using the RAI console at
https://console.relationalai.com/login

### Usage

The package provides `readConfig` helper that reads the configuration file

```javascript
import { Client, readConfig } from '@relationalai/rai-sdk-javascript';

const config = await readConfig();
const client = new Client(config);

const result = await client.listEngines();
```

or you can build the config object

```javascript
import { Client, ClientCredentials } from '@relationalai/rai-sdk-javascript';

const credentials = new ClientCredentials(
  'your client_id',
  'your client_secret',
  'https://login.relationalai.com/oauth/token',
);
const config = {
  credentials,
  host: 'azure.relationalai.com',
  scheme: 'https',
  port: '443',
};
const client = new Client(config);

const result = await client.listEngines();
```

## Generate protobuf sources

```console
$ protoc --plugin="./node_modules/.bin/protoc-gen-ts_proto" -I="./src/proto" --ts_proto_opt=esModuleInterop=true --ts_proto_out="./src/proto/generated" src/proto/*.proto
```

## Examples

Each of the example files in the ./examples folder is standalone and can be run
from the command line, eg:

```console
$ npm run example -- ./examples/listEngines.ts
```

```console
$ npm run example -- ./examples/runQuery.ts -d dbName -e engineName -c "def output = 1 + 2"
```

## Support

You can reach the RAI developer support team at `support@relational.ai`

## Contributing

We value feedback and contributions from our developer community. Feel free to
submit an issue or a PR here.

## License

The RelationalAI Software Development Kit for JavaScript is licensed under the
Apache License 2.0. See:
https://github.com/RelationalAI/rai-sdk-javascript/blob/master/LICENSE
