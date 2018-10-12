export const GoogleMap = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
  });

  const setPosOnForm = (latlng) => {
    document.getElementById('lat-pos').value = latlng.lat;
    document.getElementById('lng-pos').value = latlng.lng;

  }

  let marker;

  GoogleMap.addListener('click', function(e) {
    const clickPos = {
      lat:e.latLng.lat(),
      lng:e.latLng.lng()
    }
    console.log(clickPos);
    marker.setPosition(clickPos);
    setPosOnForm(clickPos)
  });

  geolocalize().then(center => {
    GoogleMap.setCenter(center);
    marker = new google.maps.Marker({
      position: center,
      map: GoogleMap
    });
    setPosOnForm(center);
  });