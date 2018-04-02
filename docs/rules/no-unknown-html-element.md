# Prevent unknown HTML DOM elements (e.g. `<foo />`, `<bar />`) to be used (react/no-unknown-html-element)

This rule prevents unknown HTML DOM elements to be used.

## Rule Details

The following patterns are considered warnings:

```jsx
<foo />;
React.createElement('foo');
```

The following patterns are **not** considered warnings:

```jsx
<div />
<MyComponent />
React.createElement('div')
React.createElement(MyComponent)
```
