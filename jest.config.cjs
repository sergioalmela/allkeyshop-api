module.exports = {
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^\\.\\./src/(.*)$': '<rootDir>/dist/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
}
