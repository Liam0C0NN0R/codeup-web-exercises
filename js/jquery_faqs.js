"use strict"
function myFunction() {
    var element = document.getElementById("myDIV");
    element.classList.add("mystyle");
}
// $('#fAQ').addClass("invisible");

$("dd").addClass(function (index, currentClass) {
    var addedClass;
    if (currentClass === null) {
        addedClass = "invisible";
        $("p").text("There is one green div");
    }
    return addedClass;
});