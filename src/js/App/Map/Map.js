import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { STYLE_VARIABLES } from '../../constants';

const StyledMapContainer = styled.div`
  height: 100%;
  width: 100%;
  min-height: 400px;
  min-height: 80vh;

  .tooltip {
    background: ${STYLE_VARIABLES.primary};
    border: ${STYLE_VARIABLES.primary};
    color: white;
    font-size: 112%;
    font-weight: 600;
    border-radius: 2px;

    &::before {
      display: none;
    }
  }
`;

class Map extends React.Component {
  features = [];

  static propTypes = {
    features: PropTypes.arrayOf(PropTypes.object).isRequired,
    map: PropTypes.objectOf(PropTypes.any).isRequired,
    activeFeature: PropTypes.number.isRequired,
    setActiveFeature: PropTypes.func.isRequired,
    showTooltips: PropTypes.bool.isRequired,
  };

  static getGoogleLink = ({ lat, lng }) =>
    `<a target="_blank" href="//www.google.com/maps/place/${lat},${lng}">Get Directions</a>`;

  componentDidMount() {
    if (Object.keys(this.props.map).length) {
      this.createMap();
      this.initFeatures();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      Object.keys(prevProps.map).length === 0 &&
      Object.keys(this.props.map).length > 0
    ) {
      this.createMap();
    }

    if (prevProps.features.length === 0 && this.props.features.length > 0) {
      this.initFeatures();
    }

    if (prevProps.activeFeature !== this.props.activeFeature) {
      this.features.forEach(feature => {
        if (feature.featurePost.id === this.props.activeFeature) {
          feature.feature.openPopup();
        } else {
          feature.feature.closePopup();
        }
      });
    }

    if (prevProps.showTooltips !== this.props.showTooltips) {
      this.redrawMap();
    }
  }

  redrawMap() {
    this.map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        return;
      }

      this.map.removeLayer(layer);
    });

    this.features = [];

    this.initFeatures();
  }

  createMap({ map } = this.props) {
    const { center, zoom } = JSON.parse(map.colbycomms__maps__map_data);
    this.map = L.map(this.mapContainer, {
      center: [center.lat, center.lng],
      zoom,
    });

    L.tileLayer(
      'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      {}
    ).addTo(this.map);
  }

  addTooltip({ feature, featurePost }) {
    feature.bindTooltip(featurePost.title.rendered, {
      direction: 'bottom',
      className: 'tooltip',
      permanent: true,
    });
  }

  addTooltips() {
    this.features.forEach(this.addTooltip);
  }

  renderFeature({ feature, data, featurePost }) {
    const { content, id, title } = featurePost;

    this.features.push({ feature, data, featurePost });

    feature.addTo(this.map);
    const popup = new L.popup().setContent(
      `<h2>${
        title.rendered
      }</h2>${content.rendered.trim()}<p>${Map.getGoogleLink(data.center)}</p>`
    );

    feature.bindPopup(popup);

    if (this.props.activeFeature === id) {
      feature.openPopup();
    }

    feature.on('popupclose', () => {
      this.props.setActiveFeature(0);
    });

    feature.on('popupopen', () => {
      this.props.setActiveFeature(id);
    });

    if (this.props.showTooltips) {
      this.addTooltip({ feature, featurePost });
    }
  }

  initFeature(featurePost) {
    const data = JSON.parse(featurePost.colbycomms__maps__map_data);
    switch (data.type) {
      case 'marker': {
        this.renderFeature({
          featurePost,
          data,
          feature: new L.Marker([data.latlng.lat, data.latlng.lng]),
        });
        return;
      }
      case 'circle': {
        this.renderFeature({
          featurePost,
          data,
          feature: new L.Circle([data.latlng.lat, data.latlng.lng], {
            radius: data.radius,
          }),
        });
        return;
      }
      case 'circlemarker': {
        this.renderFeature({
          featurePost,
          data,
          feature: new L.CircleMarker([data.latlng.lat, data.latlng.lng]),
        });
        return;
      }
      case 'polygon': {
        this.renderFeature({
          featurePost,
          data,
          feature: new L.Polygon(data.latlngs),
        });
        return;
      }
      case 'rectangle': {
        this.renderFeature({
          featurePost,
          data,
          feature: new L.Rectangle(data.latlngs),
        });
        return;
      }
      case 'polyline': {
        this.renderFeature({
          featurePost,
          data,
          feature: new L.Polyline(data.latlngs),
        });
        return;
      }
    }
  }

  initFeatures() {
    this.props.features.forEach(this.initFeature);
  }

  render = () => (
    <StyledMapContainer
      innerRef={container => {
        this.mapContainer = container;
      }}
    />
  );

  initFeature = this.initFeature.bind(this);
  addTooltip = this.addTooltip.bind(this);
}

export default Map;
