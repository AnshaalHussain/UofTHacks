
function initMap() {
  const pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);
  const map = new google.maps.Map(document.getElementById("map"), {
    center: pyrmont,
    zoom: 8,
  });
  const request = {
    location: pyrmont,
    radius: '500',
    type: ['restaurant']
  };
  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}