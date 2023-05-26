import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
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
            autoplay: true,
            animationDuration: 6000,
            animationTimingFunc: 'cubic-bezier(1,1,.71,.71)',
            gap: 20,
            startAt: 3,
            perView: 5,
            peek: { before: 10, after: 10 },
            focusAt: 'center',
            direction: carouselId === '#carousel1' ? 'rtl' : 'ltr' // Make carousel1 slide to left and carousel2 slide to right
        }).mount();

        // Update glide with new slides
        glide.update();
    }
    // This function fetches new movies from the TMDB API
    function fetchNewMovies(page = 1) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdbToken}`
            }
        };

        return fetch(`https://api.themoviedb.org/3/movie/popular?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`, options)
            .then(response => response.json())
            .catch(err => console.error(err));
    }

// This function takes a carousel ID and a movies data array, then creates and appends new slides to the corresponding carousel
    function appendMoviesToCarousel(carouselId, movies) {
        const carouselSlides = document.querySelector(`${carouselId} .glide__slides`);

        movies.results.forEach(movie => {
            const li = document.createElement('li');
            li.classList.add('glide__slide');
            li.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">`;
            carouselSlides.appendChild(li);
        });
    }
})();



