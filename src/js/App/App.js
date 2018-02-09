import React from 'react';
import PropTypes from 'prop-types';

import { Key } from './Key/Key';
import { OptionsPane } from './OptionsPane/OptionsPane';
import Map from './Map/Map';

class App extends React.Component {
  static propTypes = {
    features: PropTypes.arrayOf(PropTypes.object),
    featuresEndpoint: PropTypes.string,
  };

  static defaultProps = {
    features: [],
    featuresEndpoint: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      features: props.features,
    };
  }

  componentDidMount() {
    if (this.state.features.length === 0 && this.featuresEndpoint) {
      this.fetchFeatures();
    }
  }

  async fetchFeatures() {
    const response = await fetch(this.featuresEndpoint);
    const features = await response.json();
    this.setState({ features });
  }

  render = (props = {}, { features } = this.state) => (
    <div>
      <div>
        <OptionsPane features={features} />
        <Key features={features} />
      </div>
      <div>
        <Map features={features} />
      </div>
    </div>
  );
}

export default App;
