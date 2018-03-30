/**
 * @fileoverview Prevent invalid DOM elements (e.g. <foo />, <bar />) to be used
 */
'use strict';

const has = require('has');

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

// Using an object here to avoid array scan. We should switch to Set once
// support is good enough.
const VALID_DOM_ELEMENTS = {
  a: true,
  abbr: true,
  acronym: true,
  address: true,
  applet: true,
  area: true,
  article: true,
  aside: true,
  audio: true,
  b: true,
  base: true,
  basefont: true,
  bdi: true,
  bdo: true,
  big: true,
  blockquote: true,
  body: true,
  br: true,
  button: true,
  canvas: true,
  caption: true,
  center: true,
  cite: true,
  code: true,
  col: true,
  colgroup: true,
  datalist: true,
  dd: true,
  del: true,
  details: true,
  dfn: true,
  dialog: true,
  dir: true,
  div: true,
  dl: true,
  dt: true,
  em: true,
  embed: true,
  fieldset: true,
  figcaption: true,
  figure: true,
  font: true,
  footer: true,
  form: true,
  frame: true,
  frameset: true,
  h1: true,
  h2: true,
  h3: true,
  h4: true,
  h5: true,
  h6: true,
  head: true,
  header: true,
  hr: true,
  html: true,
  i: true,
  iframe: true,
  img: true,
  input: true,
  ins: true,
  kbd: true,
  label: true,
  legend: true,
  li: true,
  link: true,
  main: true,
  map: true,
  mark: true,
  menu: true,
  menuitem: true,
  meta: true,
  meter: true,
  nav: true,
  noframes: true,
  noscript: true,
  object: true,
  ol: true,
  optgroup: true,
  option: true,
  output: true,
  p: true,
  param: true,
  picture: true,
  pre: true,
  progress: true,
  q: true,
  rp: true,
  rt: true,
  ruby: true,
  s: true,
  samp: true,
  script: true,
  section: true,
  select: true,
  small: true,
  source: true,
  span: true,
  strike: true,
  strong: true,
  style: true,
  sub: true,
  summary: true,
  sup: true,
  svg: true,
  table: true,
  tbody: true,
  td: true,
  template: true,
  textarea: true,
  tfoot: true,
  th: true,
  thead: true,
  time: true,
  title: true,
  tr: true,
  track: true,
  tt: true,
  u: true,
  ul: true,
  var: true,
  video: true,
  wbr: true
};

function isCustomComponent(elementName) {
  return typeof elementName === 'string' && elementName[0] === elementName[0].toUpperCase();
}

function isValidDOMElement(elementName) {
  return has(VALID_DOM_ELEMENTS, elementName);
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
