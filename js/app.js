
// module variables, used to filter the restaurants by name and type
var restaurants, 
typeSelected = '', 
searchString = '';

/* 
  Initialize the application loading the restaurants data 
  and adding the event listeners to the interactive elements.
*/
export function init() {

  fetch('data/restaurants.json')
    .then(response => response.json())
    .then(storeRestaurants)
    .then(showRestaurants)
    .catch(function(error) {
      console.error('Could not load the restaurants.', error);
    });

}

export function filterByType(type) {

  typeSelected = type;
  showRestaurants(filterRestaurants());

}

export function filterByName(name) {
  
  searchString = name;
  showRestaurants(filterRestaurants());

}

export function filterRestaurants() {

  return restaurants.filter((restaurant) => {
    
    var containsSearchString = true, 
    isTypeSelected = true;
    
    if(searchString != '') {
  
      containsSearchString = restaurant.name.indexOf(searchString) != -1;
  
    } 

    if(typeSelected != ''){

      isTypeSelected = (restaurant.type === typeSelected);

    } 

    return containsSearchString && isTypeSelected;
    
  });

}

/* 
  Stores the restaurants array in a variable for filters 
  They could be stored to localstorage or indexedDB
  but for this app it will do with a module variable.
*/
function storeRestaurants(res) {
  restaurants = res;
  return res;
}

/*
  Render all restaurants using the restaurant template
*/
function showRestaurants(restaurants) {
  
  var restaurantsList = document.getElementById('restaurants-list'),
  html = restaurants.map(rest => restaurantTmpl(rest));
  restaurantsList.innerHTML = html.join('');

}

/*
  Average of an array of numbers
*/
function avg(array) {
  return array.reduce((prev, cur) => prev + cur, 0)/array.length;
}

/*
  Calculate the average from all stars in the reviews
*/
function calculateStars(reviews) {

  var stars = reviews.map((review) => review.stars);
  return avg(stars) ;

}

/*
  Calculate how full is the current star
*/
function starType(order, number) {

  if(number - order == -0.5) {
    return 'half';
  } else if(number - order >= 0) {
    return 'full'
  }

  return 'empty';

}

//---------- Templates ---------------
function restaurantTmpl(restaurant) {

  return `<article class="row">
            <h2>
              <a href="#more">
                ${restaurant.name}
              </a>
              ${starsTmpl(calculateStars(restaurant.reviews))}
            </h2>
            <div class="thumb">
              <img src="${restaurant.photo}" alt="${restaurant.name} Photograph">
            </div>
            <div class="location">
              <span class="sr-only">Location:</span>
              <span class="fa fa-map-marker" aria-hidden="true"></span> 
              ${restaurant.address}
              <a class="maps" href="${mapsLink(restaurant.address)}" target="_blank">Open in Maps</a>
            </div>
            <div class="opening">
              Opens: ${openingTmpl(restaurant.openingHours)} 
            </div>
            <div class="description">
              ${restaurant.description}
            </div>
            <input type="button" value="12 reviews - Add your review"/>
          </article>`;

}

function openingTmpl(openingHours) {

  return openingHours.map(timeTmpl).join(' | ');

}

function timeTmpl(time) {

  return `<span class="text-success">${time.open} - ${time.close}</span>`;

}

function starsTmpl(number) {

  return `<div class="stars">
            <span class="sr-only">${number} stars</span>
            <i class="fa fa-star ${starType(1, number)}" aria-hidden="true"></i>
            <i class="fa fa-star ${starType(2, number)}" aria-hidden="true"></i>
            <i class="fa fa-star ${starType(3, number)}" aria-hidden="true"></i>
            <i class="fa fa-star ${starType(4, number)}" aria-hidden="true"></i>
            <i class="fa fa-star ${starType(5, number)}" aria-hidden="true"></i>
          </div>`;

}

function mapsLink(address) {

  return `http://maps.google.com/?q=${encodeURIComponent(address)}`;

}