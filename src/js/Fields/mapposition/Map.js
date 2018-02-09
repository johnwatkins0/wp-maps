/**
 * The external dependencies.
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { DEFAULT_MAP_POSITION } from '../constants';

const StyledMapContainer = styled.div`
  height: 100%;
  min-height: 400px;
  width: 100%;
`;

class Map extends React.Component {
  /**
   * Lifecycle hook.
   *
   * @return {void}
   */
  componentDidMount() {
    this.initMap();
  }

  /**
   * Lifecycle hook.
   *
   * @return {Boolean}
   */
  shouldComponentUpdate() {
    // The component is a wrapper around Google Maps instance
    // and we don't need to re-render it, because the map is updated
    // manually.
    return false;
  }

  /**
   * Workaround for tiles not loading properly in the WP admin.
   *
   * @return {void}
   */
  forceRerender() {
    setTimeout(() => {
      this.map.invalidateSize();
    }, 500);
  }

  saveData() {
    this.props.onChange({
      zoom: this.map.getZoom(),
      center: this.map.getCenter(),
    });
  }

  getViewProps() {
    try {
      if (this.props.field.value.center && this.props.field.value.zoom) {
        return [this.props.field.value.center, this.props.field.value.zoom];
      } else {
        return [DEFAULT_MAP_POSITION.center, DEFAULT_MAP_POSITION.zoom];
      }
    } catch (e) {
      return [DEFAULT_MAP_POSITION.center, DEFAULT_MAP_POSITION.zoom];
    }
  }

  /**
   * Initialize the map into placeholder element.
   *
   * @return {void}
   */
  initMap() {
    this.map = L.map(this.node).setView(...this.getViewProps());
    L.tileLayer(
      'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      {}
    ).addTo(this.map);

    this.forceRerender();

    this.map.on('zoomend', this.saveData);
    this.map.on('moveend', this.saveData);
  }

  /**
   * Render the placeholder for the map.
   *
   * @return {React.Element}
   */
  render = () => (
    <StyledMapContainer
      innerRef={container => {
        this.node = container;
      }}
    />
  );

  saveData = this.saveData.bind(this);
}

/**
 * Validate the props.
 *
 * @type {Object}
 */
Map.propTypes = {
  field: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func,
};

export default Map;
