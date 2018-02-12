import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Feature } from './Feature';

const StyledFeatureList = styled.div``;

export const OptionsPane = ({
  setActiveFeature,
  features,
  activeFeature,
  setShowTooltips,
  showTooltips,
}) => (
  <div>
    <StyledFeatureList>
      {features.map(feature => (
        <Feature
          {...feature}
          onClick={setActiveFeature}
          key={feature.id}
          active={feature.id === activeFeature}
        />
      ))}
    </StyledFeatureList>
    <label>
      <input
        type="checkbox"
        checked={showTooltips}
        onChange={event => {
          setShowTooltips(event.target.checked);
        }}
      />{' '}
      Show feature names
    </label>
  </div>
);

OptionsPane.propTypes = {
  setActiveFeature: PropTypes.func.isRequired,
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeFeature: PropTypes.number.isRequired,
  showTooltips: PropTypes.bool.isRequired,
  setShowTooltips: PropTypes.func.isRequired,
};
