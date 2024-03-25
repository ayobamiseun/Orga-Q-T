import type {Config} from 'jest';
import {defaults} from 'jest-config';

const config: Config = {
    "transform": {
    "^.+\\.(ts|tsx|js|jsx)$": "ts-jest"
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  verbose: true,
};

export default config;