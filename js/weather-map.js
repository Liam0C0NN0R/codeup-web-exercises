(function () {
    "use strict"
import{ openWeatherKey, mapboxToken} from 'js/keys.js';




    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 10,
        center: ([38.24954727722081, -85.65776736418078])
    });

    //marker for the map
    const marker = new mapboxgl.Marker({
        draggable: true
    })
        //this is where the marker starts
        .setLngLat([38.24954727722081, -85.65776736418078])
        .addTo(map);
})();