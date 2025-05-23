// The line `require 'coffee-errors'` was specific to CoffeeScript for better error stack traces.
// For TypeScript, `ts-node` (if used for running tests) or source maps typically handle this.
// If running compiled JS, Node's native stack traces for JS will be used.
// So, 'coffee-errors' is likely not needed or replaced by the TS tooling.

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

// To replicate the behavior of making `expect` global, as was common:
// (global as any).expect = chai.expect;
// (global as any).sinon = sinon;
// However, it's generally better practice in TypeScript to import `expect` and `sinon` explicitly in each test file.
// For this conversion, I will export them, and test files can import them.

export { chai, sinon, expect };
