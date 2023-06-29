(function () {
    "use strict";
    const url = "https://admitted-fish-canidae.glitch.me//movies";

    // Movie poster function
    function getTMDbMovieData(title, callback) {
        var apiKey = tmdbKey;
        var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + encodeURIComponent(title);

        $.ajax({
            method: "GET",
            url: apiUrl,
            success: function (data) {
                if (data.results && data.results.length > 0) {
                    callback(null, data.results[0]);
                } else {
                    callback("No movie data found.");
                }
            },
            error: function () {
                callback("Error fetching movie data.");
            }
        });
    }

    $(window).on('load', function () {
        // When the page has loaded, hide the overlay
        setTimeout(function () {
            $('#loadingOverlay').fadeOut();
        }, 2000);
    });
    // Main function to execute when the document is ready
    $(document).ready(function () {
        // Display a "loading..." message and hide the movie list
        $("#loading").show();
        $("#movies").hide();

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

        // Function to get all movies and render them
        function getMyMovies() {
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    // Hide the "loading..." message and show the movie list
                    $("#loading").hide();
                    $("#myMovies").show();

                    // Generate the HTML for the movie list
                    var movies = data;
                    var html = "";

                    movies.forEach((movie) => {
                        html += `<a href="#" data-id="${movie.id}">
          <div class="movie-container">
            <img src="" class="movie-poster" alt="Movie Poster" />
            <div class="movie-info d-none">
                <h5>${movie.title}</h5>
                <p>Rating: ${movie.rating}</p>
                <p>Genre: ${movie.genre}</p>
                <button class="edit-movie-btn" data-id="${movie.id}">Edit</button>
                <button class="delete-movie-btn" data-id="${movie.id}">Delete</button>
            </div>
        </div>
    </a>`;

                        // Get the movie data from the TMDb API and set the poster
                        getTMDbMovieData(movie.title, (err, tmdbMovieData) => {
                            if (!err) {
                                var posterPath = "https://image.tmdb.org/t/p/w500" + tmdbMovieData.poster_path;
                                $(`a[data-id="${movie.id}"] .movie-poster`).attr("src", posterPath);
                            } else {
                                console.error("Error fetching TMDb movie data:", err);
                            }
                        });
                    });
                    $("#myMovies").html(html);

                    // Add click event listener for delete movie button
                    $(".delete-movie-btn").click(function () {
                        var movieId = $(this).data("id");

                        // Confirm that the user wants to delete the movie
                        if (confirm("Are you sure you want to delete this movie?")) {
                            // Make an AJAX request to delete the movie
                            // Disable the delete button
                            $(this).prop("disabled", true);
                            $.ajax({
                                method: "DELETE",
                                url: url + "/" + movieId,
                                success: function () {
                                    // Re-enable the delete button
                                    $(this).prop("disabled", false);
                                    // Remove the movie from the UI
                                    $(".movie[data-id='" + movieId + "']").remove();
                                    // Render all movies again
                                    getMyMovies();
                                },
                                error: function () {
                                    // Re-enable the delete button
                                    $(this).prop("disabled", false);
                                    alert("Error deleting movie");
                                },
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error fetching movies:", error);
                });
        }

        // Add click event listener for edit movie button
        $(document).on('click', '.edit-movie-btn', function () {
            // Disable the edit button
            $(this).prop("disabled", true);

            // Get the movie ID
            var movieId = $(this).data('id');

            // Get the movie data from the server
            $.ajax({
                method: 'GET',
                url: url + '/' + movieId,
                success: function (movie) {
                    // Enable the edit button
                    $(this).prop("disabled", false);
                    // Set the form values
                    $('#edit-movie-id').val(movie.id);
                    $('#edit-movie-title').val(movie.title);
                    $('#edit-movie-rating').val(movie.rating);

                    // Show the edit movie modal dialog
                    $('#editMovieModal').modal('show');
                }
            });

            // Add click event listener for save edited movie button
            $('#save-edited-movie-btn').click(function () {
                // Get the form data
                var formData = $('#editMovieForm').serialize();
                console.log(formData);

                // Send a PUT request to update the movie
                $.ajax({
                    type: 'PUT',
                    url: 'https://admitted-fish-canidae.glitch.me/movies/' + $('#editMovieForm input[name="id"]').val(),
                    data: formData,
                    success: function () {
                        // Get the movie data from the TMDb API and set the poster
                        getTMDbMovieData($('#addMovieForm input[name="title"]').val(), function (err, tmdbMovieData) {
                            if (!err) {
                                var posterPath = "https://image.tmdb.org/t/p/w500" + tmdbMovieData.poster_path;
                                movie.poster = posterPath;
                            } else {
                                console.error("Error fetching TMDb movie data:", err);
                            }

                            // Reload the movies list
                            getMyMovies();
                        });

                        // Close the modal
                        $('#editMovieModal').modal('hide');
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
            });
        });
        $(document).on("click", "#rotator a", function (e) {
            e.preventDefault();

            // Toggle the display of movie info
            $(this).find(".movie-info").toggleClass("d-none");

            // Hide other movie info
            $("#rotator a")
                .not(this)
                .find(".movie-info")
                .addClass("d-none");
        });
        $("#randomMoviesTab").click(function () {
            $("#myMovies").hide();
            $("#carousel-container").show();
        });

        $("#myMoviesTab").click(function () {
            $("#loading").show();
            $("#carousel-container").hide();
            $("#myMovies").show();
            getMyMovies();
        });

        // Add event listener for closing the edit movie modal and enable the edit movie button
        $('#editMovieModal .close').click(function () {
            $('#editMovieModal').modal('hide');
            $('.edit-movie-btn').prop("disabled", false);
        });

        // Add event listener for resetting the edit movie form when the modal is hidden
        $('#editMovieModal').on('hidden.bs.modal', function () {
            $('#editMovieForm')[0].reset();
            $('.edit-movie-btn').prop("disabled", false);
        });

        // Add event listener for the cancel button in the edit movie modal
        $('#editMovieModal #cancel-edited-movie-btn').click(function () {
            // Reset the form
            $('#editMovieForm')[0].reset();
            // Close the modal
            $('#editMovieModal').modal('hide');
            $('.edit-movie-btn').prop("disabled", false);
        });

        // Add event listener for the add movie button
        $('#add-movie-btn').click(function (e) {
            e.preventDefault();
            // Disable the submit button
            $(this).prop("disabled", true);
            console.log('add movie clicked');
            // Show the add movie modal form
            $('#addMovieModal').modal('show');
        });

        // Add event listener for the add movie button
        // Add event listener for the add movie button
        $('#submit-movie-btn').click(function (e) {
            e.preventDefault();
            // Disable the submit button
            $(this).prop("disabled", true);
            console.log('submit movie clicked');
            // Get the form data
            var formData = $('#addMovieForm').serialize();

            // Send a POST request to the server to add the movie
            $.ajax({
                type: 'POST',
                url: 'https://admitted-fish-canidae.glitch.me/movies',
                data: formData,
                success: function (response) {
                    // Enable the submit button
                    $('#submit-movie-btn').prop("disabled", false);
                    // Enable the add button
                    $('#add-movie-btn').prop("disabled", false);

                    // Add the new movie directly to your movies list in the browser here
                    // You may need to adjust this code based on how you are rendering your movies list
                    // For example:
                    var newMovie = $('<div>').text(response.title); // replace this with the actual HTML structure for a movie
                    $('#moviesList').append(newMovie);

                    // Close the modal
                    document.getElementById('addMovieModal').style.display = 'none';
                    getMyMovies(); // refresh your movie list
                },
                error: function (error) {
                    // Enable the submit button
                    $('#submit-movie-btn').prop("disabled", false);
                    // Enable the add button
                    $('#add-movie-btn').prop("disabled", false);
                    console.log(error);
                }
            });
        });


        // Add event listener for closing the add movie modal
        $('.modal-header .close').click(function () {
            $('#addMovieModal').modal('hide');
            // Enable the submit button
            $('#submit-movie-btn').prop("disabled", false);
            // Enable the add button
            $('#add-movie-btn').prop("disabled", false);
        });

        // Add event listener for resetting the add movie form when the modal is hidden
        $('#addMovieModal').on('hidden.bs.modal', function () {
            $('#addMovieForm')[0].reset();
            // Enable the submit button
            $('#submit-movie-btn').prop("disabled", false);
            // Enable the add button
            $('#add-movie-btn').prop("disabled", false);
        });

        // Add event listener for the cancel button in the add movie modal
        $('#cancel-movie-btn').click(function () {
            // Reset the form
            $('#addMovieForm')[0].reset();
            // Close the modal
            $('#addMovieModal').modal('hide');
            // Enable the submit button
            $('#submit-movie-btn').prop("disabled", false);
            // Enable the add button
            $('#add-movie-btn').prop("disabled", false);
        });


        window.addEventListener("DOMContentLoaded", function (e) {
            var rotateComplete = function (e) {
                target.style.webkitAnimationName = "";
                target.insertBefore(arr[arr.length - 1], arr[0]);
                setTimeout(function (el) {
                    el.style.webkitAnimationName = "rotator";
                }, 0, target);
            };

            var target = document.getElementById("rotator");
            var arr = target.getElementsByTagName("a");

            target.addEventListener("webkitAnimationEnd", rotateComplete, false);
            target.addEventListener("animationend", rotateComplete, false);
            target.addEventListener("MSAnimationEnd", rotateComplete, false);
        }, false);

    });

    // Get button:
    let mybutton = document.getElementById("myBtn");

// scrolls down from the top of the document, show the button
    window.onscroll = function () {
        scrollFunction()
    };

    function scrollFunction() {
        if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

// When the user clicks on the button, scroll to the top of the document
    function topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    $('#myBtn').click(topFunction);

    $(document).ready(function() {
        /* Add this script to handle showing and hiding of the headings when tabs are clicked */
        $("#randomMoviesTab").on("click", function() {
            $("#trending-heading").show();
            $("#my-movies-heading").hide();
            $(".sticky-tab").hide(); /* Hide the Add Movie button when Random Movies tab is clicked */
        });

        $("#myMoviesTab").on("click", function() {
            $("#trending-heading").hide();
            $("#my-movies-heading").show();
            $(".sticky-tab").show(); /* Show the Add Movie button when My Movies tab is clicked */
        });

        // Toggle the light and dark mode
        $("#toggle-switch").on("click", function() {
            var body = $("body");
            var switchImg = $(this);

            if (body.hasClass("light")) {
                body.removeClass("light");
                body.addClass("dark");
                switchImg.attr("src", "../img/switch-clipart-OFF.png");
            } else {
                body.removeClass("dark");
                body.addClass("light");
                switchImg.attr("src", "../img/light-switch-ON.png");
            }
        });
    });


    $(document).on('click', '.edit-movie-btn', function () {
        var btn = this; // capture the button that was clicked

        // Disable the edit button
        $(btn).prop("disabled", true);

        // Get the movie ID
        var movieId = $(this).data('id');

        // Get the movie data from the server
        $.ajax({
            method: 'GET',
            url: url + '/' + movieId,
            success: function (movie) {
                // Enable the edit button
                $(btn).prop("disabled", false);

                // Set the form values
                $('#edit-movie-id').val(movie.id);
                $('#edit-movie-title').val(movie.title);
                $('#edit-movie-rating').val(movie.rating);

                // Show the edit movie modal dialog
                document.getElementById('editMovieModal').classList.remove('hidden');
            },
            error: function () {
                // Enable the edit button
                $(btn).prop("disabled", false);
                alert("Error fetching movie");
            },
        });
    });

// Add click event listener for save edited movie button
    $('#save-edited-movie-btn').click(function () {
        // your code...

        // Close the modal
        document.getElementById('editMovieModal').classList.add('hidden');
    });

// Add event listener for closing the edit movie modal and enable the edit movie button
    document.querySelector('#editMovieModal .close').addEventListener('click', function () {
        document.getElementById('editMovieModal').classList.add('hidden');
        $('.edit-movie-btn').prop("disabled", false);
    });


    document.getElementById('add-movie-btn').addEventListener('click', function() {
        document.getElementById('addMovieModal').classList.remove('hidden');
    });

    document.querySelector('#addMovieModal .close').addEventListener('click', function() {
        document.getElementById('addMovieModal').classList.add('hidden');
    });
    // Show the modal
    document.getElementById('editMovieModal').classList.remove('hidden');

// Hide the modal
    document.getElementById('editMovieModal').classList.add('hidden');


    document.getElementById('toggle-switch').addEventListener('click', toggleMode);
    // $(document).ready(function() {
    //     /* Add this script to handle showing and hiding of the trending heading and Add Movie button */
    //     $("#randomMoviesTab").on("click", function() {
    //         $("h2").show(); /* Show the heading when Random Movies tab is clicked */
    //         $(".sticky-tab").hide(); /* Hide the Add Movie button when Random Movies tab is clicked */
    //     });
    //
    //     $("#myMoviesTab").on("click", function() {
    //         $("h2").hide(); /* Hide the heading when My Movies tab is clicked */
    //         $(".sticky-tab").show(); /* Show the Add Movie button when My Movies tab is clicked */
    //     });
    //
    //     // Toggle the light and dark mode
    //     $("#toggle-switch").on("click", function() {
    //         var body = $("body");
    //         var switchImg = $(this);
    //
    //         if (body.hasClass("light")) {
    //             body.removeClass("light");
    //             body.addClass("dark");
    //             switchImg.attr("src", "../img/switch-clipart-OFF.png");
    //         } else {
    //             body.removeClass("dark");
    //             body.addClass("light");
    //             switchImg.attr("src", "../img/light-switch-ON.png");
    //         }
    //     });
    // });



})();