import React, { Component } from 'react';
import * as mapConstants from './constants';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.onScriptLoad = this.onScriptLoad.bind(this)
  }

  onScriptLoad() {
    const map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      this.props.options);

      const newStyleMap = new window.google.maps.StyledMapType( mapConstants.STYLES, {name: 'MapStyled'});

      map.mapTypes.set( 'MapStyled', newStyleMap );
      map.setMapTypeId( 'MapStyled' );

    this.props.onMapLoad(map)
  }

  componentDidMount() {
    if (!window.google) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = `https://maps.google.com/maps/api/js?key=AIzaSyA2VCIDASPyZRdr58uKR5ucueARsagOD6s`;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
      // Below is important. 
      //We cannot access google.maps until it's finished loading
      s.addEventListener('load', e => {
        this.onScriptLoad()
      })
    } else {
      this.onScriptLoad()
    }
  }

  render() {
    return (
      <div style={{ width: window.innerWidth, height: window.innerHeight }} id={this.props.id} />
    );
  }
}