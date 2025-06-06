// Global Variables
// kaka

const restaurantList = document.getElementById("restaraunt-list");

// Get Body
const body = document.querySelector("body");
// Grab the Get Nearby Results Button
const nearbyBtn = document.getElementById("get-nearby-restaraunts");
// Allow search (if locaton is valid then dont search and waste api usage)
let allowSearch = true;

// Get Device's Coordinates on load
nearbyBtn.addEventListener("click", onLoadFunc);

function onLoadFunc() {
  restaurantList.innerHTML = "<h2>Finding your location... Please wait.</h2>";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 5000,
    });
  } else {
    console.log("No Location");
  }
}

function error(error) {
  console.log(error);
}

function success(position) {
  // Get Current Coords
  coords = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };

  console.log(coords);
  // Call searchNearby After getting current coords
  let nearbyRestaurants;
  searchNearby(coords).then((res) => {
    restaurantList.innerHTML = "";
    nearbyRestaurants = res;

    // List of all restaraunts (as objects)
    let allRestaurants = [];

    // Only run IF RESTARAUNTS FOUND
    if (nearbyRestaurants != "No Restaraunts Nearby") {
      // Add Each Restaurant to the UI

      nearbyRestaurants.forEach((restaurant) => {
        // console.log(restaurant);
        // Restaurants Name
        let name = "";
        if (restaurant.displayName.text) {
          name = restaurant.displayName.text;
        }

        // Restaurants Rating
        let rating = "";
        if (restaurant.rating) {
          rating = restaurant.rating + " Star";
        } else {
          rating = "No Review";
        }

        // Restaurants Address
        let address = "";
        if (restaurant.addressComponents) {
          address =
            restaurant.addressComponents[1].longText +
            " " +
            restaurant.addressComponents[0].longText +
            " " +
            restaurant.addressComponents[3].longText;
        }

        // Restaurants Opening Hours
        let openingHours = "";

        if (restaurant.currentOpeningHours) {
          const openinghoursArr =
            restaurant.currentOpeningHours.weekdayDescriptions;
          openinghoursArr.forEach((weekday) => {
            openingHours += weekday + "<br>";
          });
        } else {
          openingHours = " ";
        }

        // Restautants Google Maps Url
        let googleMapsUrl;
        if (restaurant.googleMapsUri) {
          googleMapsUrl = restaurant.googleMapsUri;
        } else {
          googleMapsUrl = "None";
        }

        // Create Object
        const restaurantObj = new Restaurants(
          name,
          rating,
          address,
          openingHours,
          googleMapsUrl
        );
        allRestaurants.push(restaurantObj);
      });
    } else {
      restaurantList.innerHTML =
        "<h1><strong>No Restraunts Found Nearby</strong></h1>";
    }

    // remove restaraunts from list which do not have a rating
    let noRatingRestaurants = [];
    let ratingRestaurants = [];

    allRestaurants.forEach((restaraunt) => {
      if (restaraunt.rating) {
        ratingRestaurants.push(restaraunt);
      } else {
        noRatingRestaurants.push(restaraunt);
      }
    });

    // Clear the All Restaraunts List
    allRestaurants = [];

    ratingRestaurants.sort(function (a, b) {
      const ratingA = parseFloat(a.rating); // Extract number from 4.5 star
      const ratingB = parseFloat(b.rating);
      return ratingB - ratingA;
    });

    // Push the sorted restaurants and the no rating ones in the end
    ratingRestaurants.forEach((restaraunt) => allRestaurants.push(restaraunt));

    noRatingRestaurants.forEach((restaraunt) =>
      allRestaurants.push(restaraunt)
    );
    allRestaurants.forEach((restaraunt) => {
      Restaurants.addRestaurants(restaraunt);
    });
  });
}

// Restauarant Object

class Restaurants {
  constructor(name, rating, address, openingHours, googleMapsUrl) {
    this.name = name;
    this.rating = rating;
    this.address = address;
    this.openingHours = openingHours;
    this.googleMapsUrl = googleMapsUrl;
  }

  static addRestaurants(restaraunt) {
    // Create restaraunt-card section
    const restarauntCard = document.createElement("div");
    restarauntCard.style = "none";
    restarauntCard.classList.add("restaraunt-card");

    // Create the heading-rating section and add it to the restaurant-card
    const headingRating = document.createElement("div");
    headingRating.classList.add("heading-rating");
    restarauntCard.appendChild(headingRating);

    // Create title
    const restarauntTitle = document.createElement("div");
    restarauntTitle.classList.add("heading");
    headingRating.appendChild(restarauntTitle);

    const h2 = document.createElement("h2");
    h2.textContent = restaraunt.name;
    restarauntTitle.appendChild(h2);
    // Create the rating
    const rating = document.createElement("div");
    rating.classList.add("heading");
    headingRating.appendChild(rating);

    const h4 = document.createElement("h4");
    h4.textContent = restaraunt.rating;
    rating.appendChild(h4);

    // Create the restaraunt-info section
    const restarauntInfo = document.createElement("div");
    restarauntInfo.classList.add("restaraunt-info");
    restarauntCard.appendChild(restarauntInfo);

    // Create address label
    const addressLabel = document.createElement("label");
    addressLabel.textContent = "Address:";
    restarauntInfo.appendChild(addressLabel);

    // create address section
    const address = document.createElement("div");
    address.classList.add("address");
    address.innerHTML = `${restaraunt.address} <a class="addressLink" href="${restaraunt.googleMapsUrl}" target="_blank"><i class="fa-solid fa-location-dot"></i></a>`;
    restarauntInfo.appendChild(address);

    // create opening hours section
    const openingHours = document.createElement("div");
    openingHours.classList.add("openinghours");
    openingHours.innerHTML = restaraunt.openingHours;

    restarauntInfo.appendChild(openingHours);

    // add restaraunt card to the restaraunt list
    restaurantList.appendChild(restarauntCard);
  }
}

