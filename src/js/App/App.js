import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Key } from './Key/Key';
import { OptionsPane } from './OptionsPane/OptionsPane';
import Map from './Map/Map';

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
`;

const StyledMapContainer = styled.div`
  width: 100%;
`;

const StyledSidebarContainer = styled.div`
  width: 100%;
`;

class App extends React.Component {
  static propTypes = {
    features: PropTypes.arrayOf(PropTypes.object),
    featuresEndpoint: PropTypes.string,
    map: PropTypes.objectOf(PropTypes.any),
    mapEndpoint: PropTypes.string,
    featureTypes: PropTypes.arrayOf(PropTypes.object),
    featureTypeEndpoint: PropTypes.string,
  };

  static defaultProps = {
    features: [],
    featuresEndpoint: null,
    map: {},
    mapEndpoint: null,
    featureTypes: [],
    featureTypeEndpoint: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      features: props.features,
      map: props.map,
      activeFeature: 0,
      showTooltips: false,
      featureTypes: props.featureTypes,
    };
  }

  async componentDidMount() {
    if (Object.keys(this.state.map).length === 0) {
      await this.fetchMap();
    }

    if (this.state.features.length === 0) {
      await this.fetchFeatures();
    }

    if (this.state.featureTypes.length === 0) {
      this.fetchFeatureTypes();
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

  fetchFeatureTypes = () =>
    new Promise(async resolve => {
      const response = await fetch(
        `${this.props.featureTypeEndpoint}?include=${this.getFeatureTypeIds()}`
      );
      const featureTypes = await response.json();
      console.log(featureTypes);
      this.setState({ featureTypes }, resolve);
    });

  getFeatureTypeIds = ({ features } = this.state) =>
    features.reduce(
      (ids, feature) =>
        ids.concat(
          feature['feature-type'].filter(id => ids.indexOf(id) === -1)
        ),
      []
    );

  render = (
    { features, map, activeFeature, showTooltips, featureTypes } = this.state
  ) => (
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
          featureTypes={featureTypes}
          setActiveFeature={this.setActiveFeature}
          activeFeature={activeFeature}
          showTooltips={showTooltips}
          setShowTooltips={this.setShowTooltips}
        />
        <Key features={features} featureTypes={featureTypes} />
      </StyledSidebarContainer>
    </StyledContainer>
  );

  setActiveFeature = this.setActiveFeature.bind(this);
}

export default App;
