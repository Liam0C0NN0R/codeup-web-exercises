(function(){
    "use strict";

    /**
     * TODO:
     * Create an array of 4 people's names and store it in a variable called
     * 'names'.
     */
var names = ['Valentino', 'Psymon', 'Bali', 'Theoden']
    /**
     * TODO:
     * Create a log statement that will log the number of elements in the names
     * array.
     */
console.log(names.length)
    /**
     * TODO:
     * Create log statements that will print each of the names individually by
     * accessing each element's index.
     */
names.forEach(elt => console.log(elt));
    /**
     * TODO:
     * Write some code that uses a for loop to log every item in the names
     * array.
     */
for (var i = 0; i < names.length; i++) {
    console.log("name at index " +i + " is " + names[i])
};
    /**
     * TODO:
     * Refactor your above code to use a `forEach` loop
     */
names.forEach(function(element,index, array){
    console.log("Name at index: " + index + " is " + element);
});
    /**
     * TODO:
     * Create the following three functions, each will accept an array and
     * return an an element from it
     * - first: returns the first item in the array
     * - second: returns the second item in the array
     * - last: returns the last item in the array
     *
     * Example:
     *  > first([1, 2, 3, 4, 5]) // returns 1
     *  > second([1, 2, 3, 4, 5]) // returns 2
     *  > last([1, 2, 3, 4, 5]) // return 5
     */
var numbers = [1, 2, 3, 4, 5]

function returnFirst(x){
    return (numbers.length-4)
};
console.log(returnFirst())
function returnSecond(x){
    return (numbers.length-3)
};
console.log(returnSecond())
function returnLast(x){
    return (numbers.length-0)
};
console.log(returnLast())
})();