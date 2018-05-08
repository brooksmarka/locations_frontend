// Reference: https://github.com/tomchentw/react-google-maps/blob/master/src/components/GoogleMap.md
import React from "react";
import { compose, withHandlers, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
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
    {props.isMarkerShown && (
      <Marker
        position={{ lat: 41.850033, lng: -87.6500523 }}
        onClick={props.onMarkerClick}
      />
    )}
  </GoogleMap>
));

class MapWrapper extends React.PureComponent {
  state = { markers: [] };

  componentDidMount() {
    //this.delayedShowMarker();
    this.fetchMarkers();
  }

  // PRIVATE

  _handleBounds = map => {
    console.log("handling bounds change: ", map.getBounds());
  };

  fetchMarkers = () => {
    const data = null;
    const request = axios
      .post("http://localhost:6001/get-markers", { test: data })
      .then(res => this.setState({ markers: res.data }));
  };

  render() {
    console.log(this.state);
    return <Map isMarkerShown handleBounds={this._handleBounds} />;
  }
}

export default MapWrapper;
