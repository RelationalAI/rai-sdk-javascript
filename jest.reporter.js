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

import { VerboseReporter } from '@jest/reporters';
import { formatResultsErrors } from 'jest-message-util';

export default class TestReporter extends VerboseReporter {
  constructor() {
    super(...arguments);

    this.logsPerTest = {};
    this.logsBuffer = [];

    // this's a hack to print logs messages
    // after test name in _logTest
    // by default Jest would print all logs before the test suite
    // so there's no way to associate log messages with tests
    globalThis.testLog = msg => this.logsBuffer.push(msg);
  }

  onTestCaseResult(test, testCaseResult) {
    super.onTestCaseResult(test, testCaseResult);

    // stashing away logs for the test that just finished
    this.logsPerTest[testCaseResult.fullName] = this.logsBuffer;
    this.logsBuffer = [];
  }

  _logTest(testCaseResult, indentLevel = 0) {
    super._logTest(testCaseResult, indentLevel);

    const logs = this.logsPerTest[testCaseResult.fullName] || [];

    if (logs.length) {
      const indentation = '  '.repeat(indentLevel + 2);
      logs.forEach(msg => {
        this.log(indentation + msg);
      });
    }
  }

  printTestFileFailureMessage(testPath, config, result) {
    result.testResults.forEach(testCaseResult => {
      const failureMessage = formatResultsErrors(
        [testCaseResult],
        config,
        {},
        testPath,
      );

      if (failureMessage) {
        this.log(failureMessage);

        const logs = this.logsPerTest[testCaseResult.fullName] || [];

        if (logs.length) {
          const indentation = '    ';

          this.log(indentation + 'Logs:');
          this.log('');
          logs.forEach(msg => this.log(indentation + msg));
          this.log('');
        }
      }
    });
  }
}
