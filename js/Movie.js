(function () {
    "use strict";
    window.onload = function () {
        function getRandomTMDbMovieData(page, callback) {
            var apiKey = tmdbKey;
            var apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`;

            $.ajax({
                method: "GET",
                url: apiUrl,
                success: function (data) {
                    if (data.results && data.results.length > 0) {
                        callback(null, data.results);
                    } else {
                        callback("No movie data found.");
                    }
                },
                error: function () {
                    callback("Error fetching movie data.");
                }
            });
        }
        function createCarouselItem(movie) {
            const posterPath = movie.poster_path
                ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
                : "img/TMDB logo1.svg";

            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel__slider__item');

            const frame = document.createElement('div');
            frame.classList.add('item__3d-frame');
            carouselItem.appendChild(frame);

            const frontBox = document.createElement('div');
            frontBox.classList.add('item__3d-frame__box', 'item__3d-frame__box--front');
            frontBox.style.backgroundImage = `url(${posterPath})`;
            frontBox.style.backgroundSize = 'cover';
            frame.appendChild(frontBox);

            const leftBox = document.createElement('div');
            leftBox.classList.add('item__3d-frame__box', 'item__3d-frame__box--left');
            frame.appendChild(leftBox);

            const rightBox = document.createElement('div');
            rightBox.classList.add('item__3d-frame__box', 'item__3d-frame__box--right');
            frame.appendChild(rightBox);

            return carouselItem;
        }

        class Carousel {
            constructor(carouselElement, initialPage, slideDirection, carouselItems, startingIndex, carouselID, numMoviesToLoad) {
                this.carousel = carouselElement;
                this.previousMovies = [];
                this.items = carouselItems;
                this.carouselID = 'carousel' + carouselID;
                this.slideDirection = slideDirection;
                this.currIndex = startingIndex;
                this.numMoviesToLoad = numMoviesToLoad;
                this.startingIndex = startingIndex;
                this.slider = this.carousel.getElementsByClassName('carousel__slider')[0];
                this.items = this.carousel.getElementsByClassName('carousel__slider__item');
                this.prevBtn = this.carousel.querySelector('.carousel__prev');
                this.nextBtn = this.carousel.querySelector('.carousel__next');
                this.movieData = [];
                this.currentPage = initialPage;
                this.width = null;
                this.height = null;
                this.totalWidth = null;
                this.margin = 20;
                this.interval = null;
                this.intervalTime = 4000;

                this.bindEvents();
                this.getRandomMovies(this.currentPage, carouselID,() => {
                    this.init();
                    this.timer();
                });
            }
            loadNewMovies(movies) {
                this.appendMovies(movies);
                // If this is carousel1, store these movies for carousel2 to load later
                if (this.carouselID === 'carousel1') {
                    this.previousMovies = [...movies];
                }
            }
            replaceMovies(movies) {
                // Remove the old movies from the start of the carousel
                for(let i = 0; i < movies.length; i++) {
                    this.items[i].remove();
                }
                // Append the new movies at the end of the carousel
                for (const movie of movies) {
                    const posterPath = movie.poster_path ? TMDB_BASE_IMAGE_URL + movie.poster_path : FALLBACK_IMAGE;
                    const item = document.createElement('div');
                    item.classList.add('item');
                    item.innerHTML = `<img src="${posterPath}" alt="${movie.title}">`;
                    this.slider.appendChild(item);
                }
                // Update the items array
                this.items = [...this.items.slice(movies.length), ...Array.from(this.slider.getElementsByClassName('item'))];
            }

            fetchNewMovies(page, callback) {
                getRandomTMDbMovieData(page, (err, movies) => {
                    if (err) {
                        console.error(err);
                    } else {
                        this.movieData = movies; // Replace the old movies with the new ones
                        this.slider.innerHTML = ''; // Clear the old movies from the DOM
                        this.appendMovies(movies);
                        if (this.carouselID === 'carousel1') {
                            this.previousMovies = [...movies]; // Copy the new movies to the previousMovies array
                        }// Add the new movies to the DOM
                        // TODO: Update the DOM to reflect the new movies
                        // TODO: Start the carousel from the beginning
                    }
                });
            }
            appendMovies(movies) {
                // Assuming movies is an array of movie objects
                movies.forEach((movie, index) => {
                    const carouselItem = createCarouselItem(movie);
                    this.slider.appendChild(carouselItem);
                    this.items = this.carousel.getElementsByClassName('carousel__slider__item');
                });
                // Recalculate carousel size after adding new items
                this.resize();
            }



            init() {
                setTimeout(() => {
                    this.resize();
                    if (this.slideDirection === 'left') {
                        this.currIndex = this.items.length - 2;
                        this.move(this.currIndex);
                    } else {
                        this.currIndex = 1;
                        this.move(this.currIndex);
                    }
                    this.timer();
                }, 500);
            }


            resize() {
                this.width = Math.max(window.innerWidth * .25, 275);
                this.height = window.innerHeight * .5;
                this.totalWidth = this.width * this.items.length;
                this.slider.style.width = this.totalWidth + "px";

                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i];
                    item.style.width = (this.width - (this.margin * 2)) + "px";
                    item.style.height = this.height + "px";
                }
            }

            move(index) {
                if (index < 0) {
                    index = this.items.length - 1;
                } else if (index >= this.items.length) {
                    index = 0;
                }

                this.currIndex = index;
                let relativeIndex;

                // Load new movies if the carousel has reached the end
                if (index === this.items.length - 1) {
                    if (this.carouselID === 'carousel1') {
                        this.fetchNewMovies(this.currentPage++, (err, newMovies) => {
                            if (err) {
                                console.error(err);
                            } else {
                                this.previousMovies = [...newMovies]; // Copy the new movies to the previousMovies array
                                this.appendMovies(newMovies); // append new movies into carousel
                            }
                        });
                    } else if (this.carouselID === 'carousel2' && carousel1.previousMovies.length > 0) {
                        this.appendMovies(carousel1.previousMovies); // append previous movies into carousel
                    }
                }
                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i],
                        box = item.getElementsByClassName('item__3d-frame')[0];
                    console.log(`Carousel ${this.carousel.id}: currIndex = ${this.currIndex}`);

                    relativeIndex = i - this.currIndex;
                    let rotationMultiplier = this.slideDirection == 'right' || 'left' ? 1 : -1;
                    if (Math.abs(relativeIndex) > 2) {
                        // For boxes further out, apply a smaller scale and larger rotation
                        item.style.transform = "scale(0.5)"; // change this value to adjust the size of further out boxes
                        box.style.transform = "perspective(1200px) rotateY(" + (rotationMultiplier * relativeIndex * 50) + "deg)";
                    } else if (Math.abs(relativeIndex) === 2) {
                        // For boxes two steps from center, apply medium scale and rotation
                        item.style.transform = "scale(0.7)"; // change this value to adjust the size of boxes two steps from center
                        box.style.transform = "perspective(1200px) rotateY(" + (rotationMultiplier * relativeIndex * 40) + "deg)";
                    } else if (Math.abs(relativeIndex) === 1) {
                        // For boxes next to the center, apply larger scale and smaller rotation
                        item.style.transform = "scale(0.9)"; // change this value to adjust the size of boxes next to center
                        box.style.transform = "perspective(1200px) rotateY(" + (rotationMultiplier * relativeIndex * 30) + "deg)";
                    } else {
                        // For the center box, no scale or rotation
                        item.style.transform = "scale(1)";
                        box.style.transform = "perspective(1200px)";
                    }

                    if (i === index) {
                        item.classList.add('carousel__slider__item--active');
                    } else {
                        item.classList.remove('carousel__slider__item--active');
                    }
                }

                this.slider.style.transform = "translate3d(" + (index * -this.width + window.innerWidth / 2 - this.width / 2) + "px, 0, 0)";

                if (index >= this.movieData.length - 20) {
                    this.getRandomMovies(++this.currentPage);
                }
                if (index >= this.movieData.length - 20 && this.currentPage < 500) {
                    this.getRandomMovies(++this.currentPage);
                }
            }


            timer() {
                clearInterval(this.interval);
                this.interval = setInterval(() => {
                    if (this.slideDirection === 'right') {
                        this.move(++this.currIndex);
                    } else {
                        this.move(--this.currIndex);
                    }
                }, this.intervalTime);
            }


            prev() {
                this.move(--this.currIndex);
                this.timer();
            }

            next() {
                    if (this.currIndex === this.items.length - 2 && this.carouselID === 'carousel1') {
                        // Load new movies for carousel1 when near the end
                        this.currentPage++;
                        this.getRandomMovies(this.currentPage);
                    } else if (this.currIndex === this.items.length - 2 && this.carouselID === 'carousel2' && carousel1.previousMovies.length > 0) {
                        // Load previous movies from carousel1 for carousel2 when near the end
                        this.appendMovies(carousel1.previousMovies);
                    }
                this.move(++this.currIndex);
                this.timer();
            }


            bindEvents() {
                window.addEventListener('resize', () => this.resize());
                this.prevBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.prev();
                });
                this.nextBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.next();
                });
            }

            getRandomMovies(page, carouselID, callback) {
                if (this.movieData.length >= this.numMoviesToLoad) {
                    // If enough movies have already been loaded, simply call the callback (if it exists) and return
                    if (callback) {
                        callback();
                    }
                    return;
                }
                // Generate a random page between 1 and 500 (as TMDb has a maximum of 500 pages)
                const randomPage = Math.floor(Math.random() * 500) + 1;

                getRandomTMDbMovieData(randomPage, (err, tmdbMovieData) => {
                    if (err) {
                        console.error("Error fetching TMDb movie data:", err);
                    } else {
                        this.movieData = tmdbMovieData; // Replace the old movies with the new ones
                        this.slider.innerHTML = ''; // Clear the old movies from the DOM
                        this.appendMovies(tmdbMovieData); // Add the new movies to the DOM
                        if (callback) {
                            callback();
                        }
                    }
                    // Hide the "loading..." message and show the movie list
                    $("#loading").hide();
                    $("#randomMovies").show();
                    let carouselData = carouselID === 1 ? tmdbMovieData.reverse() : tmdbMovieData;
                    // Add the fetched movies to the movieData array
                    this.movieData = this.movieData.concat(carouselData); console.log(`Carousel ${carouselID}: ${this.movieData.length} movies loaded.`);
                    // Get the carousel element
                    const carouselSlider = this.slider;

                    // Only take the first 50 movies
                    tmdbMovieData.slice(0, this.numMoviesToLoad).forEach((movie, index) => {
                        const carouselItem = createCarouselItem(movie);
                        carouselSlider.appendChild(carouselItem);
                        this.items = this.carousel.getElementsByClassName('carousel__slider__item');
                    });
                    if (this.slideDirection === 'right') {
                        this.currIndex = this.items.length - 3;
                    } else {
                        this.currIndex = 2;
                    }
                    if (callback) {
                        callback();
                    }
                    this.init();
                    this.timer();

                });
            }
        }

        let carousel1 = new Carousel(document.getElementById('carousel1'), 1, 'left', [], 0, 1, 20);
        let carousel2 = new Carousel(document.getElementById('carousel2'), 2, 'right', [], 19, 2, 20);
    };
})();