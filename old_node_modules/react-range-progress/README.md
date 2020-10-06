react-range-progress
=======================


[![Travis](https://img.shields.io/travis/vgrafe/react-range-progress.svg?maxAge=2592000)](https://travis-ci.org/vgrafe/react-range-progress) [![Codecov](https://img.shields.io/codecov/c/github/vgrafe/react-range-progress.svg?maxAge=2592000)](https://codecov.io/gh/vgrafe/react-range-progress) [![npm](https://img.shields.io/npm/dt/react-range-progress.svg?maxAge=2592000)](https://www.npmjs.com/package/react-range-progress)

A visually customizable range input component for react, inspired by [a post on css-tricks](https://css-tricks.com/custom-interactive-range-inputs/).

## Installation

```
npm install react-range-progress --save
```

You can also import from [npmcdn](https://npmcdn.com/react-range-progress) or [unpkg](https://unpkg.com/react-range-progress).

## Playground

You can play around with a few properties on [codesandbox](https://codesandbox.io/s/JqRpW8Mw2)

## Props

`hideThumb` - Boolean: Set to true to hide the thumb.

---

`height` - number: Track height in pixels.

---

`width` - number or string: Track width. In pixels when numeric, but can be given 'auto', '80%', etc.

---

`thumbSize` - number: Thumb size in pixels.

---

`min` - number: Minimum range value.

---

`max` - number: Maximum range value.

---

`onChange` - function: Callback called when the range value was changed.

---

`value` - number: Initial range value.

---

The following properties are set with an object with properties r, g, b, a to set red, green, blue (all from 0 to 255) and alpha (0.0 to 1.0) channels. Example for a half opaque
red color:
```js
{
  r: 255, g: 0, b: 0, a: .5
}
```

---

`fillColor` - color shape: Fills the track part on the left of the thumb. Defaults to white.

---

`trackColor` - color shape: Color of the 'empty' part of the track. Defaults to white with 50% opacity.

---
`readOnly` - bool: self explanatory.

---

`thumbColor` - color shape: Thumb color. Defaults to white.


### Run the tests

```
npm test
```

### License

MIT. Copyright (c) 2017 Vincent Grafé.


## Disclaimer

This package main purpose was to teach myself about publishing a package on npm.
Now I see there are a few monthly downloads, I advise any user to look at the source before using this package. If you can just style a couple of divs into a range, do it instead. Styling a range input may be overkill to reach the desired goal.