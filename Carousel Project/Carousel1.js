document.addEventListener("DOMContentLoaded", () => {
    const carousel1 = document.getElementById('carousel1');
    const carousel2 = document.getElementById('carousel2');
    const modal = document.getElementById('modal');
    const overlay = document.querySelector('.overlay');


    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${tmdbToken}`
        }
    };

    let currentPage1 = 2;
    let isLoading1 = false;
    let storedMovies1 = [];

    let paused = false;

    carousel1.addEventListener('mouseenter', () => paused = true);
    carousel1.addEventListener('mouseleave', () => paused = false);
    carousel2.addEventListener('mouseenter', () => paused = true);
    carousel2.addEventListener('mouseleave', () => paused = false);


    const fetchMovies = async pageNumber => {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?page=${pageNumber}&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&without_genres=asian`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data.results;
    };

    const fetchMovieCredits = async movieId => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data;
    };

    const getDirector = credits => {
        const director = credits.crew.find(crewMember => crewMember.job === "Director");

        return director ? director.name : "Unknown";
    };

    const getActors = credits => {
        const actors = credits.cast.slice(0, 3).map(actor => actor.name).join(', ');

        return actors;
    };

    const createMovieElement = async movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.style.opacity = '0';

        const movieImage = document.createElement('img');
        movieImage.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

        movieElement.appendChild(movieImage);

        // Fetch director's name and top 3 actors
        const credits = await fetchMovieCredits(movie.id);
        const director = getDirector(credits);
        const actors = getActors(credits);

        // Store the movie data including director and actors in the dataset property
        movieElement.dataset.movie = JSON.stringify({
            ...movie,
            director,
            actors
        });

        return movieElement;
    };


    const addMoviesToCarousel = async (carousel, movies, reverse = false) => {
        const posterWidth = 200;
        const margin = 16;
        const posterWidthPlusMargin = posterWidth + 2 * margin;
        const newMoviesWidth = movies.length * posterWidthPlusMargin;

        const placeholder = document.createElement('div');
        placeholder.style.width = `${newMoviesWidth}px`;
        if(reverse) {
            carousel.append(placeholder);
        } else {
            carousel.prepend(placeholder);
        }

        const oldScrollPosition = carousel.scrollLeft;
        const oldCarouselSize = carousel.scrollWidth;

        const sortedMovies = reverse ? movies : [...movies].reverse();

        // Fetch movie credits and create movie elements concurrently
        const movieElements = await Promise.all(sortedMovies.map(movie => createMovieElement(movie)));

        for (const movieElement of movieElements) {
            if(reverse) {
                carousel.append(movieElement);
            } else {
                carousel.prepend(movieElement);
            }
        }

        carousel.offsetHeight;
        Array.from(carousel.children).forEach((child) => {
            child.style.transition = 'opacity 0.5s';
            child.style.opacity = '1';
        });

        setTimeout(() => {
            const newScrollPosition = reverse ? oldScrollPosition : oldScrollPosition + (carousel.scrollWidth - oldCarouselSize);
            carousel.scrollLeft = newScrollPosition;

            carousel.removeChild(placeholder);
        }, 50);
    };


    const addMoviesToCarousel1 = async () => {
        isLoading1 = true;
        const movies = await fetchMovies(currentPage1);
        storedMovies1 = [...storedMovies1, ...movies];
        await addMoviesToCarousel(carousel1, movies);
        isLoading1 = false;
    };

    const addMoviesToCarousel2 = async () => {
        let movies = [];
        if (storedMovies1.length > 0) {
            movies = storedMovies1.splice(0, 20);
        } else {
            movies = await fetchMovies(1);
        }
        await addMoviesToCarousel(carousel2, movies, true);
    };

    let scrolling1 = false;
    let scrolling2 = false;

    const moveCarousel1 = async () => {
        const posterWidthPlusMargin = 200;
        async function scrollSmoothly1() {
            if (paused) {
                setTimeout(() => requestAnimationFrame(scrollSmoothly1), 100);
                return;
            }
            const newScrollPosition = carousel1.scrollLeft - posterWidthPlusMargin;
            const distanceLeft = Math.abs(carousel1.scrollLeft - newScrollPosition);
            const upcomingPosters = [...carousel1.children].findIndex(movieElement => movieElement.offsetLeft + movieElement.offsetWidth/2 >= carousel1.scrollLeft);
            if (upcomingPosters <= 3 && !isLoading1) {
                currentPage1++;
                await addMoviesToCarousel1();
            }
            if (distanceLeft < 1) {
                carousel1.scrollLeft = newScrollPosition;
                scrolling1 = false;
            } else {
                carousel1.scrollLeft -= distanceLeft / 600;
                requestAnimationFrame(scrollSmoothly1);
            }
        }
        if (!scrolling1) {
            scrolling1 = true;
            requestAnimationFrame(scrollSmoothly1);
        }
    };

    const moveCarousel2 = async () => {
        const posterWidthPlusMargin = 200;
        async function scrollSmoothly2() {
            if (paused) {
                setTimeout(() => requestAnimationFrame(scrollSmoothly2), 100);
                return;
            }
            const newScrollPosition = carousel2.scrollLeft + posterWidthPlusMargin;
            const distanceLeft = Math.abs(carousel2.scrollLeft - newScrollPosition);
            const upcomingPosters = [...carousel2.children].findIndex(movieElement => movieElement.offsetLeft - carousel2.scrollLeft >= carousel2.offsetWidth);
            if (upcomingPosters <= 3 && !isLoading1) {
                await addMoviesToCarousel2();
            }
            if (distanceLeft < 1) {
                carousel2.scrollLeft = newScrollPosition;
                scrolling2 = false;
            } else {
                carousel2.scrollLeft += distanceLeft / 165;
                requestAnimationFrame(scrollSmoothly2);
            }
        }

        if (!scrolling2) {
            scrolling2 = true;
            requestAnimationFrame(scrollSmoothly2);
        }
    };



    (function scrollLoop1() {
            moveCarousel1();
        requestAnimationFrame(scrollLoop1);
    })();

    (function scrollLoop2() {
            moveCarousel2();
        requestAnimationFrame(scrollLoop2);
    })();

    // Initial fetch for carousels
    Promise.all([
        addMoviesToCarousel1(),
        addMoviesToCarousel2()
    ]).then(() => {
        carousel1.scrollLeft = carousel1.scrollWidth;
        carousel2.scrollLeft = 0;
    });


    // A function to open the modal with the given movie data
    function openModal(movie) {
        paused = true; // Pause the carousels

        // Fill the modal with the movie data
        modal.textContent = ''; // Clear any existing content
        modal.innerHTML = `
    <h2>${movie.title}</h2>
    <p>Director: ${movie.director}</p>
    <p>Actors: ${movie.actors}</p>
    <p>Release Date: ${movie.release_date}</p>
    <p>Rating: ${movie.vote_average}</p>
    <p>Synopsis: ${movie.overview}</p>
    <button id="closeButton">Close</button>
`;

        // Show the modal
        modal.style.display = 'block';

        // Show the overlay
        overlay.style.display = 'block';
    }

    window.closeModal = function() {
        paused = false; // Resume the carousels

        // Hide the modal
        modal.style.display = 'none';

        // Hide the overlay
        overlay.style.display = 'none';
    }

    document.addEventListener('click', event => {
        if (event.target.closest('.movie')) {
            const movieElement = event.target.closest('.movie');
            const movie = JSON.parse(movieElement.dataset.movie);
            openModal(movie);
        } else if (event.target.id === 'closeButton') {
            closeModal();
        }
    });




});
