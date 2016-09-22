
/* 
  Initialize the application loading the restaurants data 
  and adding the event listeners to the interactive elements.
*/
export function init() {

  fetch('data/restaurants.json')
    .then(response => response.json())
    .then(showRestaurants)
    .catch(function(error) {
      console.error('Could not load the restaurants.', error);
    });

}

function showRestaurants(restaurants) {
  
  var restaurantsList = document.getElementById('restaurants-list'),
  html = restaurants.map(rest => restaurantTmpl(rest));
  restaurantsList.innerHTML = html.join();

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

function avg(array) {
  return array.reduce((prev, cur) => prev + cur, 0)/array.length;
}

function calculateStars(reviews) {

  var stars = reviews.map((review) => review.stars);
  return avg(stars) ;

}

function starType(order, number) {

  if(number - order == -0.5) {
    return 'half';
  } else if(number - order >= 0) {
    return 'full'
  }

  return 'empty';

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