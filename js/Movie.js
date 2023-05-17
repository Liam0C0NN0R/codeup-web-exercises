(function() {
    "use strict";

    class Carousel {
        constructor(carouselElement, initialPage) {
            this.carousel = carouselElement;
            this.slider = this.carousel.getElementsByClassName('carousel__slider')[0];
            this.items = this.carousel.getElementsByClassName('carousel__slider__item');
            this.prevBtn = this.carousel.getElementsByClassName('carousel__prev')[0];
            this.nextBtn = this.carousel.getElementsByClassName('carousel__next')[0];
            this.movieData = [];
            this.currentPage = initialPage;
            this.width = null;
            this.height = null;
            this.totalWidth = null;
            this.margin = 20;
            this.currIndex = 0;
            this.interval = null;
            this.intervalTime = 4000;
            this.init();
        }
        init() {
            this.resize();
            this.move(Math.floor(this.items.length / 2));
            this.bindEvents();
            this.timer();
            this.getRandomMovies(this.currentPage);
        }
        resize() {
            this.width = Math.max(window.innerWidth * .25, 275);
            this.height = window.innerHeight * .5;
            this.totalWidth = this.width * this.items.length;

            this.slider.style.width = this.totalWidth + "px";

            for(let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                item.style.width = (this.width - (this.margin * 2)) + "px";
                item.style.height = this.height + "px";
            }
        }

    function move(index) {

        if(index < 0) index = items.length - 1;
        if(index >= items.length) index = 0;
        currIndex = index;

        for(var i = 0; i < items.length; i++) {
            let item = items[i],
                box = item.getElementsByClassName('item__3d-frame')[0];
            if(i == (index - 1)) {
                item.classList.add('carousel__slider__item--active');
                box.style.transform = "perspective(1200px)";
            } else {
                item.classList.remove('carousel__slider__item--active');
                box.style.transform = "perspective(1200px) rotateY(" + (i < index ? 40 : -40) + "deg)";
            }
        }

        slider.style.transform = "translate3d(" + (index * -width + window.innerWidth / 2) + "px, 0, 0)";
        if(index >= movieData.length - 10) {
            getRandomMovies(++currentPage);
        }
    }

    function timer() {
        clearInterval(interval);
        interval = setInterval(() => {
            move(++currIndex);
        }, intervalTime);
    }

    function prev() {
        move(--currIndex);
        timer();
    }

    function next() {
        move(++currIndex);
        timer();
    }


    function bindEvents() {
        window.onresize = resize;
        prevBtn.addEventListener('click', () => { prev(); });
        nextBtn.addEventListener('click', () => { next(); });
    }

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
    function getRandomMovies(page) {
        // Generate a random page between 1 and 500 (as TMDb has a maximum of 500 pages)
        var randomPage = Math.floor(Math.random() * 500) + 1;

        getRandomTMDbMovieData(randomPage, (err, tmdbMovieData) => {
            if (err) {
                console.error("Error fetching TMDb movie data:", err);
                return;
            }

            // Hide the "loading..." message and show the movie list
            $("#loading").hide();
            $("#randomMovies").show();
            // Add the fetched movies to the movieData array
            movieData = movieData.concat(tmdbMovieData);

            // Get the carousel element
            var carouselSlider = document.getElementsByClassName('carousel__slider')[0];

            // Only take the first 50 movies
            tmdbMovieData.slice(0, 50).forEach((movie) => {
                var posterPath = "https://image.tmdb.org/t/p/w500" + movie.poster_path;

                // Create a new carousel item
                var carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel__slider__item');

                // Create a new 3D frame
                var frame = document.createElement('div');
                frame.classList.add('item__3d-frame');
                carouselItem.appendChild(frame);

                // Create a new front box with the movie poster as the background image
                var frontBox = document.createElement('div');
                frontBox.classList.add('item__3d-frame__box', 'item__3d-frame__box--front');
                frontBox.style.backgroundImage = `url(${posterPath})`;
                frame.appendChild(frontBox);

                // Create a new left box
                var leftBox = document.createElement('div');
                leftBox.classList.add('item__3d-frame__box', 'item__3d-frame__box--left');
                frame.appendChild(leftBox);

                // Create a new right box
                var rightBox = document.createElement('div');
                rightBox.classList.add('item__3d-frame__box', 'item__3d-frame__box--right');
                frame.appendChild(rightBox);

                // Append the carousel item to the carousel
                carouselSlider.appendChild(carouselItem);
            });
            if(page === 1) { // Only call init() the first time
                init();
            }
        });
    }
    var carousel1 = new Carousel(document.getElementById('carousel1'), 1);
    var carousel2 = new Carousel(document.getElementById('carousel2'), 2);


})();