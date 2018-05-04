import React from 'react';
import {compose, withHandlers, withProps} from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';

const Map = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyB-wDNI3bGVreubWNQkWvjHlL15a7Bcx48&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{height: `100%`}} />,
    containerElement: <div style={{height: `400px`}} />,
    mapElement: <div style={{height: `100%`}} />,
  }),
  withHandlers(() => {
    const refs = {
      map: undefined,
    };

    return {
      onMapMounted: () => ref => {
        console.log('had ref now');
        refs.map = ref;
      },
      onZoomChanged: ({onZoomChange}) => () => {
        console.log('zoomChanged', refs.map.getZoom());
      },
      onBoundsChanged: obj => () => {
        console.log('boundsChanged', obj);
      },
    };
  }),
  withScriptjs,
  withGoogleMap
)((props, context) => (
  <GoogleMap
    defaultZoom={5}
    defaultCenter={{lat: 41.850033, lng: -87.6500523}}
    ref={props.onMapMounted}
    onBoundsChanged={props.onBoundsChanged}
  >
    {props.isMarkerShown && (
      <Marker
        position={{lat: 41.850033, lng: -87.6500523}}
        onClick={props.onMarkerClick}
      />
    )}
  </GoogleMap>
));

class MyFancyComponent extends React.PureComponent {
  state = {
    isMarkerShown: false,
  };

  componentDidMount() {
    this.delayedShowMarker();
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({isMarkerShown: true});
    }, 3000);
  };

  handleMarkerClick = () => {
    this.setState({isMarkerShown: false});
    this.delayedShowMarker();
  };

  handleBounds = e => {
    console.log(e);
  };

  render() {
    return (
      <Map
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
        onCenterChanged={() => this.handleBounds()}
        getBounds={this.handleBounds}
      />
    );
  }
}

export default MyFancyComponent;
