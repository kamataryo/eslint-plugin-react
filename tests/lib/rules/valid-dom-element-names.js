/**
 * @fileoverview Tests for valid-dom-element-names
 * @author Kamata, Ryo
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/valid-dom-element-names');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

function errorMessage(elementName) {
  return `Invalid DOM element <${elementName} /> cannot be used.`;
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('valid-dom-element-names', rule, {
  valid: [
    {
      code: '<div>Foo</div>;'
    },
    {
      code: 'React.createElement("div", {}, "Foo");'
    },
    {
      code: `
        const Component = () => null;
        <Component />;
      `
    },
    {
      code: `
        const Component = () => null;
        React.createElement(Component, {}, "Foo");
      `
    }
  ],
  invalid: [
    {
      code: '<foo>Bar</foo>;',
      errors: [{message: errorMessage('foo')}]
    },
    {
      code: 'React.createElement("foo", {}, "Foo");',
      errors: [{message: errorMessage('foo')}]
    }
  ]
});
