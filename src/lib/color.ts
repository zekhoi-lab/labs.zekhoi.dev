// Accepts #rrggbb and the #rgb shorthand, with or without the leading #
export function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{3}|[a-f\d]{6})$/i.exec(hex.trim());
  if (!result) return null;
  const digits = result[1].length === 3 ? result[1].replace(/./g, '$&$&') : result[1];
  return {
    r: parseInt(digits.slice(0, 2), 16),
    g: parseInt(digits.slice(2, 4), 16),
    b: parseInt(digits.slice(4, 6), 16)
  };
}

const clampByte = (value: number) => Math.min(255, Math.max(0, Math.round(value)));

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => clampByte(v).toString(16).padStart(2, '0')).join('');
}

export function rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb(h: number, s: number, l: number): { r: number, g: number, b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// rgb(1, 2, 3), rgba(1, 2, 3, 0.5) or rgb(1 2 3 / 50%); alpha is ignored
export function parseRgbString(str: string): { r: number, g: number, b: number } | null {
  const match = str.trim().match(/^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/i);
  if (!match) return null;
  const [r, g, b] = match.slice(1, 4).map(Number);
  if (r > 255 || g > 255 || b > 255) return null;
  return { r, g, b };
}

// hsl(210, 50%, 40%), hsla(...) or hsl(210deg 50% 40%); alpha is ignored
export function parseHslString(str: string): { h: number, s: number, l: number } | null {
  const match = str.trim().match(/^hsla?\(\s*(\d{1,3})(?:deg)?[\s,]+(\d{1,3})%?[\s,]+(\d{1,3})%?\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/i);
  if (!match) return null;
  const [h, s, l] = match.slice(1, 4).map(Number);
  if (h > 360 || s > 100 || l > 100) return null;
  return { h, s, l };
}
