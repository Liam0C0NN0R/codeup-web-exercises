"use strict";

console.log ("hello from external JavaScript")

alert ("Welcome to my Website!");
var userColor = prompt( "what\'s your favorite color?");
alert ("Hey! " + userColor + " is mine too!");

//When the exercise asks you to use a number, instead use a prompt to ask the user for that number.
// Use an alert to show the results of each problem.
// Finally, commit the changes to your git repository, and push to GitHub.

//You have rented some movies for your kids: The little mermaid (for 3 days), Brother Bear (for 5 days, they love it), and Hercules (1 day, you don't know yet if they're going to like it). If price for a movie per day is $3, how much will you have to pay?

var userInput = prompt('how many movies are you renting?');
console.log('user entered: ' + userInput);
var userOwes = userInput * 3;
alert ('that\'ll be ' + userOwes + ' dollars a night!');
var userTotal = userOwes * prompt ('How many nights?');
alert ("your total is $" + userTotal );
console.log ('user total $' + userTotal);

// Suppose you're working as a contractor for 3 companies: Google, Amazon and Facebook, they pay you a different rate per hour. Google pays $400, Amazon $380, and Facebook $350. How much will you receive in payment for this week? You worked 10 hours for Facebook, 6 hours for Google and 4 hours for Amazon.

var Facebook = 350
var Google = 400
var Amazon = 380
var userInput = prompt('Which Company did you work for this week?', 'Facebook ' +  'Amazon ' +  'Google');
console.log( userInput);
var userTime = prompt ('How many hours?');
console.log('user worked ' + userTime + ' hours');
if (userInput === 'Facebook') {
    alert ('Nice! you earned $' + userTime * 350);
}
if (userInput === 'Google') {
    alert('Nice! you earned $' + userTime * 400);
}
if (userInput === 'Amazon') {
    alert('Nice! you earned $' + userTime * 380);
}

// A student can be enrolled in a class only if the class is not full and the class schedule does not conflict with her current schedule.
var userName = prompt ('what\'s your name')
console.log('username ')

var canEnroll = ('class is not full && class does not conflict with schedule');
var canNotEnroll = ('class is full && class conflicts with schedule');




// A product offer can be applied only if a person buys more than 2 items, and the offer has not expired. Premium members do not need to buy a specific amount of products.
var PremuimUser = prompt ('Are you a premium user?')
alert ('OK!')
var prodOffer = ('purchased >=2' && 'Not Expired');
var prodOfferPre = ('Not Expired');







