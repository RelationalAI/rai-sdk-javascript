# Change Log

## v0.7.7-alpha

- Exported EmptyRelationError

## v0.7.6-alpha

- Added an error to handle empty relation size of 0 bytes when reading arrow files

## v0.7.5-alpha

- Updated some dependencies.

## v0.7.4-alpha

- Added filtering, sorting and pagination options to `listTransactions` API.
  [\#101](https://github.com/RelationalAI/rai-sdk-javascript/pull/101)

### Breaking Changes

- `listTransactions` API now returns an object that contains `transactions` and
  `next` properties.
  - `transactions` is the result of the API call.
  - `next` is a continuation token that can be used to fetch the next page of
    results. `next` is `undefined` if there are no more results to fetch.

## v0.7.1-alpha

- Storing `AccessToken.createdOn` in seconds to be consistent with other RAI
  SDKs.

## [v0.7.0](https://github.com/relationalai/rai-sdk-javascript/tree/v0.7.0)

[Full Changelog](https://github.com/relationalai/rai-sdk-javascript/compare/v0.6.3...v0.7.0)

**Added**

- Switched to Protobuf metadata. JSON metadata is not exposed anymore.
  [\#32](https://github.com/relationalai/rai-sdk-javascript/pull/32)

## [v0.6.3](https://github.com/relationalai/rai-sdk-javascript/tree/v0.6.3) (2022-07-12)

[Full Changelog](https://github.com/relationalai/rai-sdk-javascript/compare/v.0.6.2...v0.6.3)

**Changed**

- Replaced microbund with webpack
  [\#35](https://github.com/relationalai/rai-sdk-javascript/pull/35)
