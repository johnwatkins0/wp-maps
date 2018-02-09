import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledMapContainer = styled.div`
  height: 100%;
  width: 100%;
  min-height: 400px;
`;

class Map extends React.Component {
  static propTypes = {
    features: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  componentDidMount() {
    this.createMap();
  }

  createMap() {
    this.map = new google.maps.Map(this.mapContainer, {
      zoom: 16,
      center: { lat: 44.563869, lng: -69.662636 },
      scrollWheel: false,
    });
  }

  render = () => (
    <StyledMapContainer
      innerRef={container => {
        this.mapContainer = container;
      }}
    />
  );
}

export default Map;
