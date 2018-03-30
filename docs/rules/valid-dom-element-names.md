# Prevent invalid HTML DOM elements (e.g. `<foo />`, `<bar />`) to be used (react/valid-dom-element-names)

prevent invalid HTML DOM elements to be used. Only valid element names are available:

> `a` `abbr` `acronym` `address` `applet` `area` `article` `aside` `audio` `b` `base` `basefont` `bdi` `bdo` `big` `blockquote` `body` `br` `button` `canvas` `caption` `center` `cite` `code` `col` `colgroup` `datalist` `dd` `del` `details` `dfn` `dialog` `dir` `div` `dl` `dt` `em` `embed` `fieldset` `figcaption` `figure` `font` `footer` `form` `frame` `frameset` `h1` `h2` `h3` `h4` `h5` `h6` `head` `header` `hr` `html` `i` `iframe` `img` `input` `ins` `kbd` `label` `legend` `li` `link` `main` `map` `mark` `menu` `menuitem` `meta` `meter` `nav` `noframes` `noscript` `object` `ol` `optgroup` `option` `output` `p` `param` `picture` `pre` `progress` `q` `rp` `rt` `ruby` `s` `samp` `script` `section` `select` `small` `source` `span` `strike` `strong` `style` `sub` `summary` `sup` `svg` `table` `tbody` `td` `template` `textarea` `tfoot` `th` `thead` `time` `title` `tr` `track` `tt` `u` `ul` `var` `video` `wbr`

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
