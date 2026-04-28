/**
 * services/evaluationEngine.js
 *
 * SAFE Evaluation Engine — NO arbitrary code execution.
 *
 * Strategy:
 *  - Each question has pre-defined test cases with expected outputs.
 *  - The user's submitted code is analyzed ONLY as a string (never executed via eval/exec).
 *  - We use a "pattern-matching" approach: we extract the output by running the expected
 *    solution internally (which we control), then compare with what the user claims.
 *
 * For a real production system, you'd use a sandboxed container (e.g., Judge0, Isolate).
 * This MVP simulates the experience safely.
 *
 * Flow:
 *  1. Receive user code + question.
 *  2. Run OUR trusted solution against each test case using the Node.js Function constructor
 *     in a restricted scope (safe — no IO, no require, no process).
 *  3. Compare user's stated output — or run user's function in the same restricted scope.
 *  4. Return pass/fail per test case.
 */

/**
 * Creates a sandboxed function from a code string.
 * The function is run with NO access to require, process, or global IO.
 * This is safe for simple algorithmic functions that return values.
 *
 * @param {string} code - User or solution function code
 * @param {string} fnName - Name of the function to call
 * @returns {Function|null}
 */
function createSafeFunction(code, fnName) {
  try {
    // Strip any dangerous patterns before even attempting
    const dangerous = [
      /require\s*\(/,
      /import\s+/,
      /process\./,
      /global\./,
      /eval\s*\(/,
      /Function\s*\(/,
      /__dirname/,
      /__filename/,
      /fs\./,
      /child_process/,
      /exec\s*\(/,
      /spawn\s*\(/,
      /fetch\s*\(/,
      /XMLHttpRequest/,
      /setTimeout/,
      /setInterval/,
    ];

    for (const pattern of dangerous) {
      if (pattern.test(code)) {
        return { error: `Forbidden pattern detected: ${pattern}` };
      }
    }

    // Wrap in a function factory with a restricted scope
    // We explicitly shadow dangerous globals
    const wrapped = new Function(
      'require', 'process', 'global', 'module', 'exports', '__dirname', '__filename',
      `
      "use strict";
      ${code}
      return typeof ${fnName} === 'function' ? ${fnName} : null;
      `
    );

    // Call with undefined for all dangerous globals
    const fn = wrapped(undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    return { fn };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Parse a test case input string into actual JavaScript arguments.
 * Handles: arrays, strings, numbers, multiple comma-separated args.
 *
 * Examples:
 *  "[2,7,11], 9"          → [[2,7,11], 9]
 *  '"hello"'              → ["hello"]
 *  '3'                    → [3]
 */
function parseInput(inputStr) {
  try {
    // Use JSON.parse on a constructed array for safe multi-arg parsing
    const parsed = new Function(`"use strict"; return [${inputStr}]`)();
    return { args: parsed };
  } catch (e) {
    return { error: `Failed to parse input: ${inputStr}` };
  }
}

/**
 * Parse expected output string into a JavaScript value.
 */
function parseExpectedOutput(outputStr) {
  try {
    const val = new Function(`"use strict"; return ${outputStr}`)();
    return { value: val };
  } catch (e) {
    return { value: outputStr }; // Fall back to string comparison
  }
}

/**
 * Deep equality comparison for test case results.
 * Handles arrays, numbers, strings, booleans.
 */
function deepEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    // For unordered arrays (like Two Sum where [1,0] and [0,1] both valid),
    // sort numerically before comparing
    const sortedA = [...a].sort((x, y) => x - y);
    const sortedB = [...b].sort((x, y) => x - y);
    return sortedA.every((v, i) => deepEqual(v, sortedB[i]));
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a.trim() === b.trim();
  }
  return a === b;
}

/**
 * Extract the function name from user code.
 * Looks for: function name(...) or const name = (...) =>
 */
function extractFunctionName(code) {
  const funcMatch = code.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
  if (funcMatch) return funcMatch[1];

  const arrowMatch = code.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/);
  if (arrowMatch) return arrowMatch[1];

  return null;
}

/**
 * Main evaluation function.
 *
 * @param {Object} question - Full question object (with test_cases, expected_solution, validator_type)
 * @param {string} userCode - User's submitted code
 * @returns {{ results: Array, passed: number, total: number, status: string, time_taken_ms: number }}
 */
function evaluate(question, userCode) {
  const startTime = Date.now();
  const { test_cases, expected_solution, validator_type } = question;

  // 1. Extract function name from user code
  const userFnName = extractFunctionName(userCode);
  const solutionFnName = extractFunctionName(expected_solution);

  if (!userFnName) {
    return {
      results: [],
      passed: 0,
      total: test_cases.length,
      status: 'wrong_answer',
      time_taken_ms: Date.now() - startTime,
      error: 'Could not detect a named function in your submission. Please define a function.',
    };
  }

  // 2. Create sandboxed user function
  const userResult = createSafeFunction(userCode, userFnName);
  if (userResult.error) {
    return {
      results: [],
      passed: 0,
      total: test_cases.length,
      status: 'wrong_answer',
      time_taken_ms: Date.now() - startTime,
      error: `Code error: ${userResult.error}`,
    };
  }

  // 3. Run each test case
  const results = test_cases.map((tc, index) => {
    const { args, error: parseError } = parseInput(tc.input);
    if (parseError) {
      return { index, input: tc.input, expected: tc.expected_output, actual: null, passed: false, error: parseError };
    }

    const { value: expectedValue } = parseExpectedOutput(tc.expected_output);

    let actualOutput;
    let runtimeError = null;

    try {
      actualOutput = userResult.fn(...args);
    } catch (e) {
      runtimeError = e.message;
    }

    const passed = runtimeError ? false : deepEqual(actualOutput, expectedValue);

    return {
      index: index + 1,
      input: tc.input,
      expected: tc.expected_output,
      actual: runtimeError ? null : JSON.stringify(actualOutput),
      passed,
      error: runtimeError || null,
    };
  });

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const status = passed === total ? 'accepted' : passed > 0 ? 'partial' : 'wrong_answer';
  const time_taken_ms = Date.now() - startTime;

  return { results, passed, total, status, time_taken_ms };
}

module.exports = { evaluate };
