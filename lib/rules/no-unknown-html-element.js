/**
 * @fileoverview Prevent invalid DOM elements (e.g. <foo />, <bar />) to be used
 */
'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const {checkElementName} = require('../util/dom-element');
// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

const errorMessages = elementName => `unknown element name <%${elementName}> is used.`;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'This rule prevents unknown HTML DOM elements to be used. (e.g. <foo />).',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-unknown-html-element')
    },
    schema: []
  },

  create: Components.detect((context, components, utils) => ({
    JSXElement: function(node) {
      const elementName = node.openingElement.name.name;

      const result = checkElementName(elementName);

      if (!result.isUppercaseHTML && result.isUnknownHTML) {
        context.report({
          node: node,
          message: errorMessages(elementName)
        });
      }
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

      const result = checkElementName(elementName);

      if (!result.isUppercaseHTML && result.isUnknownHTML) {
        context.report({
          node: node,
          message: errorMessages(elementName)
        });
      }
    }
  }))
};
