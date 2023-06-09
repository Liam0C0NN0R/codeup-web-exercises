document.addEventListener("DOMContentLoaded", () => {
    const carousel1 = document.getElementById('carousel1');


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

    const fetchMovies = async pageNumber => {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?page=${pageNumber}&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&without_genres=asian`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data.results;
    };

    const createMovieElement = movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.style.opacity = '0'; // Initialize movie element with zero opacity


        const movieImage = document.createElement('img');
        movieImage.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

        movieElement.appendChild(movieImage);

        return movieElement;
    };

    const addMoviesToCarousel = async (carousel, pageNumber) => {
        isLoading1 = true;
        const movies = await fetchMovies(pageNumber);
        storedMovies1 = [...storedMovies1, ...movies];

        console.log(`Adding ${movies.length} movies from page ${pageNumber} to carousel...`);

        // Calculate the total width of the movie elements that will be added
        const posterWidth = 200; // The width of the movie element
        const margin = 16; // The width of the margin on one side of the movie element
        const posterWidthPlusMargin = posterWidth + 2 * margin;  // Total width of the movie element including margins

        const newMoviesWidth = movies.length * posterWidthPlusMargin;

        // Create and insert a temporary placeholder element at the beginning of the carousel
        const placeholder = document.createElement('div');
        placeholder.style.width = `${newMoviesWidth}px`;
        carousel.prepend(placeholder);

        // Save the current scroll position and size of the carousel
        const oldScrollPosition = carousel.scrollLeft;
        const oldCarouselSize = carousel.scrollWidth;

        // Reverse the movies array to maintain order when using prepend
        const reversedMovies = [...movies].reverse();

        for (const movie of reversedMovies) {
            const movieElement = createMovieElement(movie);
            carousel.prepend(movieElement); // Use prepend here instead of appendChild
        }

        // Force browser to recalculate layout by accessing offsetHeight
        carousel.offsetHeight;
        Array.from(carousel.children).forEach((child) => {
            child.style.transition = 'opacity 0.5s';
            child.style.opacity = '1';
        });

        setTimeout(() => {
            // Calculate the new scroll position: old position plus the amount the carousel grew
            const newScrollPosition = oldScrollPosition + (carousel.scrollWidth - oldCarouselSize);
            carousel.scrollLeft = newScrollPosition;

            // Remove the placeholder element
            carousel.removeChild(placeholder);

            console.log(`Successfully added movies to carousel. New carousel length: ${carousel.childElementCount}`);
            isLoading1 = false;
        }, 50);
    };






    let scrolling = false;

    const moveCarousel = async (carousel) => {
        const posterWidthPlusMargin = 200;

        async function scrollSmoothly() {
            const newScrollPosition = carousel.scrollLeft - posterWidthPlusMargin;
            const distanceLeft = Math.abs(carousel.scrollLeft - newScrollPosition);


            const upcomingPosters = [...carousel.children].findIndex(movieElement => movieElement.offsetLeft + movieElement.offsetWidth/2 >= carousel.scrollLeft);

            console.log(`Carousel Scroll Position: ${carousel.scrollLeft}`);
            console.log(`New Scroll Position: ${newScrollPosition}`);
            console.log(`Upcoming Posters: ${upcomingPosters}`);

            if (upcomingPosters <= 3 && !isLoading1) {
                console.log(`Starting to fetch page ${currentPage1 + 1}`);
                await addMoviesToCarousel(carousel, ++currentPage1);
                console.log(`Finished fetching page ${currentPage1}`);
            }

            if (distanceLeft < 1) {
                carousel.scrollLeft = newScrollPosition;
                scrolling = false;
            } else {
                carousel.scrollLeft -= distanceLeft / 600; // Adjust this value for smoother or rougher scrolling
                requestAnimationFrame(scrollSmoothly);
            }
        }

        if (!scrolling) {
            scrolling = true;
            requestAnimationFrame(scrollSmoothly);
        }
    };

    (function scrollLoop() {
        moveCarousel(carousel1);
        requestAnimationFrame(scrollLoop);
    })();setInterval(() => moveCarousel(carousel1), 3000);

    // Initial fetch for carousels
    addMoviesToCarousel(carousel1, currentPage1).then(() => {
        carousel1.scrollLeft = carousel1.scrollWidth;
    });

});