import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Key } from './Key/Key';
import { OptionsPane } from './OptionsPane/OptionsPane';
import Map from './Map/Map';

const StyledContainer = styled.div`
  display: flex;
  height: 100%;

  @supports (display: grid) {
    display: grid;
    grid-template-columns: 3fr 1fr;
  }
`;

const StyledMapContainer = styled.div`
  flex: 5 0 auto;
`;

const StyledSidebarContainer = styled.div`
  flex: 1 1 auto;
`;

class App extends React.Component {
  static propTypes = {
    features: PropTypes.arrayOf(PropTypes.object),
    featuresEndpoint: PropTypes.string,
    map: PropTypes.objectOf(PropTypes.any),
    mapEndpoint: PropTypes.string,
  };

  static defaultProps = {
    features: [],
    featuresEndpoint: null,
    map: {},
    mapEndpoint: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      features: props.features,
      map: props.map,
      activeFeature: 0,
      showTooltips: false,
    };
  }

  async componentDidMount() {
    if (Object.keys(this.state.map).length === 0) {
      await this.fetchMap();
    }

    if (this.state.features.length === 0) {
      this.fetchFeatures();
    }
  }

  setActiveFeature = activeFeature =>
    new Promise(resolve => {
      this.setState({ activeFeature }, resolve);
    });

  setShowTooltips = showTooltips =>
    new Promise(resolve => {
      this.setState({ showTooltips }, resolve);
    });

  fetchMap = () =>
    new Promise(async resolve => {
      const response = await fetch(this.props.mapEndpoint);
      const map = await response.json();
      this.setState({ map }, resolve);
    });

  fetchFeatures = () =>
    new Promise(async resolve => {
      const response = await fetch(this.props.featuresEndpoint);
      const features = await response.json();
      this.setState({ features }, resolve);
    });

  render = ({ features, map, activeFeature, showTooltips } = this.state) => (
    <StyledContainer>
      <StyledMapContainer>
        <Map
          map={map}
          features={features}
          activeFeature={activeFeature}
          setActiveFeature={this.setActiveFeature}
          showTooltips={showTooltips}
        />
      </StyledMapContainer>
      <StyledSidebarContainer>
        <OptionsPane
          features={features}
          setActiveFeature={this.setActiveFeature}
          activeFeature={activeFeature}
          showTooltips={showTooltips}
          setShowTooltips={this.setShowTooltips}
        />
        <Key features={features} />
      </StyledSidebarContainer>
    </StyledContainer>
  );

  setActiveFeature = this.setActiveFeature.bind(this);
}

export default App;
