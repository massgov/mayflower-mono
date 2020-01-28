import React, { Fragment, useRef, useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import SidebarHeading from '../../atoms/headings/SidebarHeading';
import Icon from '../../atoms/icons/Icon';
import { themeColors, grayScaleColors, utilityColors, primaryColors, primaryAltColors, highLightColors } from './colors.json';
import ColorGradientsDocs from './ColorGradients.md';

import './styles.css';

const Color = ({ color, value, name }) => (
  <li style={{ width: 300, margin: 10, padding: 10 }}>
    <h3 className="ma__sidebar-heading">{color}</h3>
    <div className="sg-swatch" style={{ background: value, borderRadius: 0 }} />
    <div className="sg-info">
      <span>{value.toUpperCase()}</span>
      <br />
      <code style={{ fontSize: '1rem' }}>{name}</code>
    </div>
  </li>
);

const GradientTile = (props) => {
  const colorRef = useRef(null);
  const [rgb, setRgb] = useState('');
  useEffect(() => {
    const computedStyles = window.getComputedStyle(colorRef.current).getPropertyValue('background-color');
    setRgb(() => computedStyles);
  });
  // Convert decimal to hexadecimal
  const hex = (x) => `0${Number(x).toString(16)}`.slice(-2);
  const rgbToHex = (rgbVal) => {
    const rgbValues = rgbVal && rgbVal.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    const hexValue = rgbValues && `#${hex(rgbValues[1])}${hex(rgbValues[2])}${hex(rgbValues[3])}`;
    return hexValue;
  };
  const { index, effect } = props;
  const firstTile = index === 0;
  const color = firstTile ? props.color : `${index * 10} % ${effect}`;
  const name = firstTile ? `$${props.name}` : '';
  const hexValue = rgbToHex(rgb).toUpperCase();
  return(
    <li className={`${props.name}--${effect}`}>
      <h3 className="ma__sidebar-heading">{color}</h3>
      <div className="sg-swatch" ref={colorRef} />
      <div className="sg-info">
        <span>{hexValue}</span>
        { navigator && navigator.clipboard && (
          <button onClick={() => {
            navigator.clipboard.writeText(hexValue);
          }}>
          <Icon name="copy" svgWidth={16} svgHeight={16} />
        </button>
        )}
        <br />
        <code style={{ fontSize: '1rem' }}>{name}</code>
      </div>
    </li>
  );
};

const GradientSpectrum = ({ name, color, effect }) => {
  const tiles = effect === 'tint' ? 10 : 6;
  let i;
  const tilesArray = [];
  for (i = 0; i < tiles; i += 1) {
    tilesArray.push(i);
  }
  return(
    <ul className="sg-colors sg-colors--gradient">
      {
        tilesArray.map((index) => <GradientTile color={color} name={name} index={index} effect={effect} />)
      }
    </ul>
  );
};

storiesOf('base/colors', module)
  .addDecorator(withKnobs({ escapeHTML: false }))
  .add('Colors', (() => (
    <Fragment>
      <SidebarHeading title="Mayflower Brand Colors" level={2} />
      <ul className="sg-colors">
        {
          themeColors.map((color) => <Color {...color} />)
        }
      </ul>
      <SidebarHeading title="Gray Scale Colors" level={2} />
      <ul className="sg-colors">
        {
          grayScaleColors.map((color) => <Color {...color} />)
        }
      </ul>
      <SidebarHeading title="Utility Colors" level={2} />
      <ul className="sg-colors">
        {
          utilityColors.map((color) => <Color {...color} />)
        }
      </ul>
      <SidebarHeading title="Theme Color Usage" level={2} />
      <ul className="sg-colors">
        {
          primaryColors.map((color) => <Color {...color} />)
        }
      </ul>
      <ul className="sg-colors">
        {
          primaryAltColors.map((color) => <Color {...color} />)
        }
      </ul>
      <ul className="sg-colors">
        {
          highLightColors.map((color) => <Color {...color} />)
        }
      </ul>
    </Fragment>
  )))
  .add(
    'Gradients (Light)', (() => (
      <Fragment>
        {
          themeColors.map(({ name, color }) => {
            const props = {
              name: name.match(/\$(.*)/)[1],
              color,
              effect: 'tint'
            };
            return(<GradientSpectrum {...props} />);
          })
        }
      </Fragment>
    )),
    { info: ColorGradientsDocs }
  )
  .add(
    'Gradients (Dark)', (() => (
      <Fragment>
        {
          themeColors.map(({ name, color }) => {
            const props = {
              name: name.match(/\$(.*)/)[1],
              color,
              effect: 'shade'
            };
            return(<GradientSpectrum {...props} />);
          })
        }
      </Fragment>
    )),
    { info: ColorGradientsDocs }
  );
