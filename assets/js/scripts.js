/* jQuery -----------------------------------------------------------*/
$(document).ready(function () {
    /* Close navbar on click sub-menu */
    $(".navbar-nav .nav-link").on("click", function () {
        $(".navbar-collapse").collapse("hide");
    });
    /* BS tooltip */
    $("body").tooltip({ selector: "[data-toggle=tooltip]" });
    //show more weather widget
    $(".more-weather-link").click(function () {
        $("#more-weather").slideToggle(300);
    });
    $(".less-weather-link").click(function () {
        $("#more-weather").slideToggle(300);
    });
    /**
     * Ppens the take notes section and changes text depending on text
     */
    $(".open-notes").on("click", function () {
        $("#take-notes").toggleClass("opened");
        if ($(this).text() == "Open notes") {
            $(this).text("Close notes");
        } else {
            $(this).text("Open notes");
        }
    });
    /**
     * Moves the weather widget when reach 992px wide
     */
    let weatherWidget = $(".dublin-weather-outer");
    // on page load
    if ($(window).width() > 991) {
        $(weatherWidget).appendTo(".navbar");
    }
    // on window resize
    $(window).resize(function () {
        if ($(window).width() > 991) {
            $(weatherWidget).appendTo(".navbar");
        } else {
            $(weatherWidget).prependTo(".topbar .row > .col-9");
        }
    });
});
/** END JQUERY */

/** -----------------------------------------------------------
 * WEATHER API FUNCTIONS
 */
const dublinCity = 2964574;
const apiKey = "4adecede8cc646766529fd7932ba0555";
let tempUnits = "units=metric";
let cityInput = document.getElementById("city");
//set cityCountry to the inputted value
let cityCountry = document.getElementById("city").value;

//API url forecast for Dublin by coordinates
const baseURLByCoords = `https://api.openweathermap.org/data/2.5/onecall?lat=53.350140&lon=-6.264155&${tempUnits}&exclude=minutely,hourly&appid=4adecede8cc646766529fd7932ba0555`;

let baseURL;

// Simulate button click on enter
cityInput.addEventListener("keydown", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("get-weather").click();
    }
});

// without type
function getData(callBack) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callBack(JSON.parse(this.responseText));
        }
    };

    xhr.open("GET", baseURL);
    xhr.send();
}

