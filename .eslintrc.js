module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'airbnb-base/legacy',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    'no-restricted-syntax': ['error', 'WithStatement', "BinaryExpression[operator='in']"],
    'consistent-return': [0],
    'no-restricted-globals': [0],
    'no-undef': [0]
  }
};
