import $ from 'jquery';
import 'slick-carousel';

import 'slick-carousel/slick/slick.min.js';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { tmdbToken } from './keys.mjs';
document.addEventListener("DOMContentLoaded", function() {
(function () {
    "use strict";
    const url = "https://admitted-fish-canidae.glitch.me//movies";
    let carouselData = [];
    const carouselPages = [1, 2, 3];
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${tmdbToken} `
        }
    };

    // Fetch data for the initial 3 pages and append to carouselData
    const fetchPromises = carouselPages.map(page => fetchMovies(page));

    // Once the initial 3 pages are fetched, populate the carousels
    Promise.all(fetchPromises).then(moviesData => {
        carouselData = [...moviesData];
        generateSlides('#carousel1', carouselData[0]);
        generateSlides('#carousel2', carouselData[1]);
    });

    function fetchMovies(page) {
        return fetch(`https://api.themoviedb.org/3/movie/popular?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`, options)
            .then(response => response.json());
    }

    function generateSlides(carouselId, movies) {
        const carouselDiv = document.querySelector(`${carouselId} div`);
        movies.results.forEach(movie => {
            const slideDiv = document.createElement('div');
            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            img.alt = movie.title;
            slideDiv.appendChild(img);
            carouselDiv.appendChild(img);
        });

        $(carouselId).slick({
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 3,
            rtl: carouselId === '#carousel1'
        });

        $(carouselId).on('afterChange', function(event, slick, currentSlide){
            const slideCount = slick.slideCount;
            if (currentSlide + slick.options.slidesToShow >= slideCount) {
                // Fetch a new page and append to carouselData
                const newPage = carouselData.length + 1;
                fetchMovies(newPage)
                    .then(data => {
                        carouselData.push(data);
                        appendMoviesToCarousel(carouselId, data);
                    })
                    .catch(err => console.error(err));
            }
        });
    }

    function appendMoviesToCarousel(carouselId, movies) {
        movies.results.forEach(movie => {
            const slideDiv = document.createElement('div');
            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            img.alt = movie.title;
            slideDiv.appendChild(img);
            $(carouselId).slick('slickAdd', img.outerHTML);
        });
    }
})();
});