import React, { Component } from 'react';
import loadGoogleMapsAPI from 'load-google-maps-api';
import * as Map from './constants';

const mapOptions = {
  center: Map.COORDINATES,
  zoom: 16,
  mapTypeControlOptions: {
      mapTypeIds: [ 'roadmap', 'satellite', 'hybrid', 'terrain', 'Retro' ]
  }
};

const markerOptions = ( googleMaps, map ) => {
  return {
    position: Map.COORDINATES,
    map: map,
    title: 'Residencia Ergos',
    animation: googleMaps.Animation.BOUNCE
  }
};

export default class GoogleMap extends Component {
  componentWillUnmount() {
    const allScripts = document.getElementsByTagName( 'script' );
    [].filter.call(
      allScripts,
      ( scpt ) => scpt.src.indexOf( 'key=AIzaSyA2VCIDASPyZRdr58uKR5ucueARsagOD6s' ) >= 0
    )[ 0 ].remove();
    window.google = {};
    console.log(Map.COORDINATES);
  }
  componentDidMount() {
    loadGoogleMapsAPI( Map.API_CONFIG ).then( googleMaps => {
      const maps = new googleMaps.Map( this.refs.map, mapOptions );

      const newStyleMap = new googleMaps.StyledMapType( Map.STYLES, {name: 'Retro'});
      const marker = new googleMaps.Marker( markerOptions( googleMaps, maps ));

      maps.mapTypes.set( 'Retro', newStyleMap );
      maps.setMapTypeId( 'Retro' );

      Map.resetMarkerAnimation( marker );

    }).catch( err => {
      console.log( 'Something went wrong loading the map', err );
    });
  }

  render() {
    return (
      <div ref="map" className="map-google"></div>
    )
  }
}