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

        class Carousel {
            constructor(carouselElement, initialPage, slideDirection, carouselItems, startingIndex, carouselID, numMoviesToLoad) {
                this.carousel = carouselElement;
                this.previousMovies = []
                this.carouselID = carouselID;
                this.slideDirection = slideDirection;
                this.currIndex = startingIndex;
                this.numMoviesToLoad = numMoviesToLoad;
                this.startingIndex = startingIndex;
                this.slider = this.carousel.getElementsByClassName('carousel__slider')[0];
                if (this.carousel !== null) {
                    const carouselSlider = this.carousel.getElementsByClassName('carousel__slider')[0];
                }
                this.items = this.carousel.getElementsByClassName('carousel__slider__item');
                this.prevBtn = this.carousel.querySelector('.carousel__prev');
                this.nextBtn = this.carousel.querySelector('.carousel__next');
                this.movieData = [];
                this.currentPage = initialPage;
                this.width = null;
                this.height = null;
                this.totalWidth = null;
                this.margin = 20;
                // this.currIndex = 0;
                this.interval = null;
                this.intervalTime = 4000;
                this.getRandomMovies(this.currentPage, carouselID,() => {
                    // this.init();
                    // this.timer();
                });
                this.bindEvents();
                // this.observer = new IntersectionObserver(this.handleIntersection, {
                //     root: this.carousel,
                //     rootMargin: '0px',
                //     threshold: 0.1
                // });
                // this.init();
            }
            loadNewMovies(movies) {
                // Instead of resetting the items array, you push the new movies
                this.items.push(...movies);
                // If this is carousel1, store these movies for carousel2 to load later
                if (this.carouselId === 'carousel1') {
                    this.previousMovies = [...movies];
                }
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
                // this.carousel.style.width = this.totalWidth + "px";
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
                }
                // If index is greater or equal to the length of the array, wrap it around to the beginning
                else if (index >= this.items.length) {
                    index = 0;
                }
                this.currIndex = index;
                let relativeIndex;
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
                        // Increment the rotationCount each time move() is called
                        this.rotationCount++;

                        // If the carousel has rotated 50 times, stop the rotation
                        if (this.rotationCount === 50) {
                            clearInterval(this.interval);
                            console.log("Carousel " + this.slideDirection + " has rotated 50 times");
                        }
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
                    // If enough movies have already been loaded, simply call the callback
                    // (if it exists) and return
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
                        return;
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
                        const posterPath = movie.poster_path ?
                            "https://image.tmdb.org/t/p/w500" + movie.poster_path :
                            "img/TMDB logo1.svg";


                        const carouselItem = document.createElement('div');
                        carouselItem.classList.add('carousel__slider__item');

                        const frame = document.createElement('div');
                        frame.classList.add('item__3d-frame');
                        carouselItem.appendChild(frame);

                        const frontBox = document.createElement('div');
                        frontBox.classList.add('item__3d-frame__box', 'item__3d-frame__box--front');
                        frontBox.style.backgroundImage = `url(${posterPath})`;
                        frontBox.style.backgroundSize = 'cover';
                        // frontBox.style.backgroundColor = '#ccc';
                        frame.appendChild(frontBox);

                        const leftBox = document.createElement('div');
                        leftBox.classList.add('item__3d-frame__box', 'item__3d-frame__box--left');
                        frame.appendChild(leftBox);

                        const rightBox = document.createElement('div');
                        rightBox.classList.add('item__3d-frame__box', 'item__3d-frame__box--right');
                        frame.appendChild(rightBox);

                        carouselSlider.appendChild(carouselItem);
                        // this.observer.observe(carouselItem);
                        this.items = this.carousel.getElementsByClassName('carousel__slider__item');
                        if (index === 49) {
                            console.log("All 50 movies have been loaded for carousel " + carouselID);
                        }
                        console.log(`Carousel ${carouselID}: ${this.movieData.length} movies loaded.`);
                        if (index === this.numMoviesToLoad - 1) {
                            console.log(`All ${this.numMoviesToLoad} movies have been loaded for carousel ` + carouselID);

                        }



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

        let carousel1 = new Carousel(document.getElementById('carousel1'), 1, 'left', 20, 0, 1, 20);
        let carousel2 = new Carousel(document.getElementById('carousel2'), 2, 'right', 19, 19, 2, 20);
    };
})();