(function(){
    "use strict";

    var planetsString = "Mercury|Venus|Earth|Mars|Jupiter|Saturn|Uranus|Neptune";
    var planetsArray = planetsString.split("|")

    /**
     * TODO:
     * Convert planetsString to an array, and save it in a variable named
     * planetsArray.
     * console.log planetsArray to check your work
     */

    console.log(planetsArray);

    /**
     * TODO:
     * Create a string with <br> tags between each planet. console.log() your
     * results. Why might this be useful?
     */
    var planetsStringBreak = planetsArray.join("<br>");
    document.body.innerHTML += planetsStringBreak;
    console.log(planetsStringBreak);
    /**
     * BONUS:
     * Create another string that would display your planets in an undordered
     * list. You will need an opening AND closing <ul> tags around the entire
     * string, and <li> tags around each planet.
     */
    var list = document.createElement('ul');
    planetsArray.forEach(function (planet) {
        var li = document.createElement('li');
        li.textContent = planet;
        list.appendChild(li);
    });
    console.log(list)
})();


var waterBottle = {
    size: '64oz',
    color: 'white/black',
    stickers: 'hella',
    reusable: true,
    dishwasherSafe: false

}
console.log(waterBottle)
console.log('my waterbottle is ' + waterBottle.color)