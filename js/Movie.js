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

        // Initialize the carousels with no slides
        $('#carousel1').slick({
            infinite: false,
            slidesToShow: 5,
            slidesToScroll: 1,
            speed: 1000, // Increase this to make the transition slower
            arrows: false,
            autoplay: true, // This will start the carousel sliding automatically
            autoplaySpeed: 2000, // This is the delay between slides, in milliseconds
            swipe: false, // This prevents the user from manually swiping the carousel

        });

        $('#carousel2').slick({
            infinite: false,
            // rtl: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            speed: 1000, // Increase this to make the transition slower
            arrows: false,
            autoplay: true, // This will start the carousel sliding automatically
            autoplaySpeed: 2000, // This is the delay between slides, in milliseconds
            swipe: false, // This prevents the user from manually swiping the carousel
        });

        // Fetch initial data for carousel1
        fetchMovies(1).then(data => {
            appendMoviesToCarousel('#carousel1', data);
        }).catch(error => {
            console.error('Error fetching movies for carousel1:', error);
        });

        // Fetch initial data for carousel2
        fetchMovies(2).then(data => {
            appendMoviesToCarousel('#carousel2', data);
        }).catch(error => {
            console.error('Error fetching movies for carousel2:', error);
        });


        // Set up next/previous buttons
        $('#nextButton').on('click', function() {
            $('#carousel1').slick('slickNext'); // Changed from 'slickNext'
            $('#carousel2').slick('slickNext'); // Changed from 'slickPrev'
        });
        $('#prevButton').on('click', function() {
            $('#carousel1').slick('slickPrev'); // Changed from 'slickPrev'
            $('#carousel2').slick('slickPrev'); // Changed from 'slickNext'
        });

        let currentPageCarousel1 = 1;

        $('#carousel1').on('afterChange', function(event, slick, currentSlide) {
            if (currentSlide + slick.options.slidesToShow >= slick.slideCount) {
                // Remove the current slides in Carousel 1 and save the data related to them
                let oldMovies = removeMoviesFromCarousel('#carousel1');

                fetchMovies(++currentPageCarousel1)
                    .then(data => {
                        appendMoviesToCarousel('#carousel1', data.results);

                        // Append the old movies from Carousel 1 to Carousel 2
                        appendMoviesToCarousel('#carousel2', oldMovies);
                    });
            }
        });


        $('#carousel2').on('afterChange', function(event, slick, currentSlide) {
            if (currentSlide + slick.options.slidesToShow >= slick.slideCount) {
                fetchMovies(Math.floor(Math.random() * 400) + 1)
                    .then(data => {
                        appendMoviesToCarousel('#carousel2', data);
                    });
            }
        });


        function fetchMovies(pageNumber) {
            return fetch(`https://api.themoviedb.org/3/discover/movie?page=${pageNumber}&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&without_genres=asian`, options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                });
        }

        function appendMoviesToCarousel(carouselId, movies) {
            // Check if 'movies' is an array, if not, use the 'results' property
            const movieArray = Array.isArray(movies) ? movies : movies.results;

            const carouselDiv = $(carouselId);
            setTimeout(() => {
                let added = 0, skipped = 0;
                movieArray.forEach(movie => {
                    if (movie.poster_path !== null) {
                        const img = $('<img>', {
                            src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                            alt: movie.title
                        });
                        carouselDiv.slick('slickAdd', img);
                        added++;
                    } else {
                        skipped++;
                    }
                });
                console.log(`Added ${added} movies to ${carouselId}, skipped ${skipped} due to missing posters.`);
            }, 0);
        }

        function removeMoviesFromCarousel(carouselId) {
            const carouselDiv = $(carouselId);
            let movieData = [];

            // Get the data related to each slide in the carousel
            carouselDiv.find('img').each(function() {
                movieData.push({
                    poster_path: $(this).attr('src').replace('https://image.tmdb.org/t/p/w500', ''),
                    title: $(this).attr('alt')
                });
            });

            // Remove all slides from the carousel
            while (carouselDiv.slick('getSlick').slideCount > 0) {
                carouselDiv.slick('slickRemove', 0);
            }

            // Return the data related to the removed slides
            return movieData;
        }
    })();
});
