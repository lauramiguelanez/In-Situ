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
    //div.appendChild( iframe );
    var object = new THREE.CSS3DObject( div );
    object.position.set( x, y, z );
    object.rotation.y = ry;
    return object;
}
const imageElement = (url, x, y, z, ry) =>{
    var div = document.createElement( 'div' );
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.backgroundColor = '#000';
    var image = document.createElement( 'img' );
    image.style.border = '0px';
    image.src = "https://storage.googleapis.com/fl-media/photo%2F61%2F62%2F11%2Fboyander%2F1223416899490_f.jpg?GoogleAccessId=legacy-storage%40fotolog-web.iam.gserviceaccount.com&Expires=1539561600&Signature=dBQv0M9Zn9%2BghCQ1V8Dtwf9tY9srbSR64Pbz9HxoJVAHYUJ4c9RDAL1bmJjj0UYeXMo2F%2FX5BQh0EpR1scyc9rtjohixVl22q0PD3%2FFmqXJ%2Bbu29PUQt5FHIeHND7%2FUbySd9aywiAhaqekpoZxzgwRrK0d6MRyhwPvkZJor5q3Roud216k2eCl5rS1PIC6NNhle1rLSRk75hkVVx6q%2FHx06Y8O63VvLVqb9NNDm0P6vLhe0t%2BoJxOFCnBQKRuWdmyrmkXcBuWEDvR3xirW1FR34mbtmjyYg1ZUk8dwm44NONBK5jRcT04Mty%2B8Z7o9wTjIP%2FyooBpyMbBd%2Ff61K%2Fyg%3D%3D";
    div.appendChild( image );
    var object = new THREE.CSS3DObject( div );
    object.position.set( x, y, z );
    object.rotation.y = ry;
    return object;
}

export const CSS3elements = (spaceRadius, data) => {
    let radius = spaceRadius-50;
    let many = data.length;
    let angle = Math.PI * 2 / many;
    let x,z;
    let y = spaceRadius/2;
    let group = new THREE.Group();
    data.forEach((e,i) => {
        let ry = angle * i;
        x = radius * Math.cos(ry);
        z = radius * Math.sin(ry);
        let rot = Math.PI/2 - ry + angle/2;
        //let newIFrame = new iframeElement(e, x, y, z, ry);
        //group.add(newIFrame);
        let newImage = new imageElement(e, x, y, z, rot);
        group.add(newImage);
    });

    return group;
}