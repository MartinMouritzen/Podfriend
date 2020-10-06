import React from 'react';
import createComponent from 'react-unit';
import tape from 'tape';
import addAssertions from 'extend-tape';
import jsxEquals from 'tape-jsx-equals';
const test = addAssertions(tape, { jsxEquals });

// Component to test
import Range, { toRgbaString, trackPosition } from './index';

test('Testing toRgbaString', t => {
  const mock = {
    r: 1,
    g: 2,
    b: 3,
    a: 0.5
  };
  const actual = toRgbaString(mock);
  const expected = `rgba(1, 2, 3, 0.5)`;
  t.equal(
    actual,
    expected,
    'formats object to string compliant with css rgba syntax'
  );
  t.end();
});

test('Testing trackPosition with thumb bigger than track', t => {
  const mock = {
    height: 37,
    thumbSize: 87
  };
  const actual = trackPosition(mock);
  const expected = {
    top: 25,
    height: 37
  };
  t.equal(actual.top, expected.top, 'sets top gap to correct value');
  t.equal(actual.height, expected.height, 'sets height to max param');
  t.end();
});

test('Testing trackPosition with thumb lower than track', t => {
  const mock = {
    height: 100,
    thumbSize: 12
  };
  const actual = trackPosition(mock);
  const expected = {
    top: 0,
    height: 100
  };
  t.equal(
    actual.top,
    expected.top,
    'sets top gap = 0 if thumb lower than track'
  );
  t.equal(actual.height, expected.height, 'sets height to max param');
  t.end();
});

test('Testing component default values when no props set', t => {
  const component = createComponent.shallow(<Range />);

  const defaultProps = {
    fillColor: { r: 255, g: 255, b: 255, a: 1 },
    trackColor: { r: 255, g: 255, b: 255, a: 0.5 },
    thumbColor: { r: 255, g: 255, b: 255, a: 1 },
    thumbSize: 12,
    height: 6,
    min: 0,
    max: 100,
    value: 0
  };

  const percentProgress =
    defaultProps.value / (defaultProps.max - defaultProps.min);

  const rangeInput = component.findByQuery('input')[0];
  const trackDiv = component.findByQuery('#rrp-track')[0];
  const fillDiv = component.findByQuery('#rrp-fill')[0];
  const thumb = component.findByQuery('#rrp-thumb')[0];
  const baseDiv = component.findByQuery('#rrp-baseDiv')[0];

  t.equal(
    baseDiv.props.style.height,
    defaultProps.thumbSize,
    'base div is thumb default size'
  );

  t.equal(
    rangeInput.props.min,
    defaultProps.min,
    'default min value is set on range input'
  );
  t.equal(
    rangeInput.props.max,
    defaultProps.max,
    'default max value is set on range input'
  );

  t.equal(
    trackDiv.props.style.background,
    toRgbaString(defaultProps.trackColor),
    'default track color is set on track div'
  );
  t.equal(
    trackDiv.props.style.borderRadius,
    defaultProps.height,
    'track div corner radius equals height prop'
  );
  t.equal(
    trackDiv.props.style.top,
    trackPosition(defaultProps).top,
    'track div has correct top margin'
  );
  t.equal(
    trackDiv.props.style.height,
    trackPosition(defaultProps).height,
    'track div has correct height'
  );

  t.equal(
    fillDiv.props.style.background,
    toRgbaString(defaultProps.fillColor),
    'default fill color is set on fill div'
  );
  t.equal(
    fillDiv.props.style.borderRadius,
    defaultProps.height,
    'fill div corner radius equals height prop'
  );
  t.equal(
    fillDiv.props.style.width,
    `calc(100% * ${percentProgress} + ${(1 - percentProgress) *
      defaultProps.thumbSize}px)`,
    'width is 0'
  );

  t.equal(
    thumb.props.style.background,
    toRgbaString(defaultProps.thumbColor),
    'default thumb color is set on thumb div'
  );

  t.end();
});

test('Testing when height > thumbsize', t => {
  const bigVal = 43;
  const smallVal = 13;
  const component = createComponent.shallow(
    <Range height={bigVal} thumbSize={smallVal} />
  );
  const baseDiv = component.findByQuery('#rrp-baseDiv')[0];
  t.equal(
    baseDiv.props.style.height,
    bigVal,
    'when height > thumbsize, base div is set to height prop'
  );
  t.end();
});

test('Testing when height < thumbsize', t => {
  const bigVal = 43;
  const smallVal = 13;
  const component = createComponent.shallow(
    <Range height={smallVal} thumbSize={bigVal} />
  );
  const baseDiv = component.findByQuery('#rrp-baseDiv')[0];
  t.equal(
    baseDiv.props.style.height,
    bigVal,
    'when height < thumbsize, base div is set to thumbSize prop'
  );
  t.end();
});

test('Testing when hideThumb = true', t => {
  const component = createComponent.shallow(<Range hideThumb />);
  const thumb = component.findByQuery('#rrp-thumb')[0];
  t.equal(thumb, undefined, 'thumb is not displayed');
  t.end();
});

test('Testing when setting props', t => {
  let handlerWasFired = false;
  const handler = e => {
    handlerWasFired = e;
  };

  const color0 = {
    r: 10,
    g: 10,
    b: 10,
    a: 0.8
  };

  const color1 = {
    r: 45,
    g: 45,
    b: 45,
    a: 1
  };

  const color2 = {
    r: 76,
    g: 76,
    b: 76,
    a: 0.87
  };

  const component = createComponent.shallow(
    <Range
      thumbSize={98}
      thumbColor={color2}
      fillColor={color0}
      trackColor={color1}
      onChange={handler}
    />
  );

  const fillDiv = component.findByQuery('#rrp-fill')[0];
  t.equal(
    fillDiv.props.style.background,
    toRgbaString(color0),
    'fill div is colored as fillColor'
  );

  const trackDiv = component.findByQuery('#rrp-track')[0];
  t.equal(
    trackDiv.props.style.background,
    toRgbaString(color1),
    'track div is colored as trackColor'
  );

  const thumb = component.findByQuery('#rrp-thumb')[0];
  t.equal(
    thumb.props.style.background,
    toRgbaString(color2),
    'thumb is colored as thumbColor'
  );
  t.equal(thumb.props.style.height, 98, 'thumb height = thumbSize');
  t.equal(thumb.props.style.width, 98, 'thumb width = thumbSize');

  // nativEvent throws - needs fix
  const rangeInput = component.findByQuery('input')[0];
  rangeInput.onChange(99);
  t.equal(handlerWasFired, 99, 'handler is fired when range value is changed');

  t.end();
});

test('Testing with readOnly = true', t => {
  let handlerWasFired = false;
  const handler = e => {
    handlerWasFired = e;
  };

  const component = createComponent.shallow(
    <Range value={12} onChange={handler} readOnly />
  );

  // nativEvent throws - needs fix
  const rangeInput = component.findByQuery('input')[0];
  rangeInput.onChange(99);
  t.equal(
    handlerWasFired,
    false,
    'handler is NOT fired when range value is changed'
  );

  t.end();
});
