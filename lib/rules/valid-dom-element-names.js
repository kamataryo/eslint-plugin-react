/**
 * @fileoverview Prevent invalid DOM elements (e.g. <foo />, <bar />) to be used
 */
'use strict';

const {JSDOM} = require('jsdom');

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

function isCustomComponent(elementName) {
  return typeof elementName === 'string' && elementName[0] === elementName[0].toUpperCase();
}

function isValidDOMElement(elementName) {
  const dom = new JSDOM(`<${elementName} id="target" />`);
  const target = dom.window.document.getElementById('target');
  return target.toString() !== '[object HTMLUnknownElement]';
}

function errorMessage(elementName) {
  return `Invalid DOM element <${elementName} /> cannot be used.`;
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent using invalid DOM elements (e.g. <foo />).',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('valid-dom-element-names')
    },
    schema: []
  },

  create: Components.detect((context, components, utils) => ({
    JSXElement: function(node) {
      const elementName = node.openingElement.name.name;

      if (isCustomComponent(elementName)) {
        // e.g. MyComponent
        return;
      }

      if (isValidDOMElement(elementName)) {
        // e.g. div
        return;
      }

      context.report({
        node: node,
        message: errorMessage(elementName)
      });
    },

    CallExpression: function(node) {
      if (node.callee.type !== 'MemberExpression' && node.callee.type !== 'Identifier') {
        return;
      }

      if (!utils.isReactCreateElement(node)) {
        return;
      }

      const args = node.arguments;

      if (args.length < 1) {
        // React.createElement() should not crash linter
        return;
      }

      const elementName = args[0].value || args[0].name;

      if (isCustomComponent(elementName)) {
        // e.g. React.createElement(MyComponent);
        return;
      }

      if (isValidDOMElement(elementName)) {
        // e.g. React.createElement('div');
        return;
      }

      // e.g. React.createElement('foo', undefined, 'Foo')
      context.report({
        node: node,
        message: errorMessage(elementName)
      });
    }
  }))
};
