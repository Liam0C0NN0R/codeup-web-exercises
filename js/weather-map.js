(function () {
    "use strict"
    let coords = []
    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/halcyonichermes/clh8a2ipk01ps01p443tphsrs',
        zoom: 9,
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
    // initial weather:
    }).done(function (data) {
        console.log('5 day forecast', data);
        $("#city").empty().append(`Location: ${data.city.name.toUpperCase()}`)
        for (let i = 0; i < data.list.length; i = i + 8) {
            $("#cards").append(`
                <div id="cards">
                    <div class="card">
                        <div class="cardHeader"><p>${data.list[i].dt_txt.slice(0, 10)}</p></div>
                        <hr>
                            <div class="card-body">
                            <div class="temperature"><p>Temperature<br> Low : ${Math.round(data.list[i].main.temp_min)}°F   High : ${Math.round(data.list[i].main.temp_max)}°F</p></div>
                            <hr>
                            <div class="humidity"><p>Humidity: ${data.list[i].main.humidity} %</p></div>
                            <hr>
                            <div class="real-feel"><p>Feels like: ${Math.round(data.list[i].main.feels_like)} °F</p></div>
                            <hr>
                            <div class="description"><p>${data.list[i].weather[0].description.toUpperCase()}</p><br><img class="image" src = "http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt='Weather icon'></div>
                            <hr>
                            <div class="wind"><p>Wind: ${Math.round(data.list[i].wind.speed)} MPH</p></div>
                        </div>
                    </div>
                </div>
        </div>`);
        }

        //update the cards:
        $(document).ready(function () {
            function updateCards(lat, lng) {
                $.get("http://api.openweathermap.org/data/2.5/forecast", {
                    APPID: openWeatherKey,
                    lat: lat,
                    lon: lng,
                    units: "imperial"
                }).done(function (data) {
                    console.log(data)
                    //reset city:
                    $("#city").empty();
                    // //reset cards:
                    $("#cards").empty();
                    $("#city").append(`Location: ${data.city.name.toUpperCase()}`)
                    for (let i = 0; i < data.list.length; i = i + 8) {
                        $("#cards").append(`
                        <div id="cards">
                            <div class="card">
                                 <div class="cardHeader"><p>${data.list[i].dt_txt.slice(0, 10)}</p></div>
                                    <hr>
                                    <div class="card-body">
                                    <div class="temperature"><p>Temperature<br> Low :${Math.round(data.list[i].main.temp_min)}°F  High :${Math.round(data.list[i].main.temp_max)}°F</p></div>
                                    <hr>
                                    <div class="humidity"><p>Humidity:${data.list[i].main.humidity} %</p></div>
                                    <hr>
                                    <div class="real-feel"><p>Feels like:${Math.round(data.list[i].main.feels_like)} °F</p></div>
                                    <hr><div class="description">
                                    ${data.list[i].weather[0].description.toUpperCase()}<br>
                                    <img class="image" src = "http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt='Weather icon'></div>
                                    <hr>
                                    <div class="wind"><p>Wind: ${Math.round(data.list[i].wind.speed)} MPH</p></div>
                                 </div>
                            </div>
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

            // Search for a city and update the map
            document.querySelector("#search-form").addEventListener("submit", async (e) => {
                e.preventDefault();
                const query = document.querySelector("#search-input").value;
                try {
                    const response = await fetch(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}`
                    );
                    const data = await response.json();
                    const {center} = data.features[0];
                    map.flyTo({center});
                    console.log(response);
                    console.log(data);

                    // Load weather data for the searched city
                    const lat = center[1];
                    const lon = center[0];
                    console.log(lat, lon);
                    // const weatherResponse = await fetch(
                    //     `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherKey}&units=metric`
                    // );
                    // const weatherData = await weatherResponse.json();
                    // const {name, main} = weatherData;

                    new mapboxgl.Marker()
                        .setLngLat([lon, lat])
                        .addTo(map);

                } catch (err) {
                    console.error(err);
                    console.log('textStatus');
                }
            });

            function geocode(search, token) {
                // console.log(query);
                return fetch(
                    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
                    encodeURIComponent(search) +
                    ".json?access_token=" +
                    mapboxToken
                )
                    .then(function (response) {
                        return response.json();
                        console.log(response);
                        console.log(data);
                    })
                    .then(function (data) {
                        return data.features[0].center;
                    });
            }

            $("#search-button").click(function () {
                var search = $("#search-input").val();
                console.log(search);
                geocode(search, mapboxToken).then(function (coords) {
                    // Update the marker position
                    marker.setLngLat(coords).addTo(map);

                    // Update the weather data
                    updateCards(coords[1], coords[0]);
                });
            });
        });
    });
    document.querySelector("#zoomSubmit").addEventListener('click', event => {
        event.preventDefault()
        map.setZoom(document.querySelector("#zoom").value)
    });

})();