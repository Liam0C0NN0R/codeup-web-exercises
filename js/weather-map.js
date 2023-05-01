(function () {
    "use strict"
    // import {openWeatherKey, mapboxToken} from 'js/keys.js';

    // $.get("https://api.openweathermap.org/data/2.5/weather", {
    //     APPID: openWeatherKey,
    //     q: "San Antonio, US"
    // }).done(function (data) {
    //     console.log(data);
    // });

    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        zoom: 10,
        center: ([-85.75968, 38.25131])
    });

    //marker for the map
    const marker = new mapboxgl.Marker({
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
            <div class="cardHeader pt-4"><p>${data.list[i].dt_txt.slice(0, 10)}</p></div>
            <hr>
            <div class="temperature"><p>Temperature<br> Min : ${Math.round(data.list[i].main.temp_min)} °F / Max : ${Math.round(data.list[i].main.temp_max)} °F</p></div>
            <hr>
            <div class="humidity "><p>Humidity: ${data.list[i].main.humidity} %</p></div>
            <hr>
            <div class="real-feel"><p>Feels like: ${Math.round(data.list[i].main.feels_like)} °F</p></div>
            <hr>
            <div>${data.list[i].weather[0].main.toUpperCase()}<br>
            ${data.list[i].weather[0].description.toUpperCase()}<img class="image" src = "http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt='Weather icon'><br>
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
           <div class="temperature"><p>Temperature<br> Min :${Math.round(data.list[i].main.temp_min)} °F / Max :${Math.round(data.list[i].main.temp_max)} °F</p></div>
            <hr>
            <div class="humidity"><p>Humidity:${data.list[i].main.humidity} %</p></div>
            <hr>
            <div class="real-feel"><p>Feels like:${data.list[i].main.feels_like} °F</p></div>
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

        //search function:
        $("#submit").click(function () {
            var input = $("#search").val();
            geocode(input, mapboxToken).then(function (result) {
                console.log(result);
                updateCards(result);
                map.setCenter(result);
                map.setZoom(12);
                marker.setLngLat(result);
            });
        });

    });
    })();