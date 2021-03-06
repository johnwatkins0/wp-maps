/**
 * The external dependencies.
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { DEFAULT_MAP_POSITION } from '../../constants';

const StyledMapContainer = styled.div`
  height: 100%;
  min-height: 400px;
  width: 100%;
`;

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      position: null,
      activeMapTermInput: null,
      activeFeatureType: null,
      hasFeature: false,
    };
  }

  /**
   * Lifecycle hook.
   *
   * @return {void}
   */
  async componentDidMount() {
    await this.initMapTermInputs();
    this.initMapTermInputListeners();
    await this.initFeatureTypeInputs();
    this.initFeatureTypeInputListeners();
    this.initMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeFeatureType !== prevState.activeFeatureType) {
      this.drawControlFull.initialize({
        draw: this.getDrawOptions(),
      });
      if (this.state.hasFeature) {
        this.switchToEditControl();
      } else {
        this.switchToFullControl();
      }
    }

    if (this.state.hasFeature && !prevState.hasFeature) {
      this.deactivateInactiveTypeInputs();
    } else if (prevState.hasFeature && !this.state.hasFeature) {
      this.activateTypeInputs();
    }
  }

  initMapTermInputs = () =>
    new Promise(resolve => {
      this.radioInputs = document.querySelectorAll('[data-term-radio]');

      let checkedInputFound = false;
      [...this.radioInputs].forEach(input => {
        if (checkedInputFound) {
          return;
        }

        if (input.getAttribute('checked') === 'checked') {
          checkedInputFound = true;
          this.setState({ activeMapTermInput: input }, resolve);
        }
      });

      if (!checkedInputFound) {
        resolve();
      }
    });

  initMapTermInputListeners() {
    [...this.radioInputs].forEach(input => {
      input.addEventListener('change', () => {
        this.setState({ activeMapTermInput: input }, this.setMapPosition);
      });
    });
  }

  initFeatureTypeInputs = () =>
    new Promise(resolve => {
      this.featureTypeInputs = document.querySelectorAll(
        '[data-feature-type-select]'
      );

      let checkedInputFound = false;
      [...this.featureTypeInputs].forEach(input => {
        if (checkedInputFound) {
          return;
        }

        if (input.getAttribute('checked') === 'checked') {
          checkedInputFound = true;
          this.setState(
            { activeFeatureType: input.getAttribute('feature-type-value') },
            resolve
          );
        }
      });

      if (!checkedInputFound) {
        resolve();
      }
    });

  initFeatureTypeInputListeners() {
    [...this.featureTypeInputs].forEach(input => {
      input.addEventListener('change', event => {
        this.setState({
          activeFeatureType: input.getAttribute('data-feature-type-value'),
        });
      });
    });
  }

  deactivateInactiveTypeInputs() {
    [...this.featureTypeInputs].forEach(input => {
      if (
        input.getAttribute('data-feature-type-value') !==
        this.state.activeFeatureType
      ) {
        input.setAttribute('disabled', true);
      }
    });
  }

  activateTypeInputs() {
    [...this.featureTypeInputs].forEach(input => {
      if (input.hasAttribute('disabled')) {
        input.removeAttribute('disabled');
      }
    });
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

  getDrawOptions = () =>
    [
      'marker',
      'circlemarker',
      'circle',
      'polygon',
      'rectangle',
      'polyline',
    ].reduce(
      (options, feature) =>
        Object.assign({}, options, {
          [feature]: this.state.activeFeatureType === feature,
        }),
      {}
    );

  /**
   * Starts the drawing controller.
   *
   * @return {void}
   */
  initDrawControl() {
    // The editor showing when no items have been drawn.
    this.drawControlFull = new L.Control.Draw({
      draw: this.getDrawOptions(),
    });

    // The editor showing when an item has been drawn.
    this.drawControlEdit = new L.Control.Draw({
      edit: {
        featureGroup: this.drawnItems,
      },
      draw: false,
    });

    this.map.addControl(this.drawControlFull);
  }

  saveData(layer) {
    if (layer instanceof L.Marker) {
      this.props.onChange({
        type: 'marker',
        latlng: layer.getLatLng(),
        center: layer.getLatLng(),
      });
      return;
    }

    if (layer instanceof L.Circle) {
      this.props.onChange({
        type: 'circle',
        latlng: layer.getLatLng(),
        radius: layer.getRadius(),
        center: layer.getLatLng(),
      });
      return;
    }

    if (layer instanceof L.CircleMarker) {
      this.props.onChange({
        type: 'circlemarker',
        latlng: layer.getLatLng(),
        center: layer.getLatLng(),
      });
      return;
    }

    if (layer instanceof L.Polygon) {
      this.props.onChange({
        type: 'polygon',
        latlngs: layer.getLatLngs(),
        center: layer.getCenter(),
      });
      return;
    }

    if (layer instanceof L.Rectangle) {
      this.props.onChange({
        type: 'rectangle',
        latlngs: layer.getLatLngs(),
        center: layer.getCenter(),
      });
      return;
    }

    if (layer instanceof L.Polyline) {
      this.props.onChange({
        type: 'polyline',
        latlngs: layer.getLatLngs(),
        center: getCenter(),
      });
      return;
    }
  }

  switchToEditControl() {
    this.map.removeControl(this.drawControlFull);
    this.map.addControl(this.drawControlEdit);
  }

  switchToFullControl() {
    this.map.removeControl(this.drawControlEdit);
    this.map.addControl(this.drawControlFull);
  }

  /**
   * Handles events when items are created or deleted.
   *
   * @return {void}
   */
  initDrawEventListeners() {
    this.map.on(L.Draw.Event.CREATED, event => {
      const layer = event.layer;
      this.drawnItems.addLayer(layer);
      this.saveData(layer);
      this.switchToEditControl();
      this.setState({ hasFeature: true });
    });

    this.map.on(L.Draw.Event.EDITED, event => {
      const layers = event.layers;
      layers.eachLayer(layer => {
        this.saveData(layer);
      });
    });

    this.map.on(L.Draw.Event.DELETED, () => {
      this.switchToFullControl();
      this.setState({ hasFeature: false });
    });
  }

  initFeature({ value } = this.props.field) {
    if (!value) {
      return;
    }

    this.switchToEditControl();

    switch (value.type) {
      case 'marker': {
        this.drawnItems.addLayer(
          new L.Marker([value.latlng.lat, value.latlng.lng])
        );
        return;
      }
      case 'circle': {
        this.drawnItems.addLayer(
          new L.Circle([value.latlng.lat, value.latlng.lng], {
            radius: value.radius,
          })
        );
        return;
      }
      case 'circlemarker': {
        this.drawnItems.addLayer(
          new L.CircleMarker([value.latlng.lat, value.latlng.lng])
        );
        return;
      }
      case 'polygon': {
        this.drawnItems.addLayer(new L.Polygon(value.latlngs));
        return;
      }
      case 'rectangle': {
        this.drawnItems.addLayer(new L.Rectangle(value.latlngs));
        return;
      }
      case 'polyline': {
        this.drawnItems.addLayer(new L.Polyline(value.latlngs));
        return;
      }
    }
  }

  setMapPosition = () =>
    new Promise(resolve => {
      const position = this.state.activeMapTermInput
        ? JSON.parse(
          this.state.activeMapTermInput.getAttribute('data-position')
        )
        : Object.assign({}, DEFAULT_MAP_POSITION);

      this.setState({ position: [position.center, position.zoom] }, () => {
        this.map.setView(...this.state.position);
        resolve();
      });
    });

  /**
   * Initialize the map into placeholder element.
   *
   * @return {void}
   */
  async initMap() {
    this.map = L.map(this.node);
    L.tileLayer(
      'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      {}
    ).addTo(this.map);

    await this.setMapPosition();
    this.drawnItems = new L.FeatureGroup().addTo(this.map);

    this.initDrawControl();
    this.initFeature();

    this.forceRerender();
    this.initDrawEventListeners();
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
      {...this.state}
    />
  );
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
