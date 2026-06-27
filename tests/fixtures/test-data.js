const themes = ['light', 'dark'];

const calculatorCases = {
  zero: {
    input: '0',
    expectedCurrency: 'PS0'
  },
  decimalSanitized: {
    input: '12.34',
    expectedCurrency: 'PS1,234'
  },
  invalidNegative: {
    input: '-100',
    expectedError: 'Please enter a valid positive number.'
  },
  veryLarge: {
    input: '1000000000000',
    expectedCurrency: 'PS1,000,000,000,000'
  },
  presetBillion: {
    buttonName: 'PS1 billion',
    expectedCurrency: 'PS1,000,000,000'
  }
};

const performanceBudgets = {
  homeLoadMs: 3000,
  homeTotalTransferBytes: 2 * 1024 * 1024,
  maxImageBytes: 800 * 1024,
  maxScriptBytes: 350 * 1024
};

module.exports = {
  themes,
  calculatorCases,
  performanceBudgets
};
