'use strict';

const reactDOM = require('../../__stub__/customized-react-dom');
const {isCustomComponent: {default: isCustomComponent}, DOMnamespaces} = reactDOM.shared;
const {Namespaces, getIntrinsicNamespace} = DOMnamespaces;
const HTML_NAMESPACE = Namespaces.html;

// We create tags in the namespace of their parent container, except HTML
// tags get no namespace.
let ownerDocument;
if (global.window) {
  ownerDocument = global.window.document;
} else {
  const {JSDOM} = require('jsdom');
  ownerDocument = new JSDOM('<html />').window.document;
}

function checkElementName(
  type /* : string */,
  props /* : Object */ = {},
  parentNamespace /* : string */ = HTML_NAMESPACE
) {
  // default
  const result = {
    isUppercaseHTML: false,
    isUnknownHTML: false
  };

  let isCustomComponentTag;

  let domElement;
  let namespaceURI = parentNamespace;

  if (namespaceURI === HTML_NAMESPACE) {
    namespaceURI = getIntrinsicNamespace(type);
  }

  if (namespaceURI === HTML_NAMESPACE) {
    isCustomComponentTag = isCustomComponent(type, props);
    // Should this check be gated by parent namespace? Not sure we want to
    // allow <SVG> or <mATH>.
    // warning(
    //   isCustomComponentTag || type === type.toLowerCase(),
    //   '<%s /> is using uppercase HTML. Always use lowercase HTML tags ' + 'in React.',
    //   type
    // );
    result.isUppercaseHTML = !isCustomComponentTag && type !== type.toLowerCase();

    if (type === 'script') {
      // Create the script via .innerHTML so its "parser-inserted" flag is
      // set to true and it does not execute
      const div = ownerDocument.createElement('div');
      div.innerHTML = '<script><' + '/script>'; // eslint-disable-line
      // This is guaranteed to yield a script element.
      const firstChild = div.firstChild;
      domElement = div.removeChild(firstChild);
    } else if (typeof props.is === 'string') {
      // $FlowIssue `createElement` should be updated for Web Components
      domElement = ownerDocument.createElement(type, {is: props.is});
    } else {
      // Separate else branch instead of using `props.is || undefined` above because of a Firefox bug.
      // See discussion in https://github.com/facebook/react/pull/6896
      // and discussion in https://bugzilla.mozilla.org/show_bug.cgi?id=1276240
      domElement = ownerDocument.createElement(type);
    }
  } else {
    domElement = ownerDocument.createElementNS(namespaceURI, type);
  }

  if (namespaceURI === HTML_NAMESPACE) {
    if (!isCustomComponentTag && Object.prototype.toString.call(domElement) === '[object HTMLUnknownElement]') {
      // warning(
      //   false,
      //   'The tag <%s> is unrecognized in this browser. ' +
      //     'If you meant to render a React component, start its name with ' +
      //     'an uppercase letter.',
      //   type
      // );
      result.isUnknownHTML = true;
    }
  }

  return result;
}

module.exports = {checkElementName};
