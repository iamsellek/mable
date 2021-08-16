module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  collectCoverage: true,
  coverageReporters: ['cobertura', 'html'],
  testPathIgnorePatterns: ['/node_modules'],
  moduleDirectories: ['node_modules', '<rootDir>'],
};
