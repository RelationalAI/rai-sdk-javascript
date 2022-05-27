// this is supposed to fail if there's something wrong with the CJS bundle
const { Client } = require('@relationalai/rai-sdk-javascript');

console.log('SDK Client', Client);