// Event Listener for the button
document.getElementById("submit").addEventListener("click", main);

// Main Function
async function main() {
  // Clear restaraunt List
  restaurantList.innerHTML = "";
  let nearbyRestaurants = [];

  let coords = await getCoords();
  if (allowSearch) {
    nearbyRestaurants = await searchNearby(coords);
  }
  // List of all restaraunts (as objects)
  let allRestaurants = [];

  // Only run IF RESTARAUNTS FOUND
  if (nearbyRestaurants != "No Restaraunts Nearby") {
    // Add Each Restaurant to the UI

    nearbyRestaurants.forEach((restaurant) => {
      console.log(restaurant);
      // Restaurants Name
      let name = "";
      if (restaurant.displayName.text) {
        name = restaurant.displayName.text;
      }

      // Restaurants Rating
      let rating = "";
      if (restaurant.rating) {
        rating = restaurant.rating + " Star";
      } else {
        rating = "No Review";
      }

      // Restaurants Address
      let address = "";
      if (restaurant.addressComponents) {
        address =
          restaurant.addressComponents[1].longText +
          " " +
          restaurant.addressComponents[0].longText +
          " " +
          restaurant.addressComponents[3].longText;
      }

      // Restaurants Opening Hours
      let openingHours = "";

      if (restaurant.currentOpeningHours) {
        const openinghoursArr =
          restaurant.currentOpeningHours.weekdayDescriptions;
        openinghoursArr.forEach((weekday) => {
          openingHours += weekday + "<br>";
        });
      } else {
        openingHours = " ";
      }

      // Restautants Google Maps Url
      let googleMapsUrl;
      if (restaurant.googleMapsUri) {
        googleMapsUrl = restaurant.googleMapsUri;
      } else {
        googleMapsUrl = "None";
      }

      // Create Object
      const restaurantObj = new Restaurants(
        name,
        rating,
        address,
        openingHours,
        googleMapsUrl
      );
      allRestaurants.push(restaurantObj);
    });
  } else {
    restaurantList.innerHTML =
      "<h1><strong>No Restraunts Found Nearby</strong></h1>";
  }
  // remove restaraunts from list which do not have a rating
  let noRatingRestaurants = [];
  let ratingRestaurants = [];

  allRestaurants.forEach((restaraunt) => {
    if (restaraunt.rating) {
      ratingRestaurants.push(restaraunt);
    } else {
      noRatingRestaurants.push(restaraunt);
    }
  });

  // Clear the All Restaraunts List
  allRestaurants = [];

  ratingRestaurants.sort(function (a, b) {
    const ratingA = parseFloat(a.rating); // Extract number from 4.5 star
    const ratingB = parseFloat(b.rating);
    return ratingB - ratingA;
  });

  // Push the sorted restaurants and the no rating ones in the end
  ratingRestaurants.forEach((restaraunt) => allRestaurants.push(restaraunt));

  noRatingRestaurants.forEach((restaraunt) => allRestaurants.push(restaraunt));
  allRestaurants.forEach((restaraunt) => {
    Restaurants.addRestaurants(restaraunt);
  });
}

// Convert Given Location to coordinates
const apiKey = "AIzaSyAEL29wvHNv_7oG5mSsOdGui6P2jCO2tb4";

async function getCoords() {
  const input = document.getElementById("area");
  let address = input.value;
  address = address.split(" ");

  urlAdd = "";
  address.forEach((word) => {
    urlAdd += word + "+";
  });

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${urlAdd}&key=${apiKey}`
  );
  let data = await res.json();
  data = await data.results[0];
  if (data) {
    const locCoords = await data.geometry.location;

    allowSearch = true;
    // Return Location Coordinates
    console.log(locCoords);
    return locCoords;
  } else {
    restaurantList.innerHTML =
      "<h1><strong>Please enter a valid location</strong></h1>";
    allowSearch = false;
  }
}

// Get nearby restaraunts
async function searchNearby(coords) {
  //   const foodTypesArr = ["restaurant", "Buffet"];
  //   let foodTypes = "";
  //   foodTypesArr.forEach((item) => {
  //     foodTypes += item + ",";
  //   });
  const coordinates = { latitude: coords.lat, longitude: coords.lng };
  const radius = 500;

  const requestBody = {
    includedPrimaryTypes: "restaurant",
    maxResultCount: 20,
    locationRestriction: { circle: { center: coordinates, radius: radius } },
  };

  const res = await fetch(
    `https://places.googleapis.com/v1/places:searchNearby`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.addressComponents,places.currentOpeningHours,places.rating,places.googleMapsUri",
      },
      body: JSON.stringify(requestBody),
    }
  );

  const data = await res.json();
  const restaraunts = await data;
  // console.log(restaraunts["places"]);
  if (restaraunts["places"]) {
    return restaraunts["places"];
  } else {
    return "No Restaraunts Nearby";
  }
}
