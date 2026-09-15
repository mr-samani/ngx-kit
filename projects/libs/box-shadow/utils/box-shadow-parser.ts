import { extractCssColors } from 'ngx-kit/core';
import  { BoxShadow } from '../contracts/BoxShadowValue';

export function parseBoxShadow(cssValue: string): BoxShadow[] {
  if (!cssValue || typeof cssValue !== 'string') {
    return [];
  }
  // Split multiple shadows by comma
  const shadows = cssValue
    .split(/,(?![^\(]*\))/)
    .map((shadow) => shadow.trim())
    .filter((shadow) => shadow);

  const boxShadows: BoxShadow[] = [];
  const unitRegex = /(px|rem|em)/;
  const numberRegex = /-?\d*\.?\d*(?:px|rem|em)?/g;

  for (const shadow of shadows) {
    const boxShadow: BoxShadow = {
      xOffset: 0,
      yOffset: 0,
      color: 'rgba(0, 0, 0, 0)', // Default color
      unit: 'px', // Default unit
      cssValue: '',
    };

    // Check for inset
    boxShadow.inset = shadow.includes('inset');

    // Extract color
    const colorMatch = extractCssColors(shadow);
    if (colorMatch) {
      boxShadow.color = colorMatch[0];
    }

    // Remove inset and color to parse numbers
    let numberString = shadow.replace('inset', '').replace(boxShadow.color, '').trim();

    // Extract numbers
    const numbers = (numberString.match(numberRegex) ?? [])
      .map((shadow) => shadow.trim())
      .filter((shadow) => shadow);
    if (!numbers) continue;

    // Parse numbers
    for (let i = 0; i < numbers.length; i++) {
      const num = parseFloat(numbers[i]);
      const unit = numbers[i].match(unitRegex)?.[0] || 'px';
      boxShadow.unit = unit; // Update unit based on first detected unit

      if (i === 0) {
        boxShadow.xOffset = isNaN(num) ? 0 : num;
      } else if (i === 1) {
        boxShadow.yOffset = isNaN(num) ? 0 : num;
      } else if (i === 2) {
        boxShadow.blurRadius = isNaN(num) ? 0 : Math.max(0, num); // Blur can't be negative
      } else if (i === 3) {
        boxShadow.spreadRadius = isNaN(num) ? 0 : num;
      }
    }
    boxShadow.cssValue = shadow;
    boxShadows.push(boxShadow);
  }

  return boxShadows;
}

// Utility to validate and format color
export function validateColor(color: string): string {
  const hexRegex = /^#[0-9a-fA-F]{3,8}$/;
  const rgbRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\)$/;
  const hslRegex = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/;
  const namedColors = [
    'black',
    'white',
    'red',
    'blue',
    'green',
    'yellow',
    'purple',
    'orange',
    // Add more named colors as needed
  ];

  color = color.trim();
  if (hexRegex.test(color) || rgbRegex.test(color) || hslRegex.test(color)) {
    return color;
  }
  if (namedColors.includes(color.toLowerCase())) {
    return color.toLowerCase();
  }
  return 'rgba(0, 0, 0, 0)'; // Fallback to transparent
}

// Utility to format BoxShadow back to CSS string
export function formatBoxShadowToCSS(shadows: BoxShadow[]): string {
  return shadows
    .map((shadow) => {
      const parts: string[] = [];
      if (shadow.inset) {
        parts.push('inset');
      }
      parts.push(`${shadow.xOffset}${shadow.unit}`, `${shadow.yOffset}${shadow.unit}`);
      if (shadow.blurRadius !== undefined) {
        parts.push(`${shadow.blurRadius}${shadow.unit}`);
      }
      if (shadow.spreadRadius !== undefined) {
        parts.push(`${shadow.spreadRadius}${shadow.unit}`);
      }
      parts.push(shadow.color);
      return parts.join(' ');
    })
    .join(', ');
}

// Example usage:
/*
const css = "10px 20px 5px 0px rgba(0, 0, 0, 0.5), inset -10px -20px 10px #ff0000";
const parsed = parseBoxShadow(css);
console.log(parsed);
// Output: [
//   { xOffset: 10, yOffset: 20, blurRadius: 5, spreadRadius: 0, color: "rgba(0, 0, 0, 0.5)", unit: "px" },
//   { inset: true, xOffset: -10, yOffset: -20, blurRadius: 10, color: "#ff0000", unit: "px" }
// ]
const cssString = formatBoxShadowToCSS(parsed);
console.log(cssString);
// Output: "10px 20px 5px 0px rgba(0, 0, 0, 0.5), inset -10px -20px 10px #ff0000"
*/
