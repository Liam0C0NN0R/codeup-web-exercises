"use strict";

$(function () {
    $.ajax("../data/blog.json").done(function(data){
        console.log(data)
        let htmlStr = '';
        data.forEach(function (post){
            htmlStr += "<artival>";
            htmlStr += "<h2>" + post.title + "</h2>";
            htmlStr += "<h5>"+ post.date + "</h5>";
            htmlStr += "<p>"+ post.content + "</p>>";
            htmlStr += "<ul>";
            post.categories.forEach(function (category){
                htmlStr += "<li>" + category + "</li>";
            });
            htmlStr += "</ul>"
            htmlStr += "</artival>"
        });
        $("#posts").html(htmlStr);
    });
});