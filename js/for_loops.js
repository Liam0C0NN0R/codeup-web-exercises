'use strict';

/* program to generate a multiplication table
upto a range */

// // take number input from the user
// var number = parseInt(prompt('Enter an integer: '));
//
// // take range input from the user
// var range = parseInt(prompt('Enter a range: '));
// function showMultiplicationTable() {
// //creating a multiplication table
//     for (let i = 1; i <= range; i++) {
//         console.log("%d * %d = %d \n", number, i, i * number);
//     }
// }
// showMultiplicationTable()
//
 for (let i = 1; i <=10; i++){
var numRandom = Math.floor(Math.random() * (200 - 20) + 20);
    if (numRandom % 2 === 0)
        console.log(numRandom + " is even");
      else {
         (numRandom % 2 !== 0)
         console.log(numRandom + " is odd");
     }
}


for(var i = 0; i < 10; i++){
    var str = "";
    for(var j = 0; j < i; j++){
        str = str + i;
    }
    console.log(str);
}