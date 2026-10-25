const fs = require('fs');
const path = require('path');

const themes = ['light', 'dark'];

// The CV source of truth — tests derive expectations from it rather than hard-coding CV content
const cvData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'cv.json'), 'utf8'));

const site = {
  location: 'Staffordshire, UK',
  linkedin: 'https://www.linkedin.com/in/adrian-clarke-37239218/',
  avatar: '/assets/images/avatar-adrian.jpg',
  socialImage: '/assets/images/avatar-adrian-og.jpg'
};

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 }
};

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
  cvData,
  site,
  viewports,
  calculatorCases,
  performanceBudgets
};
