import React from 'react';
import ReactDOM from 'react-dom';
import App from '../..';

window.addEventListener('load', () => {
  const container = document.querySelector('[data-wp-maps]');

  if (!container) {
    return;
  }

  ReactDOM.render(<App />, container);
});
