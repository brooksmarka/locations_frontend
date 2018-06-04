// Reference: https://github.com/tomchentw/react-google-maps/blob/master/src/components/GoogleMap.md
import React from "react";
import { compose, withHandlers, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import axios from "axios";

const Map = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyB-wDNI3bGVreubWNQkWvjHlL15a7Bcx48&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withHandlers(props => {
    const refs = {
      map: undefined
    };

    return {
      onMapMounted: () => ref => {
        refs.map = ref;
      },

      // MTS - Leaving this here for the time being
      // onZoomChanged: ({onZoomChange}) => () => {
      //   console.log('zoomChanged', refs.map.getZoom());
      // },
      onBoundsChanged: () => () => {
        props.handleBounds(refs.map);
      }
    };
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={5}
    defaultCenter={{ lat: 41.850033, lng: -87.6500523 }}
    ref={props.onMapMounted}
    onBoundsChanged={props.onBoundsChanged}
  >
    <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
      {props.isMarkerShown &&
        props.markers.map(obj => (
          <Marker
            key={obj._id}
            position={{
              lat: obj.geo.coordinates[1],
              lng: obj.geo.coordinates[0]
            }}
            onClick={props.onMarkerClick}
          />
        ))}
    </MarkerClusterer>
  </GoogleMap>
));

class MapWrapper extends React.PureComponent {
  state = {
    bounds: {
      northEast: null,
      southWest: null
    },
    markers: []
  };

  // PRIVATE

  _handleBounds = map => {
    let northEast = map.getBounds().getNorthEast();
    let southWest = map.getBounds().getSouthWest();
    console.log(map.getZoom());

    northEast = { lat: northEast.lat(), lng: northEast.lng() };
    southWest = { lat: southWest.lat(), lng: southWest.lng() };
    this.setState({ bounds: { northEast, southWest } }, () =>
      this._fetchMarkers()
    );
  };

  _fetchMarkers = () => {
    const { bounds } = this.state;
    console.log(bounds);
    axios
      .post("http://localhost:6001/get-markers", { bounds })
      .then(res => this.setState({ markers: res.data }))
      .catch(err => console.log("error getting marker", err));
  };

  render() {
    console.log(this.state);
    return (
      <Map
        isMarkerShown
        handleBounds={this._handleBounds}
        markers={this.state.markers}
      />
    );
  }
}

export default MapWrapper;
