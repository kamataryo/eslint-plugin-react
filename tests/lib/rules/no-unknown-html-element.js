/**
 * @fileoverview Tests for no-unknown-html-element
 * @author Kamata, Ryo
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unknown-html-element');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

const errorMessage = elementName => `unknown element name <%${elementName}> is used.`;

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-unknown-html-element', rule, {
  valid: [
    {
      code: '<div>Foo</div>;'
    },
    {
      code: `
        const Component = () => null;
        <Component />;
      `
    },
    {
      code: 'React.createElement("div", {}, "Foo");'
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