// Write to DOM on click
function writeToDocument() {
    cityCountry = document.getElementById("city").value;
    // got the following regex to check if all numbers from https://www.w3resource.com/javascript/form/all-numbers.php
    const numbers = /^[0-9]+$/;
    if (cityCountry.match(numbers)) {
        cityCountry = Number(cityCountry);
    }
    if (cityCountry == "") {
        alert("Nothing submitted");
    } else if (typeof cityCountry == "string") {
        baseURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityCountry}&${tempUnits}&appid=${apiKey}`;
        getData(function (data) {
            //console.dir(data);

            let cityEl = document.getElementById("dynamic-weather-data");
            let cityName = data.name;
            let cityWeath = data.weather[0].main;
            let weathIcon = data.weather[0].icon;
            let weathTemp = Math.round(data.main.temp);
            let feelsTemp = Math.round(data.main.feels_like);
            cityEl.innerHTML = `<div class="container">
                                    <div class="row">
                                        <div class="col city-name">Weather for ${cityName}</div>
                                    </div>
                                    <div class="row divider-b pb-2">
                                        <div class="col-5 weather-icon">
                                            <img src="http://openweathermap.org/img/wn/${weathIcon}@2x.png" alt="weather icon" />
                                            <div class="weather-text">${cityWeath}</div>
                                        </div>
                                        <div class="col-7">
                                            <div class="temp">${weathTemp}&#8451;</div>
                                            <div class="feels-like">Feels like ${feelsTemp}&#8451;</div>
                                        </div>
                                    </div>
                                </div>`;
        });
    } else if (typeof cityCountry == "number") {
        alert("That is a number, please type a city");
    } else if (typeof cityCountry == "undefined") {
        alert("Nothing submitted");
    }
}

// Get date and Dublin weather on page load
document.addEventListener("DOMContentLoaded", function () {
    //Comment out displayDubWeath function to disable api calls on page load
    //displayDubWeath();
    displayDate();
});

function displayDubWeath() {
    let dubEl = document.getElementById("dublin-weather-data");
    let dubElFore = document.getElementById("dublin-forecast-data");
    //Set api url to city by coords
    baseURL = baseURLByCoords;
    getData(function (data) {
        let dubName = "Dublin";
        let dubWeath = data.current.weather[0].main;
        let dubIcon = data.current.weather[0].icon;
        let dubTemp = Math.round(data.current.temp);
        let feelsTemp = Math.round(data.current.feels_like);
        dubEl.innerHTML = `<div class="container">
                                <div class="row">
                                    <div class="col city-name">Weather for ${dubName}</div>
                                </div>
                                <div class="row weather-mobile">
                                    <div class="col-4 col-sm-5 weather-icon text-center">
                                        <img src="http://openweathermap.org/img/wn/${dubIcon}@2x.png" alt="weather icon" />
                                        <div class="d-none d-sm-block">${dubWeath}</div>
                                    </div>
                                    <div class="col-4 weather-text d-sm-none">
                                        <div class="pt-3 pl-1">${dubWeath}</div>
                                    </div>
                                    <div class="col-4 col-sm-7">
                                        <div class="temp">${dubTemp}&#8451;</div>
                                        <div class="feels-like d-none d-sm-block">Feels like ${feelsTemp}&#8451;</div>
                                    </div>
                                </div>
                            </div>`;
        //Forecast data 1 day. Need to skip over [0] as is also today
        let forecastWeath = data.daily[1].weather[0].main;
        let forecastIcon = data.daily[1].weather[0].icon;
        let forecastTemp = Math.round(data.daily[1].temp.day);
        //2 days
        let forecastWeath2 = data.daily[2].weather[0].main;
        let forecastIcon2 = data.daily[2].weather[0].icon;
        let forecastTemp2 = Math.round(data.daily[2].temp.day);
        //convert unix time to readable - reference https://coderrocketfuel.com/article/convert-a-unix-timestamp-to-a-date-in-vanilla-javascript
        const unixTimestamp = data.daily[2].dt;
        const milliseconds = unixTimestamp * 1000;
        const dateObject = new Date(milliseconds);
        const humanDateFormat = dateObject.toLocaleString("en-US", {
            weekday: "long",
        });

        dubElFore.innerHTML = `<div class="container">
                                <div class="row">
                                    <div class="col-4 forecast">
                                        <span>Tomorrow</span>
                                    </div>
                                    <div class="col-2 forecast-icon">
                                        <img src="http://openweathermap.org/img/wn/${forecastIcon}@2x.png" alt="weather icon" />
                                    </div>
                                    <div class="col-4 weather-text forecast">
                                        ${forecastWeath}
                                    </div>
                                    <div class="col-2">
                                        <div class="temp-forcast">${forecastTemp}&#8451;</div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-4 forecast">
                                        <span>${humanDateFormat}</span>
                                    </div>
                                    <div class="col-2 forecast-icon">
                                        <img src="http://openweathermap.org/img/wn/${forecastIcon2}@2x.png" alt="weather icon" />
                                    </div>
                                    <div class="col-4 weather-text forecast">
                                        ${forecastWeath2}
                                    </div>
                                    <div class="col-2">
                                        <div class="temp-forcast">${forecastTemp2}&#8451;</div>
                                    </div>
                                </div>
                            </div>`;
    });
}
// get and format current date
function displayDate() {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    let dateEl = document.getElementById("current-date");
    let now = new Date();
    let formatted_date =
        now.getDate() +
        " " +
        months[now.getMonth()] +
        ' <span class="d-none d-sm-inline">' +
        now.getFullYear() +
        "</span>";
    dateEl.innerHTML = formatted_date;
}
/**
 * END WEATHER API FUNCTIONS
 */

/** -----------------------------------------------------------
 *  NOTE TAKING FUNCTIONS
 */

let submitButton = document.getElementById("submit-note");
let userInput = document.getElementById("note-input");
let list = document.getElementById("notes-list");
/**
 *  Simulates button click on enter
 */

userInput.addEventListener("keydown", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        event.preventDefault();
        // Trigger the button element with a click
        submitButton.click();
    }
});

/**
 * Get stored list items if they exist on page load
 */
let currentList = localStorage.getItem("listItem");
if (currentList) {
    list.innerHTML = currentList;
}

/**
 *  @description gets the input value from notes input, saves it as a new list item and saves the list to Local Storage
 */
function addToList() {
    let newItemValue = document.getElementById("note-input").value;
    //check for required field message
    let requiredMsg = document.querySelector("#note-item-required");

    // if there is nothing in input
    if (newItemValue == null || newItemValue == "") {
        //if required field message is already there
        if (requiredMsg == null) {
            requiredMsg = document.createElement("div");
            requiredMsg.id = "note-item-required";
            requiredMsg.innerText = "The input is empty.";

            let reqWrapper = document.getElementById("note-input-wrapper");
            reqWrapper.appendChild(requiredMsg);
        }
    } else {
        //create li element
        let newItem = document.createElement("li");
        newItem.className = "note-item";
        let newItemContent = document.createTextNode(newItemValue);
        // delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "X";
        deleteBtn.className = "del-btn";
        // Append text and elements inside li
        newItem.appendChild(newItemContent);
        newItem.appendChild(deleteBtn);
        list.appendChild(newItem);

        //clear user input field and remove required message
        userInput.value = "";
        if (requiredMsg) {
            requiredMsg.remove();
        }
        //save list in local storage
        localStorage.setItem("listItem", list.innerHTML);
    }
}

/** Deletes individual list item
 *
 */
document.querySelector("body").addEventListener("click", function (event) {
    if (event.target.className === "del-btn") {
        //console.log(event.target.parentNode);
        //delete parent node(the li)
        event.target.parentNode.remove();
        //update the local storage with new list
        localStorage.setItem("listItem", list.innerHTML);
    }
});

/**
 * @description Clears all notes from the list
 */
function clearList() {
    if (confirm("This will clear your notes list. Are you sure?")) {
        let currentList = localStorage.removeItem("listItem");
        //remove first child nodes while there are some
        while (list.hasChildNodes()) {
            list.removeChild(list.childNodes[0]);
        }
    } else {
        console.log("do not delete storage");
    }
}
/** @description sends the stored notes to the inputted email
 *  @param takes the submitted form date from the Notes list
 *  @returns false, to prevent default form submission
 *
 */
function sendMail(notesForm) {
    //get local stored list
    currentList = localStorage.getItem("listItem");
    console.log(typeof currentList + currentList);
    let sendList = "<ul>";
    console.log("Current LIST: " + sendList + currentList);

    if (currentList) {
        //remove buttons from lists. Got regex from this generator http://regex.larsolavtorvik.com/
        let currentListNoBtn = currentList.replace(
            /<button class="del-btn">X<\/button>/gi,
            ""
        );
        sendList += currentListNoBtn;
        sendList += "</ul>";
    }
    console.log("LIST TO BE SENT: " + sendList);
    let templateParams = {
        from_email: notesForm.email.value,
        notes_summary: sendList,
    };

    // debug : send list back to DOM
    // let debugEl = document.getElementById("note-send-debug");
    // if (sendList){
    //     debugEl.innerHTML = sendList;
    // }

    let responseEl = document.querySelector("#response");
    emailjs.send("gmail", "template_tourism_notes", templateParams).then(
        function (response) {
            console.log("SUCCESS!", response.status, response.text);
            responseEl.innerText = "Notes emailed successfully.";
        },
        function (error) {
            console.log("FAILED...", error);
            responseEl.innerText = "Note sending failed.";
        }
    );
    return false;
}
/**
 *  END NOTE TAKING FUNCTIONS
 */

/** -----------------------------------------------------------
 *  MAPPING FUNCTIONS
 */

function initMap() {
    //map options
    let options = {
        zoom: 14,
        center: {
            lat: 53.347293,
            lng: -6.25897,
        },
    };
    //assign these variables values here
    map = new google.maps.Map(document.getElementById("map"), options);
    infoWindow = new google.maps.InfoWindow();

    // Put infoWindow content into variable
    let portoContent = `
        <h2>Velvet Strand</h2>
        <p>Portmarnock</p>
        <p><a href="https://www.visitdublin.com/see-do/details/portmarnock-the-velvet-strand-blue-flag-beach-2019" target="_blank">See more here</a></p>`;
    // Put all addMarkers called into array instead of individual addMarker calls
    let markers = [
        {
            coords: { lat: 53.4246, lng: -6.121 },
            iconImage:
                "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
            content: portoContent,
        },
        {
            coords: { lat: 53.4509, lng: -6.1501 },
            iconImage: "http://maps.google.com/mapfiles/kml/pal2/icon27.png",
            content: "<h3>Party Village</h3><p>Malahide</p>",
        },
        {
            coords: { lat: 53.3786, lng: -6.057 },
            iconImage: "http://maps.google.com/mapfiles/ms/micons/fishing.png",
            content: "<h3>Fishing Village</h3><p>Howth</p>",
        },
        {
            coords: { lat: 53.343225, lng: -6.267848 },
            iconImage: "assets/images/markers/castle-blue-marker.png",
            content: "<h3>Dublin Castle</h3><p>Founded in 13th century, Dublin Castle is located off Dame Street.</p>",
        },
    ];

    //loop through markers
    for (let i = 0; i < markers.length; i++) {
        addMarker(markers[i]);
    }

    // Add Marker function
    function addMarker(props) {
        let marker = new google.maps.Marker({
            position: props.coords,
            map: map,
        });

        // Test for custom icon image
        if (props.iconImage) {
            // set icon image
            marker.setIcon(props.iconImage);
        }

        // Test for info window content. Test if true otherwise get info window with no info
        if (props.content) {
            //info window
            let myInfoWindow = new google.maps.InfoWindow({
                content: props.content,
                maxWidth: 200
            });

            // need to add listener to listen for that info window
            marker.addListener("click", function () {
                myInfoWindow.open(map, marker);
            });
        }
    }

    // TEST OUT POLYGON
    let shopArea = [
        { lat: 53.350621, lng: -6.254402 },
        { lat: 53.350805, lng: -6.254516 },
        { lat: 53.349973, lng: -6.259895 },
        { lat: 53.352647, lng: -6.26117 },
        { lat: 53.350991, lng: -6.264752 },
        { lat: 53.349644, lng: -6.269237 },
        { lat: 53.347236, lng: -6.268296 },
        { lat: 53.348286, lng: -6.259702 },
        { lat: 53.349765, lng: -6.25989 },
    ];
    shoppingAreaNorth = new google.maps.Polygon({
        path: shopArea,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 1,
    });
    // To use a POLYGON just use .Polygon in above example
    // call function to add line
    addLine();
}
function addLine() {
    // set the map to put polyline on
    shoppingAreaNorth.setMap(map);
}

function removeLine() {
    shoppingAreaNorth.setMap(null);
}
function whereAmI() {
    // Try HTML5 geolocation. From Google documentation - https://developers.google.com/maps/documentation/javascript/geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                //add marker to your location. POS variable from right above
                let geoMarker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    //icon: props.iconImage,
                    //content: props.content
                });
                let geoInfoWindow = new google.maps.InfoWindow();
                geoInfoWindow.setPosition(pos);
                geoInfoWindow.setContent("You are here.");
                geoInfoWindow.open(map);
                // open your location info window again on click marker
                geoMarker.addListener("click", function () {
                    geoInfoWindow.open(map, geoMarker);
                });
                // sets and overrides the map centering location
                map.panTo(pos);
                map.setZoom(12);
            },
            function () {
                handleLocationError(true, geoInfoWindow, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, geoInfoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, geoInfoWindow, pos) {
    geoInfoWindow.setPosition(pos);
    geoInfoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    geoInfoWindow.open(map);
}
