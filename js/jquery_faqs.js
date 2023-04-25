"use strict"
// function myFunction() {
//     var element = document.getElementById("myDIV");
//     element.classList.add("mystyle");


$('#button2').click(function () {
    $('ul').each(function () {
        $(this).children().last().toggleClass('highlight');
    })
});
$("#button1").click(function () {
    $("dd").toggleClass("invisible");
});
$("dt").click(() => {
    $('this').toggleClass('highlight');
});

$('h3').click(function () {
    $(this).next('ul').css('font-weight', 'bold');
});

$('li').click(function () {
    $(this).parent().children().first().css('color', 'blue');
});
$('#button3').click(function () {
    //find target img src
    var $targetSrc = $('#box2').find('img').attr('src');
    console.log("target: " + $targetSrc);

    //find this img source
    var $imgSrc = $('#box1').find('img').attr('src');
    console.log("this: " + $imgSrc);

    //replace target img with this img
    $('#box2').find('img').attr('src', $imgSrc);

    //replace this img with target img
    $('#box1').find('img').attr('src', $targetSrc);
});

$('#button4').click(function () {
    //get random number
    let num = randomNumber(1, 2);
    console.log("random num: " + num);

    //if num == 1 then swap left
    if (num === 1) {
        let $targetSrc = $('#box1').find('img').attr('src');
        console.log("target: " + $targetSrc);
        let $imgSrc = $('#box2').find('img').attr('src');
        console.log("this: " + $imgSrc);
        $('#box1').find('img').attr('src', $imgSrc);
        $('#box2').find('img').attr('src', $targetSrc);
    } else {
        let $targetSrc = $('#box3').find('img').attr('src');
        console.log("target: " + $targetSrc);
        let $imgSrc = $('#box2').find('img').attr('src');
        console.log("this: " + $imgSrc);
        $('#box3').find('img').attr('src', $targetSrc);
        $('#box2').find('img').attr('src', $imgSrc);
    }
});

$('#button5').click(function () {
    let $targetSrc = $('#box2').find('img').attr('src');
    console.log("target: " + $targetSrc);
    let $imgSrc = $('#box3').find('img').attr('src');
    console.log("this: " + $imgSrc);
    $('#box2').find('img').attr('src', $imgSrc);
    $('#box3').find('img').attr('src', $targetSrc);

});

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};