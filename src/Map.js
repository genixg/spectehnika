import React, { Component } from 'react';
import L from 'leaflet';
// postCSS import of Leaflet's CSS
import 'leaflet/dist/leaflet.css';
// using webpack json loader we can import our geojson file like this
//import geojson from 'json!./bk_subway_entrances.geojson';
// import local components Filter and ForkMe
import Filter from './Filter';
import { connect } from 'react-redux';
import Header from './Header';

/*
const applyFilter = (features, key, value) => {
  return features.filter(f => f.properties[key] === value);
}

const getVisibleFeatures = (features, filter) => {
  debugger;
  if(!filter)
    filter = [];
  var filteredFeatures = features;
  for(var key in filter) {
    if(filter[key] !== "*")
      filteredFeatures = applyFilter(filteredFeatures, key, filter[key]);
  }
  return filteredFeatures;
}
*/

let config = {};
config.params = {
  center: [51.5384, 46.0375],
  zoomControl: false,
  zoom: 13,
  maxZoom: 18,
  minZoom: 4,
  scrollwheel: false,
  legends: true,
  infoControl: true,
  attributionControl: true
};
config.tileLayer = {
  uri: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}',
  params: {
    minZoom: 4,
    attribution: '',
    id: '',
    accessToken: '',
    foo:'bar'
  }
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      tileLayer: null,
      geojsonLayer: null,
      geojson: props.geojson,
      filter: props.filter,
      features: props.features,
    };
    this._mapNode = null;
    this.onEachFeature = this.onEachFeature.bind(this);
    this.pointToLayer = this.pointToLayer.bind(this);
    this.filterFeatures = this.filterFeatures.bind(this);
    this.filterGeoJSONLayer = this.filterGeoJSONLayer.bind(this);
  }

  componentDidMount() {
    // code to run just after the component "mounts" / DOM elements are created
    // we could make an AJAX request for the GeoJSON data here if it wasn't stored locally
    //this.getData();
    // create the Leaflet map object
    if (!this.state.map) this.init(this._mapNode);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.geojson && this.state.map && !this.state.geojsonLayer) {
      this.addGeoJSONLayer(this.state.geojson);
    }
    
    if (this.props.filter !== prevState.filter) {
      this.filterGeoJSONLayer();
    }
  }

  componentWillUnmount() {
    this.state.map.remove();
  }

  getData() {
    /*this.setState({
      numEntrances: geojson.features.length,
      geojson
    });*/
  }

  addGeoJSONLayer(geojson) {
    const geojsonLayer = L.geoJson(geojson, {
      onEachFeature: this.onEachFeature,
      pointToLayer: this.pointToLayer,
      filter: this.filterFeatures
    });
    geojsonLayer.addTo(this.state.map);
    this.setState({ geojsonLayer });
    this.zoomToFeature(geojsonLayer); 
  }

  filterGeoJSONLayer() {
    this.state.geojsonLayer.clearLayers();
    this.state.geojsonLayer.addData(this.state.geojson);
    this.zoomToFeature(this.state.geojsonLayer);
  }

  zoomToFeature(target) {
    var fitBoundsParams = {
      paddingTopLeft: [200,10],
      paddingBottomRight: [10,10]
    };
    this.state.map.fitBounds(target.getBounds(), fitBoundsParams);
  }

  filterFeatures(feature, layer) {
    for(var key in this.state.filter) {
      if(this.props.filter[key] !== "*" && feature.properties[key] !== this.props.filter[key])
        return false;
    }
    return true;
  }

  pointToLayer(feature, latlng) {
    // renders our GeoJSON points as circle markers, rather than Leaflet's default image markers
    // parameters to style the GeoJSON markers
    var markerParams = {
      radius: 10,
      fillColor: feature.properties.COLOR,
      color: '#fff',
      weight: 5,
      opacity: 0.5,
      fillOpacity: 0.8
    };

    return L.circleMarker(latlng, markerParams);
  }

  onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.NAME && feature.properties.CAPACITY) {

      // assemble the HTML for the markers' popups (Leaflet's bindPopup method doesn't accept React JSX)
      const popupContent = `<h3>${feature.properties.NAME}</h3>
        <strong>Грузоподъемность: </strong>${feature.properties.CAPACITY}
        <div class='img'><img src='/public/img/photo_tehnik/${feature.properties.IMG}' alt='${feature.properties.NAME}' width='150' /></div>
        <div class='phone'>Телефон: ${feature.properties.PHONE}</div>
        `;

      // add our popups
      layer.bindPopup(popupContent);
    }
  }

  init(id) {
    if (this.state.map) return;
    // this function creates the Leaflet map object and is called after the Map component mounts
    let map = L.map(id, config.params);
    L.control.zoom({ position: "bottomleft"}).addTo(map);

    // a TileLayer is used as the "basemap"
    const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);

    // set our state to include the tile layer
    this.setState({ map, tileLayer });
  }

  render() {
    return (
      <div id="mapUI">
          <Header />
        {
          <Filter />
        }
        <div ref={(node) => (this._mapNode = node)} id="map" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  //features: getVisibleFeatures(state.features, state.filter),
  geojson: state.geojson,
  filter: state.filter,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);

