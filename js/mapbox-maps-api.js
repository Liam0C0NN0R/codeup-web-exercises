(function () {
    import{ openWeatherKey, mapboxToken} from 'js/keys.js';


    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [-96, 33], // starting position [lng, lat]
        zoom: 4, // starting zoom
    });
    var cocosInfo = {
        address: "9351 Warren Pkwy #125, Frisco, TX 75035",
        popupHTML: "<p>Coco Ichibanya</p>"
    };

    // the  geocode method from mapbox-geocoder-utils.js
    function placeMrkAndPop(info, token, map) {
        geocode("Cocos.9351 Warren Pkwy #125, Frisco, TX 75035", 'token').then((coordinates) => {
            // console.log(result);
            var popup = new mapboxgl.Popup()
                .setHTML(info.popupHTML);
            var marker = new mapboxgl.Marker()
                .setLngLat([-96.802000, 33.108510])
                .addTo(map)
                .setPopup(popup);
            // popup.addTo(map)
            // map.setCenter(result);
            // map.setZoom(8);
        });
    }

    placeMrkAndPop(cocosInfo, token, map);
    // var cocos = new mapboxgl.Marker()
    // .setLngLat([-96.802000, 33.108510])
    // .addTo(map);
    // var cocosPop = new mapboxgl.Popup()
    //     .setHTML("<h2>CoCo Ichibanya</h2>")
    // cocos.setPopup(cocosPop)
    const restaurants = [
        {name: "Yolan", long: -86.774320, lat: 36.156510, info: "Authentic Italian, emphasis on finer details."},
        {name: "Fireproof", long: -83.004402, lat: 39.982948, info: "Tapas, crab stuffed jalepeno poppers"},
        {name: "Uobei Shibuya Dougenzaka", long: 139.705162, lat: 35.663983, info: "Favorite Sushi-go-round"},
    ]
    restaurants.forEach(restaurant => {
        const marker = new mapboxgl.Marker()
            .setLngLat([restaurant.long, restaurant.lat])
            .addTo(map);
        const popup = new mapboxgl.Popup()
            .setHTML(`\n<p class="popup">${restaurant.name}</p>\n        <p>${restaurant.info}</p>\n`);
        marker.setPopup(popup);
    });



    document.querySelector("#zoomSubmit").addEventListener('click', event => {
        event.preventDefault()
        map.setZoom(document.querySelector("#zoom").value)
    });

    // document.getElementById("#makeMarkerButton").addEventListener('click', event => {
    //     event.preventDefault();
    //     const address = document.getElementById("#makeMarker").value;
    //     geocode(address, token).then(coords=>{
    //         console.log(coords)
    //         const newMarker = new mapboxgl.Marker()
    //             .setLngLat(coords)
    //             .addTo(map);
    //         map.setCenter(coords);
    //     });
    // });

    // document.getElementById("makeMarkerBtn").addEventListener("click", function () {
    //     var newJoint = geocode(document.getElementById("makeMarker").value, token)
    //     newJoint.then(function (results) {
    //         map.setCenter([results[0], results[1]])
    //     })
    // });
    document.getElementById("makeMarkerBtn").addEventListener("click", function () {
        let newJoint = reverseGeocode(document.getElementById('makeMarker').value, token)
        newJoint.then(function (results) {
            map.setCenter([results[0], results[1]])
            let newMark = new mapboxgl.Marker()
                .setLngLat([results[0], results[1]])
                .addTo(map);
        })
    });


    document.querySelector("#hideMarkers").addEventListener('click', event=>{
        document.querySelectorAll(".mapboxgl-marker").forEach(function (svg) {
            svg.style.display = "none"
        })
    })
})();