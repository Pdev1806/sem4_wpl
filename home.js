let map;
let marker;

// IIFE
(function(){
    console.log("Homepage Loaded");
})();

// Function Constructor
const multiply = new Function("x","y","return x*y");

// Closure
function visitCounter(){
    let count = 0;
    return function(){
        count++;
        return count;
    }
}

const counter = visitCounter();

// Rest Parameter
function totalPrices(){
    let sum = 0;
    for(let i=0;i<arguments.length;i++){
        sum += arguments[i];
    }
    return sum;
}

// Spread
function highestPrice(){
    const prices=[4999,3499,6999];
    console.log("Highest Price:", Math.max.apply(null, prices));
}

// this + call/apply/bind
function greet(city){
    return this.name + " from " + city;
}

const userObj = { name:"Customer" };

document.addEventListener("DOMContentLoaded", function () {

    // Closure usage
    document.getElementById("visitCount").innerText =
    "Visits: " + counter();

    // Function constructor usage
    console.log("Multiply:", multiply(3,4));

    // Rest + Spread usage
    console.log("Total:", totalPrices(4999,3499,6999));
    highestPrice();

    // call/apply/bind usage
    console.log(
        greet.call(userObj,"Mumbai"),
        greet.apply(userObj,["Delhi"]),
        greet.bind(userObj,"Pune")()
    );

    const username = localStorage.getItem("username");

    if (username) {
        const welcomeText = document.createElement("div");
        welcomeText.innerText = "Welcome, " + username;

        welcomeText.style.position = "absolute";
        welcomeText.style.top = "20px";
        welcomeText.style.right = "20px";
        welcomeText.style.color = "white";
        welcomeText.style.fontSize = "1rem";
        welcomeText.style.fontWeight = "bold";

        document.querySelector(".header").appendChild(welcomeText);
    }

    const modal = document.getElementById("mapModal");
    const openBtn = document.getElementById("locationBtn");
    const closeBtn = document.getElementById("closeMap");

    openBtn.addEventListener("click", function () {

        if (!navigator.geolocation) {
            alert("Location Services Disabled");
            return;
        }

        navigator.geolocation.getCurrentPosition(function (position) {

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const altitude = position.coords.altitude;
            const accuracy = position.coords.accuracy;

            alert(
                "Altitude: " + (altitude !== null ? altitude + " meters" : "Not available") +
                "\nAccuracy: " + accuracy + " meters"
            );

            showLocationText(lat, lng);

            modal.style.display = "flex";
            loadMap(lat, lng);

        });

    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

});

function loadMap(lat, lng) {

    if (map) {
        map.remove();
    }

    map = L.map("map").setView([lat, lng], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const targetSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="transparent"/>
  <circle cx="50" cy="50" r="40" fill="red"/>
  <circle cx="50" cy="50" r="20" fill="white"/>
  <circle cx="50" cy="50" r="5" fill="black"/>
</svg>
`;

    const customIcon = L.divIcon({
        html: targetSVG,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    marker = L.marker([lat, lng], {
        draggable: true,
        icon: customIcon
    }).addTo(map);

    marker.bindPopup("Welcome to my current coordinates!").openPopup();

    map.on("click", function (e) {
        marker.setLatLng(e.latlng);
    });
}

function showLocationText(lat, lng) {

    let existing = document.getElementById("currentLocationText");

    if (!existing) {
        const textDiv = document.createElement("div");
        textDiv.id = "currentLocationText";
        textDiv.style.fontSize = "0.85rem";
        textDiv.style.color = "white";

        document.querySelector(".header").appendChild(textDiv);
        existing = textDiv;
    }

    existing.innerText = "Location: " + lat.toFixed(5) + ", " + lng.toFixed(5);
}