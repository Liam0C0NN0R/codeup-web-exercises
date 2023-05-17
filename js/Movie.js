(function() {
    "use strict";
    window.onload = function() {
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
            constructor(carouselElement, initialPage) {
                this.carousel = carouselElement;
                this.slider = this.carousel.getElementsByClassName('carousel__slider')[0];
                if(this.carousel !== null) {
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
                this.currIndex = 0;
                this.interval = null;
                this.intervalTime = 4000;
                this.getRandomMovies(this.currentPage, () => {
                    this.init();
                    this.timer();
                });
                this.bindEvents();
                // this.observer = new IntersectionObserver(this.handleIntersection, {
                //     root: this.carousel,
                //     rootMargin: '0px',
                //     threshold: 0.1
                // });
                // this.init();
            }

            init() {
                setTimeout(() => {
                    this.resize();
                    this.move(Math.floor(this.items.length / 2));
                }, 300);
                // this.getRandomMovies(this.currentPage, () => {
                //     this.bindEvents();
                //     this.timer();
                // });

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
                if (index < 0) index = this.items.length - 1;
                if (index >= this.items.length) index = 0;
                this.currIndex = index;

                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i],
                        box = item.getElementsByClassName('item__3d-frame')[0];
                    if (i == (index - 1)) {
                        item.classList.add('carousel__slider__item--active');
                        box.style.transform = "perspective(1200px)";
                    } else {
                        item.classList.remove('carousel__slider__item--active');
                        box.style.transform = "perspective(1200px) rotateY(" + (i < index ? 40 : -40) + "deg)";
                    }
                }

                this.slider.style.transform = "translate3d(" + (index * -this.width + window.innerWidth / 2) + "px, 0, 0)";
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
                    this.move(++this.currIndex);
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


            // handleIntersection(entries, observer) {
            //     entries.forEach(entry => {
            //         if (entry.isIntersecting) {
            //             // If the item is visible, load the image
            //             const imgElement = entry.target.getElementsByClassName('item__3d-frame__box--front')[0];
            //             imgElement.style.backgroundImage = `url(${imgElement.dataset.src})`;
            //             observer.unobserve(entry.target);  // Stop observing the item
            //         }
            //     });
            // }


            getRandomMovies(page, callback) {
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
                    // Add the fetched movies to the movieData array
                    this.movieData = this.movieData.concat(tmdbMovieData);

                    // Get the carousel element
                    const carouselSlider = this.slider;

                    // Only take the first 50 movies
                    tmdbMovieData.slice(0, 50).forEach((movie) => {
                        console.log("movie.poster_path:", movie.poster_path);  // Debug line
                        const posterPath = movie.poster_path ?
                            "https://image.tmdb.org/t/p/w500" + movie.poster_path :
                            "img/TMDB logo1.svg";
                        console.log("posterPath:", posterPath);


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

                    });
                    if (callback) {
                        callback();
                    };
                    this.init();
                    // this.currIndex = this.items.length - 1;
                    // if (page === 1) {
                    //     this.bindEvents();
                    // }
                });
            }
        }

        let carousel1 = new Carousel(document.getElementById('carousel1'), 1);
        let carousel2 = new Carousel(document.getElementById('carousel2'), 2);

    };
})();