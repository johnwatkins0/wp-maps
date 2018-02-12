import color from 'css-color-function';

export const DEFAULT_MAP_POSITION = {
  center: [44.564211, -69.662536],
  zoom: 16,
};

export const STYLE_VARIABLES = {
  primary: '#214280',
  primaryHighlight: color.convert('color(#214280 shade(10%))'),
  primaryLight: color.convert('color(#214280 tint(10%))'),
};
