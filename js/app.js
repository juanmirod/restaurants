
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
  
  var restaurantsList = document.getElementById('restaurants-list');

  restaurantsList.innerHTML = '';
  restaurants.forEach(function(restaurant) {
    restaurantsList.innerHTML += restaurantTmpl(restaurant);
  })

  console.assert(restaurantsList.childElementCount > 0, 'The app should load some restaurants');
}

function restaurantTmpl(restaurant) {
  
  console.assert(typeof restaurant === 'object');

  return `<article class="row">
            <h2>
              <a href="#more">
                ${restaurant.name}
              </a>
              <i class="fa fa-star full" aria-hidden="true"></i>
              <i class="fa fa-star full" aria-hidden="true"></i>
              <i class="fa fa-star full" aria-hidden="true"></i>
              <i class="fa fa-star full" aria-hidden="true"></i>
              <i class="fa fa-star empty" aria-hidden="true"></i>
            </h2>
            <div class="thumb">
              <img src="${restaurant.photo}" alt="${restaurant.name} Photograph">
            </div>
            <div class="location">
              <span class="sr-only">Location:</span>
              <span class="fa fa-map-marker" aria-hidden="true"></span> 
              ${restaurant.address}
              <a class="maps" href="#" target="_blank">Open in Maps</a>
            </div>
            <div class="opening">
              Opens: <span class="text-success">9:00 - 14:00</span> | <span class="text-success">16:00 - 20:00</span>
            </div>
            <div class="description">
              ${restaurant.description}
            </div>
            <input type="button" value="12 reviews - Add your review"/>
          </article>`;

}