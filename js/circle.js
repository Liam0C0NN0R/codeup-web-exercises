(function() {
    "use strict";

    // create a circle object
    var circle = {
        radius: 5,

        getArea: function areaOfCircle (radius, pi) {
            return Math.PI * Math.pow(circle.radius,2)
            // TODO: return the proper value
        },

        logInfo: function (doRounding) {
            // TODO: complete this method.
        Math.round(Math.PI * Math.pow(circle.radius, 2))
            // If doRounding is true, round the result to the nearest integer.
            // Otherwise, output the complete value

            console.log("Area of a circle with radius: " + this.radius + ", is: " + Math.round(circle.getArea()));
        }
    };
console.log(circle.getArea())
    // log info about the circle
    console.log("Raw circle information");
    circle.logInfo(true);
    console.log("Circle information rounded to the nearest whole number");
    circle.logInfo(true);

    console.log("=======================================================");
    // TODO: Change the radius of the circle to 5.

    // log info about the circle
    console.log("Raw circle information");
    circle.logInfo(false);
    console.log("Circle information rounded to the nearest whole number");
    circle.logInfo(true);
})();