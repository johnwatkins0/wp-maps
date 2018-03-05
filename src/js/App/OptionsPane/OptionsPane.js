import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Feature } from './Feature';

const StyledListContainer = styled.div`
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;

  @media screen and (min-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const OptionsPane = ({
  setActiveFeature,
  features,
  activeFeature,
  setShowTooltips,
  showTooltips,
  featureTypes,
}) => (
  <div>
    <StyledListContainer>
      {featureTypes.map(featureType => (
        <div key={featureType.id}>
          <h2>{featureType.name}</h2>
          <div>
            {features
              .filter(feature =>
                feature['feature-type'].includes(featureType.id)
              )
              .map(feature => (
                <Feature
                  {...feature}
                  onClick={setActiveFeature}
                  key={feature.id}
                  active={feature.id === activeFeature}
                />
              ))}
          </div>
        </div>
      ))}
    </StyledListContainer>
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
