import Glide from '@glidejs/glide';
import { tmdbToken } from './keys.mjs';
(function () {
    "use strict";
    const url = "https://admitted-fish-canidae.glitch.me//movies";


//TODO: Create two Glide carousels, give them IDs of C1 and C2. Set them up with opposite directions (C1 slides left, C2 slides right).

//TODO On page load, make an API call to TMDB to get 20 random movie posters. Append those to C1. Make another call to get 20 more posters and append those to C2.

// Fetch a random page of posters for carousel1
    const page1 = Math.floor(Math.random() * 10) + 1;
    const page2 = Math.floor(Math.random() * 10) + 1;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${tmdbToken} `
        }
    };


    // Fetch movies for carousel 1
    fetch(`https://api.themoviedb.org/3/movie/popular?include_adult=false&include_video=false&language=en-US&page=${page1}&sort_by=popularity.desc`, options)
        .then(response => response.json())
        .then(data => generateSlides('#carousel1', data))
        .catch(err => console.error(err));

    // Fetch movies for carousel 2
    fetch(`https://api.themoviedb.org/3/movie/popular?include_adult=false&include_video=false&language=en-US&page=${page2}&sort_by=popularity.desc`, options)
        .then(response => response.json())
        .then(data => generateSlides('#carousel2', data))
        .catch(err => console.error(err));

    function generateSlides(carouselId, movies) {
        const carouselSlides = document.querySelector(`${carouselId} .glide__slides`);
        movies.results.forEach(movie => {
            const li = document.createElement('li');
            li.classList.add('glide__slide');
            li.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">`;
            carouselSlides.appendChild(li);
        });

        // Initialize Glide for the carousel
        const glide = new Glide(carouselId, {
            type: 'carousel',
            startAt: 3,
            perView: 5,
            focusAt: 'center',
            direction: carouselId === '#carousel1' ? 'ltr' : 'rtl' // Make carousel1 slide to left and carousel2 slide to right
        }).mount();

        // Update glide with new slides
        glide.update();
    }
})();










// TODO 3. Set up next/previous buttons that call .goNext() and .goPrev() on both C1 and C2.
//  4. Set up an event listener for when C1 reaches the end of its slides. In that listener, make an API call for 20 more posters and append them to C1. Then grab the 20 posters currently in C1 and append them to C2. This will make it appear C1 flows into C2.
//  5. In the event listener, call .goNext() on C1 and C2 to continue their slide animation uninterrupted after the new posters are added.



