/**
 * database/seed.js
 * Seeds the database with sample questions.
 * Run: node database/seed.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { initialize, run, all } = require('./db');

const questions = [
  {
    title: 'Two Sum',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.\n\n**Example:**\n\`\`\`\nInput:  nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\n\`\`\`\n\n**Constraints:**\n- Each input has exactly one solution\n- You may not use the same element twice`,
    difficulty: 'easy',
    tags: JSON.stringify(['array', 'hash-map']),
    test_cases: JSON.stringify([
      { input: '[2,7,11,15], 9', expected_output: '[0,1]' },
      { input: '[3,2,4], 6', expected_output: '[1,2]' },
      { input: '[3,3], 6', expected_output: '[0,1]' },
    ]),
    expected_solution: `function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map[complement] !== undefined) return [map[complement], i];\n    map[nums[i]] = i;\n  }\n}`,
    starter_code: `function twoSum(nums, target) {\n  \n}`,
    validator_type: 'array',
  },
  {
    title: 'Reverse a String',
    description: `Write a function that reverses a string.\n\n**Example:**\n\`\`\`\nInput:  "hello"\nOutput: "olleh"\n\`\`\``,
    difficulty: 'easy',
    tags: JSON.stringify(['string', 'two-pointers']),
    test_cases: JSON.stringify([
      { input: '"hello"', expected_output: '"olleh"' },
      { input: '"world"', expected_output: '"dlrow"' },
      { input: '"abcde"', expected_output: '"edcba"' },
    ]),
    expected_solution: `function reverseString(s) {\n  return s.split('').reverse().join('');\n}`,
    starter_code: `function reverseString(s) {\n  \n}`,
    validator_type: 'string',
  },
  {
    title: 'Fibonacci Number',
    description: `Given \`n\`, return the nth Fibonacci number.\n\n**F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)**\n\n**Example:**\n\`\`\`\nInput:  n = 6\nOutput: 8\n\`\`\``,
    difficulty: 'easy',
    tags: JSON.stringify(['dynamic-programming', 'recursion', 'math']),
    test_cases: JSON.stringify([
      { input: '0', expected_output: '0' },
      { input: '1', expected_output: '1' },
      { input: '6', expected_output: '8' },
      { input: '10', expected_output: '55' },
    ]),
    expected_solution: `function fib(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];\n  return b;\n}`,
    starter_code: `function fib(n) {\n  \n}`,
    validator_type: 'number',
  },
  {
    title: 'Valid Palindrome',
    description: `A phrase is a palindrome if it reads the same forward and backward after lowercasing and removing non-alphanumeric characters.\n\n**Example:**\n\`\`\`\nInput:  "A man, a plan, a canal: Panama"\nOutput: true\n\`\`\``,
    difficulty: 'easy',
    tags: JSON.stringify(['string', 'two-pointers']),
    test_cases: JSON.stringify([
      { input: '"A man, a plan, a canal: Panama"', expected_output: 'true' },
      { input: '"race a car"', expected_output: 'false' },
      { input: '" "', expected_output: 'true' },
    ]),
    expected_solution: `function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}`,
    starter_code: `function isPalindrome(s) {\n  \n}`,
    validator_type: 'string',
  },
  {
    title: 'Maximum Subarray',
    description: `Given an integer array \`nums\`, find the contiguous subarray which has the largest sum and return its sum.\n\n**Example:**\n\`\`\`\nInput:  [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: [4,-1,2,1] has the largest sum = 6.\n\`\`\``,
    difficulty: 'medium',
    tags: JSON.stringify(['array', 'dynamic-programming', 'divide-and-conquer']),
    test_cases: JSON.stringify([
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected_output: '6' },
      { input: '[1]', expected_output: '1' },
      { input: '[5,4,-1,7,8]', expected_output: '23' },
    ]),
    expected_solution: `function maxSubArray(nums) {\n  let max = nums[0], cur = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    cur = Math.max(nums[i], cur + nums[i]);\n    max = Math.max(max, cur);\n  }\n  return max;\n}`,
    starter_code: `function maxSubArray(nums) {\n  \n}`,
    validator_type: 'number',
  },
  {
    title: 'Climbing Stairs',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\n**Example:**\n\`\`\`\nInput:  n = 3\nOutput: 3\nExplanation: 1+1+1, 1+2, 2+1\n\`\`\``,
    difficulty: 'easy',
    tags: JSON.stringify(['dynamic-programming', 'math', 'memoization']),
    test_cases: JSON.stringify([
      { input: '2', expected_output: '2' },
      { input: '3', expected_output: '3' },
      { input: '5', expected_output: '8' },
    ]),
    expected_solution: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];\n  return b;\n}`,
    starter_code: `function climbStairs(n) {\n  \n}`,
    validator_type: 'number',
  },
  {
    title: 'Merge Two Sorted Arrays',
    description: `Given the values of two sorted arrays, merge them and return the merged sorted array.\n\n**Example:**\n\`\`\`\nInput:  [1,2,4], [1,3,4]\nOutput: [1,1,2,3,4,4]\n\`\`\``,
    difficulty: 'easy',
    tags: JSON.stringify(['array', 'sorting', 'merge']),
    test_cases: JSON.stringify([
      { input: '[1,2,4], [1,3,4]', expected_output: '[1,1,2,3,4,4]' },
      { input: '[], [0]', expected_output: '[0]' },
      { input: '[1,3,5], [2,4,6]', expected_output: '[1,2,3,4,5,6]' },
    ]),
    expected_solution: `function mergeSortedArrays(a, b) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < a.length && j < b.length) {\n    if (a[i] <= b[j]) result.push(a[i++]);\n    else result.push(b[j++]);\n  }\n  return result.concat(a.slice(i)).concat(b.slice(j));\n}`,
    starter_code: `function mergeSortedArrays(a, b) {\n  \n}`,
    validator_type: 'array',
  },
  {
    title: 'Binary Search',
    description: `Given a sorted array of integers and a target, return its index if found, otherwise return -1.\n\n**Example:**\n\`\`\`\nInput:  [-1,0,3,5,9,12], target = 9\nOutput: 4\n\`\`\``,
    difficulty: 'easy',
    tags: JSON.stringify(['array', 'binary-search']),
    test_cases: JSON.stringify([
      { input: '[-1,0,3,5,9,12], 9', expected_output: '4' },
      { input: '[-1,0,3,5,9,12], 2', expected_output: '-1' },
      { input: '[5], 5', expected_output: '0' },
    ]),
    expected_solution: `function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (nums[mid] === target) return mid;\n    else if (nums[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}`,
    starter_code: `function search(nums, target) {\n  \n}`,
    validator_type: 'number',
  },
  {
    title: 'Valid Parentheses',
    description: `Given a string containing \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if it is valid (brackets closed in correct order).\n\n**Example:**\n\`\`\`\nInput:  "{[]}"\nOutput: true\n\nInput:  "(]"\nOutput: false\n\`\`\``,
    difficulty: 'easy',
    tags: JSON.stringify(['string', 'stack']),
    test_cases: JSON.stringify([
      { input: '"()"', expected_output: 'true' },
      { input: '"()[]{}"', expected_output: 'true' },
      { input: '"(]"', expected_output: 'false' },
      { input: '"{[]}"', expected_output: 'true' },
    ]),
    expected_solution: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if ('({['.includes(c)) stack.push(c);\n    else if (stack.pop() !== map[c]) return false;\n  }\n  return stack.length === 0;\n}`,
    starter_code: `function isValid(s) {\n  \n}`,
    validator_type: 'string',
  },
  {
    title: 'Longest Common Prefix',
    description: `Write a function to find the longest common prefix string amongst an array of strings.\n\n**Example:**\n\`\`\`\nInput:  ["flower","flow","flight"]\nOutput: "fl"\n\`\`\``,
    difficulty: 'easy',
    tags: JSON.stringify(['string', 'trie']),
    test_cases: JSON.stringify([
      { input: '["flower","flow","flight"]', expected_output: '"fl"' },
      { input: '["dog","racecar","car"]', expected_output: '""' },
      { input: '["interview","inter","internal"]', expected_output: '"inter"' },
    ]),
    expected_solution: `function longestCommonPrefix(strs) {\n  if (!strs.length) return "";\n  let prefix = strs[0];\n  for (let i = 1; i < strs.length; i++) {\n    while (!strs[i].startsWith(prefix)) prefix = prefix.slice(0, -1);\n  }\n  return prefix;\n}`,
    starter_code: `function longestCommonPrefix(strs) {\n  \n}`,
    validator_type: 'string',
  },
  {
    title: 'Number of Islands',
    description: `Given an m x n 2D binary grid of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.\n\n**Example:**\n\`\`\`\nInput: [["1","1","0"],["1","0","0"],["0","0","1"]]\nOutput: 2\n\`\`\``,
    difficulty: 'medium',
    tags: JSON.stringify(['matrix', 'bfs', 'dfs', 'union-find']),
    test_cases: JSON.stringify([
      { input: '[["1","1","1"],["0","1","0"],["1","1","1"]]', expected_output: '1' },
      { input: '[["1","1","0"],["1","0","0"],["0","0","1"]]', expected_output: '2' },
    ]),
    expected_solution: `function numIslands(grid) {\n  let count = 0;\n  function dfs(i, j) {\n    if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] !== '1') return;\n    grid[i][j] = '0';\n    dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1);\n  }\n  for (let i = 0; i < grid.length; i++)\n    for (let j = 0; j < grid[0].length; j++)\n      if (grid[i][j] === '1') { dfs(i, j); count++; }\n  return count;\n}`,
    starter_code: `function numIslands(grid) {\n  \n}`,
    validator_type: 'number',
  },
  {
    title: 'Coin Change',
    description: `Given coins of different denominations and an amount, return the fewest number of coins needed to make that amount. Return -1 if not possible.\n\n**Example:**\n\`\`\`\nInput:  coins = [1,5,6,9], amount = 11\nOutput: 2  (5+6)\n\`\`\``,
    difficulty: 'medium',
    tags: JSON.stringify(['dynamic-programming', 'bfs']),
    test_cases: JSON.stringify([
      { input: '[1,5,6,9], 11', expected_output: '2' },
      { input: '[2], 3', expected_output: '-1' },
      { input: '[1], 0', expected_output: '0' },
    ]),
    expected_solution: `function coinChange(coins, amount) {\n  const dp = Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++)\n    for (const c of coins)\n      if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
    starter_code: `function coinChange(coins, amount) {\n  \n}`,
    validator_type: 'number',
  },
];

async function seed() {
  console.log('🌱 Initializing database...');
  await initialize();

  console.log('🌱 Seeding questions...');
  const existing = all('SELECT COUNT(*) AS count FROM questions', []);
  if (Number(existing[0].count) > 0) {
    console.log('⚠️  Questions already seeded. Skipping. (Delete dev.db to re-seed)');
    process.exit(0);
  }

  for (const q of questions) {
    let starter = q.starter_code;
    if (!starter && q.expected_solution) {
      const match = q.expected_solution.match(/function\s+(\w+)\s*\(([^)]*)\)/);
      starter = match ? `function ${match[1]}(${match[2]}) {\n  \n}` : '// No signature found';
    }

    run(
      `INSERT INTO questions (title, description, difficulty, tags, test_cases, expected_solution, starter_code, validator_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [q.title, q.description, q.difficulty, q.tags, q.test_cases, q.expected_solution, starter, q.validator_type]
    );
  }

  console.log(`✅ Seeded ${questions.length} questions successfully.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
