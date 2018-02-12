import React from 'react';
import ReactDOM from 'react-dom';
import App from '../..';

import map from './map.json';
import features from './features.json';

window.addEventListener('load', () => {
  const container = document.querySelector('[data-wp-maps]');

  if (!container) {
    return;
  }

  ReactDOM.render(
    <App
      featuresEndpoint="http://reunion:8888/wp-json/wp/v2/map-feature/?maps=220"
      mapEndpoint="http://reunion:8888/wp-json/wp/v2/maps/220"
    />,
    container
  );
});
