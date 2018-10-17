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

let elementSize = 200;

const iframeElement = (ytID, x, y, z, ry) =>{
    var div = document.createElement( 'div' );
    div.style.width = `${elementSize}px`;
    //div.style.height = '360px';
    div.style.backgroundColor = '#000';
    var iframe = document.createElement( 'iframe' );
    //iframe.style.width = "480px";
    //iframe.style.height = '360px';
    iframe.style.border = '0px';
    let url = [ 'https://www.youtube.com/embed/', ytID, '?rel=0' ].join( '' );
    iframe.src = url;
    div.appendChild( iframe );
    var object = new THREE.CSS3DObject( div );
    object.position.set( x, y, z );
    object.rotation.y = ry;
    console.log(ytID);
    console.log(url);
    return object;
}
const imageElement = (url, x, y, z, ry) =>{
    var div = document.createElement( 'div' );
    //div.style.width = '50px';
    //div.style.height = '50px';
    div.style.backgroundColor = '#000';
    var image = document.createElement( 'img' );
    image.style.border = '0px';
    image.src = url;//"https://scontent-mad1-1.cdninstagram.com/vp/30f76f820acdb893b9cb648ae0adfd57/5C5FEA68/t51.2885-15/e35/25018699_872711359576719_1019478494217764864_n.jpg";
    image.style.width = `${elementSize}px`;
    image.style.height = 'auto';
    div.appendChild( image );
    var object = new THREE.CSS3DObject( div );
    object.position.set( x, y, z );
    object.rotation.y = ry;
    console.log(url);
    return object;
}

export const CSS3elementsPREV = (spaceRadius, media) => {
    let radius = spaceRadius-50;
    let many = media.length;
    let angle = Math.PI * 2 / many;
    let x,z;
    let y = 0;//spaceRadius/2;
    let group = new THREE.Group();
    media.forEach((e,i) => {
        let ry = angle * i;
        x = radius * Math.cos(ry);
        z = radius * Math.sin(ry);
        let rot = 3*Math.PI/2 - ry;
        if (e.type == "IMAGE"){
            let newImage = new imageElement(e.url, x, y, z, rot);
            //console.log(e);
            group.add(newImage);
        } else if (e.type == "YOUTUBE"){
            //console.log(e);
            let newIFrame = new iframeElement(e.url, x, y, z, rot);
            group.add(newIFrame);
        }else {
            let newIFrame = new iframeElement(e, x, y, z, rot);
            group.add(newIFrame);
        }
    });
    return group;
}