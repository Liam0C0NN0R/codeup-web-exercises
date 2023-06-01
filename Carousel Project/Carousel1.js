document.addEventListener("DOMContentLoaded", () => {
    const carousel1 = document.getElementById('carousel1');
    const carousel2 = document.getElementById('carousel2');

    const nextButton = document.getElementById('nextButton');
    const prevButton = document.getElementById('prevButton');

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${tmdbToken} `
        }
    };

    let fetchedMovies = [];
    let currentPage1 = 2;
    let currentPage2 = 3;
    let isAutoScrolling = true;
    let isLoading = false;

    const fetchMovies = async pageNumber => {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?page=${pageNumber}&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&without_genres=asian`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        fetchedMovies = [...fetchedMovies, ...data.results];

        return data.results;
    };

    const createMovieElement = movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        const movieImage = document.createElement('img');
        movieImage.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

        movieElement.appendChild(movieImage);

        return movieElement;
    };

    const addMoviesToCarousel = async (carousel, pageNumber) => {
        const movies = await fetchMovies(pageNumber);

        for (const movie of movies) {
            const movieElement = createMovieElement(movie);
            carousel.appendChild(movieElement);
        }
    };

    const addMovieToCarousel2 = () => {
        if (fetchedMovies.length > 0) {
            const movie = fetchedMovies.shift();
            const movieElement = createMovieElement(movie);
            carousel2.appendChild(movieElement);
        }
    };

    const moveCarousel = async (carousel, direction) => {
        const scrollAmount = carousel.clientWidth / 5; // for smooth transition
        const newScrollPosition = carousel.scrollLeft + direction * scrollAmount;

        carousel.scroll({
            top: 0,
            left: newScrollPosition,
            behavior: 'smooth'
        });

        if (carousel === carousel1 && carousel.scrollLeft <= scrollAmount && !isLoading) {
            isLoading = true;
            await addMoviesToCarousel(carousel, currentPage1++);
            isLoading = false;
        }
    };

    nextButton.addEventListener('click', () => {
        isAutoScrolling = false;
        moveCarousel(carousel1, 1);
        moveCarousel(carousel2, -1);
    });

    prevButton.addEventListener('click', () => {
        isAutoScrolling = false;
        moveCarousel(carousel1, -1);
        moveCarousel(carousel2, 1);
    });

    setInterval(() => {
        if (isAutoScrolling) {
            (async function() {
                await moveCarousel(carousel1, -1);
                await moveCarousel(carousel2, 1);
                addMovieToCarousel2();
            })();
        }
    }, 3000);

    // Initial fetch for carousels
    addMoviesToCarousel(carousel1, 1);
    addMoviesToCarousel(carousel2, currentPage2);
});
