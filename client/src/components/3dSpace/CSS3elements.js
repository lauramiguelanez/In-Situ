import axios from "axios";
var THREE = require('three');
//import CSS3DObject from ".../lib/CSS3DObject";


var THREE = require('three');

THREE.CSS3DObject = function ( element ) {
	THREE.Object3D.call( this );
	this.element = element;
	this.element.style.position = 'absolute';
	this.addEventListener( 'removed', function () {
		if ( this.element.parentNode !== null ) {
			this.element.parentNode.removeChild( this.element );
		}
	} );
};
THREE.CSS3DObject.prototype = Object.create( THREE.Object3D.prototype );
THREE.CSS3DObject.prototype.constructor = THREE.CSS3DObject;
THREE.CSS3DSprite = function ( element ) {
	THREE.CSS3DObject.call( this, element );
};
THREE.CSS3DSprite.prototype = Object.create( THREE.CSS3DObject.prototype );
THREE.CSS3DSprite.prototype.constructor = THREE.CSS3DSprite;


const iframeElement = (ytID, x, y, z, ry) =>{
    var div = document.createElement( 'div' );
    div.style.width = '480px';
    div.style.height = '360px';
    div.style.backgroundColor = '#000';
    var iframe = document.createElement( 'iframe' );
    iframe.style.width = '480px';
    iframe.style.height = '360px';
    iframe.style.border = '0px';
    iframe.src = [ 'https://www.youtube.com/embed/', ytID, '?rel=0' ].join( '' );
    div.appendChild( iframe );
    var object = new THREE.CSS3DObject( div );
    object.position.set( x, y, z );
    object.rotation.y = ry;
    return object;
}

export const CSS3elements = (spaceRadius, data) => {
    let radius = spaceRadius-50;
    let many = data.length;
    let angle = Math.PI * 2 / many;
    let x = 0;
    let y = spaceRadius/2;
    let z = radius;
    let group = new THREE.Group();
    data.forEach((e,i) => {
        let ry = angle * i;
        let newIFrame = new iframeElement(e, x, y, z, ry);
        group.add(newIFrame);
    });
    return group;
}