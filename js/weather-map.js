(function () {
    "use strict"
    // import {openWeatherKey, mapboxToken} from 'js/keys.js';

    // $.get("https://api.openweathermap.org/data/2.5/weather", {
    //     APPID: openWeatherKey,
    //     q: "San Antonio, US"
    // }).done(function (data) {
    //     console.log(data);
    // });
    let coords = []
    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        zoom: 10,
        center: ([-85.75968, 38.25131])
    });

    //marker for the map
    let marker = new mapboxgl.Marker({
        draggable: true
    })
        .setLngLat([-85.75968, 38.25131])
        .addTo(map);
    //start location:
    $.get("http://api.openweathermap.org/data/2.5/forecast", {
        APPID: openWeatherKey,
        q: "Louisville",
        units: "imperial"

    }).done(function (data) {
        console.log('5 day forecast', data);
        $("#city").append(`Location: ${data.city.name.toUpperCase()}`)
        for (let i = 0; i < data.list.length; i = i + 8) {
            $("#card").append(`
        <div class="card col">
            <div class="cardHeader"><p>${data.list[i].dt_txt.slice(0, 10)}</p></div>
            <hr>
            <div class="temperature"><p>Temperature<br> Low : ${Math.round(data.list[i].main.temp_min)} °F   High : ${Math.round(data.list[i].main.temp_max)} °F</p></div>
            <hr>
            <div class="humidity "><p>Humidity: ${data.list[i].main.humidity} %</p></div>
            <hr>
            <div class="real-feel"><p>Feels like: ${Math.round(data.list[i].main.feels_like)} °F</p></div>
            <hr>
            <div><p>${data.list[i].weather[0].description.toUpperCase()}</p><br><img class="image" src = "http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt='Weather icon'>
            <hr>
            <div class="wind"><p>Wind:${Math.round(data.list[i].wind.speed)} MPH</p></div>
        </div>`);
        }

        //update the cards:
        function updateCards(lat, lng) {
            $.get("http://api.openweathermap.org/data/2.5/forecast", {
                APPID: openWeatherKey,
                lat: lat,
                lon: lng,
                units: "imperial"
            }).done(function (data) {
                //reset city:
                $("#city").text("");
                //reset cards:
                $("#card").text("");
                $("#city").append(`Location: ${data.city.name.toUpperCase()}`)
                for (let i = 0; i < data.list.length; i = i + 8) {
                    $("#card").append(`
      <div class="card col shadow-lg">
            <div class="cardHeader pt-4"><p>${data.list[i].dt_txt.slice(0, 10)}</p></div>
            <hr>
           <div class="temperature"><p>Temperature<br> Low :${Math.round(data.list[i].main.temp_min)} °F  High :${Math.round(data.list[i].main.temp_max)} °F</p></div>
            <hr>
            <div class="humidity"><p>Humidity:${data.list[i].main.humidity} %</p></div>
            <hr>
            <div class="real-feel"><p>Feels like:${Math.round(data.list[i].main.feels_like)} °F</p></div>
            <hr>
            <div>${data.list[i].weather[0].main.toUpperCase()}<br>
            ${data.list[i].weather[0].description.toUpperCase()}<br>
            <img class="image" src = "http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt='Weather icon'></div>
            <hr>
            <div class="wind"><p>Wind:${Math.round(data.list[i].wind.speed)} MPH</p></div>
        </div>`);
                }
            })
        }
        //Drag and load feature:
        function onDragEnd() {
            const lngLat = marker.getLngLat();

            updateCards(lngLat.lat, lngLat.lng)
        }

        marker.on('dragend', onDragEnd);

        $('#submit').click(function () {
            var search = $("#search").val();

            //Use geocode function to get coordinates based on a physical address then store
            geocode(search, mapboxToken).then(function (result) {
                var long = result[0].toString();
                var lat = result[1].toString();
                $.ajax("http://api.openweathermap.org/data/2.5/onecall" + openWeatherKey + "/" + lat + ", " + long)
                    .done(function (data){
                        updateCards()
                    });
            });
        });


        // const fetchWeather = (lat, lon, units, key) => {
        //     $.get("http://api.openweathermap.org/data/2.5/onecall", {
        //         APPID: openWeatherKey,
        //         lat: lat,
        //         lon: lon,
        //         units: units
        //     }).done(function (data) {
        //
        //         console.log('The entire response:', data);
        //
        //     });
        // }
        //search function:
        // $("#submit").click(function (e) {
        //     e.preventDefault()
        //     var input = $("#search").val();
        //     geocode(input, mapboxToken).then(function (result) {
        //         console.log(result);
        //         updateCards(result);
        //         map.setCenter(result);
        //         map.setZoom(12);
        //         marker.setLngLat(result);
        //     });
        // });
        // const newGeoMark = (address, token) => {
        //     geocode(address, token).then((res) => {
        //         const newMarker = new mapboxgl.Marker()
        //             .setLngLat(res)
        //             .addTo(map);
        //         console.log(res)
        //         map.setCenter(res);
        //         map.setZoom(19);
        //     })
        // }
        //
        // $('#submit').click(e => {
        //     console.log('clicked')
        //     e.preventDefault()
        //     //capturing input
        //     const newSpot = $('#search').val('')
        //     //run geocode function with input
        //     newGeoMark(newSpot, mapboxToken)
        //     // clear input field
        //     $('#search').val('')
        //     const lat = e.lat
        //     const lng = e.lng
        //     coords = [lng, lat]
        //     if(marker) {
        //         marker.remove()
        //     }
        //     marker = new mapboxgl.Marker()
        //         .setLngLat(coords)
        //         .addTo(map);
        //     // fetchWeather(lat, lng, 'imperial', openWeatherKey)
        //     reverseGeoAddress(lat, lng, mapboxToken)
        //     updateCards(e.lat, e.lng)
        //
        // })



        //
        // // Listening for click on map
        // map.on('click', (e) => {
        //     const lat = e.lngLat.lat
        //     const lng = e.lngLat.lng
        //     coords = [lng, lat]
        //     if(marker) {
        //         marker.remove()
        //     }
        //     marker = new mapboxgl.Marker()
        //         .setLngLat(coords)
        //         .addTo(map);
        //     fetchWeather(lat, lng, 'imperial', openWeatherKey)
        //     reverseGeoAddress(lat, lng, mapboxToken)
        //
        // })

        // const reverseGeoAddress = (lat, lng, token) => {
        //     reverseGeocode({lng: lng, lat: lat},  token).then(function(results) {
        //         // logs the address for The Alamo
        //         console.log(results);
        //         const city = results.split(',')[1]
        //         const state = results.split(',')[2].replace(/[0-9]/g, '');
        //         console.log(city, state);
        //     });
        // }

    });
})();