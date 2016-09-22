(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.filterByType = filterByType;
exports.filterByName = filterByName;
exports.filterRestaurants = filterRestaurants;

// module variables, used to filter the restaurants by name and type
var restaurants,
    typeSelected = '',
    searchString = '';

/* 
  Initialize the application loading the restaurants data 
  and adding the event listeners to the interactive elements.
*/
function init() {

  fetch('data/restaurants.json').then(function (response) {
    return response.json();
  }).then(storeRestaurants).then(showRestaurants).catch(function (error) {
    console.error('Could not load the restaurants.', error);
  });
}

function filterByType(type) {

  typeSelected = type;
  showRestaurants(filterRestaurants());
}

function filterByName(name) {

  searchString = name;
  showRestaurants(filterRestaurants());
}

function filterRestaurants() {

  return restaurants.filter(function (restaurant) {

    var containsSearchString = true,
        isTypeSelected = true;

    if (searchString != '') {

      containsSearchString = restaurant.name.indexOf(searchString) != -1;
    }

    if (typeSelected != '') {

      isTypeSelected = restaurant.type === typeSelected;
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
      html = restaurants.map(function (rest) {
    return restaurantTmpl(rest);
  });
  restaurantsList.innerHTML = html.join('');
}

/*
  Average of an array of numbers
*/
function avg(array) {
  return array.reduce(function (prev, cur) {
    return prev + cur;
  }, 0) / array.length;
}

/*
  Calculate the average from all stars in the reviews
*/
function calculateStars(reviews) {

  var stars = reviews.map(function (review) {
    return review.stars;
  });
  return avg(stars);
}

/*
  Calculate how full is the current star
*/
function starType(order, number) {

  if (number - order == -0.5) {
    return 'half';
  } else if (number - order >= 0) {
    return 'full';
  }

  return 'empty';
}

//---------- Templates ---------------
function restaurantTmpl(restaurant) {

  return '<article class="row">\n            <h2>\n              <a href="#more">\n                ' + restaurant.name + '\n              </a>\n              ' + starsTmpl(calculateStars(restaurant.reviews)) + '\n            </h2>\n            <div class="thumb">\n              <img src="' + restaurant.photo + '" alt="' + restaurant.name + ' Photograph">\n            </div>\n            <div class="location">\n              <span class="sr-only">Location:</span>\n              <span class="fa fa-map-marker" aria-hidden="true"></span> \n              ' + restaurant.address + '\n              <a class="maps" href="' + mapsLink(restaurant.address) + '" target="_blank">Open in Maps</a>\n            </div>\n            <div class="opening">\n              Opens: ' + openingTmpl(restaurant.openingHours) + ' \n            </div>\n            <div class="description">\n              ' + restaurant.description + '\n            </div>\n            <input type="button" value="12 reviews - Add your review"/>\n          </article>';
}

function openingTmpl(openingHours) {

  return openingHours.map(timeTmpl).join(' | ');
}

function timeTmpl(time) {

  return '<span class="text-success">' + time.open + ' - ' + time.close + '</span>';
}

function starsTmpl(number) {

  return '<div class="stars">\n            <span class="sr-only">' + number + ' stars</span>\n            <i class="fa fa-star ' + starType(1, number) + '" aria-hidden="true"></i>\n            <i class="fa fa-star ' + starType(2, number) + '" aria-hidden="true"></i>\n            <i class="fa fa-star ' + starType(3, number) + '" aria-hidden="true"></i>\n            <i class="fa fa-star ' + starType(4, number) + '" aria-hidden="true"></i>\n            <i class="fa fa-star ' + starType(5, number) + '" aria-hidden="true"></i>\n          </div>';
}

function mapsLink(address) {

  return 'http://maps.google.com/?q=' + encodeURIComponent(address);
}

},{}],2:[function(require,module,exports){
'use strict';

var _app = require('./app.js');

var App = _interopRequireWildcard(_app);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(function () {

  function ready() {

    return new Promise(function (resolve, reject) {

      // resolve the promise when the document is ready
      document.addEventListener('readystatechange', function () {
        if (document.readyState !== 'loading') {
          resolve();
        }
      });
    });
  };

  ready().then(function () {
    App.init();

    // add filtering listeners
    var typeButtons = document.getElementsByClassName('type-button');
    for (var i = 0; i < typeButtons.length; i++) {
      typeButtons[i].addEventListener('click', function () {

        // gets the value of the input FIXME: too ugly :P
        App.filterByType(this.previousElementSibling.value);
      });
    }

    // add input listener for the search box, we want to update
    // the list on each keystroke (the list is already completely 
    // loaded so this doesn't make more requests)
    var nameFilter = document.getElementById('searchbox');
    nameFilter.addEventListener('input', function () {

      App.filterByName(this.value);
    });
  });
})();

},{"./app.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7UUNVZ0IsSSxHQUFBLEk7UUFZQSxZLEdBQUEsWTtRQU9BLFksR0FBQSxZO1FBT0EsaUIsR0FBQSxpQjs7QUFuQ2hCO0FBQ0EsSUFBSSxXQUFKO0FBQUEsSUFDQSxlQUFlLEVBRGY7QUFBQSxJQUVBLGVBQWUsRUFGZjs7QUFJQTs7OztBQUlPLFNBQVMsSUFBVCxHQUFnQjs7QUFFckIsUUFBTSx1QkFBTixFQUNHLElBREgsQ0FDUTtBQUFBLFdBQVksU0FBUyxJQUFULEVBQVo7QUFBQSxHQURSLEVBRUcsSUFGSCxDQUVRLGdCQUZSLEVBR0csSUFISCxDQUdRLGVBSFIsRUFJRyxLQUpILENBSVMsVUFBUyxLQUFULEVBQWdCO0FBQ3JCLFlBQVEsS0FBUixDQUFjLGlDQUFkLEVBQWlELEtBQWpEO0FBQ0QsR0FOSDtBQVFEOztBQUVNLFNBQVMsWUFBVCxDQUFzQixJQUF0QixFQUE0Qjs7QUFFakMsaUJBQWUsSUFBZjtBQUNBLGtCQUFnQixtQkFBaEI7QUFFRDs7QUFFTSxTQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEI7O0FBRWpDLGlCQUFlLElBQWY7QUFDQSxrQkFBZ0IsbUJBQWhCO0FBRUQ7O0FBRU0sU0FBUyxpQkFBVCxHQUE2Qjs7QUFFbEMsU0FBTyxZQUFZLE1BQVosQ0FBbUIsVUFBQyxVQUFELEVBQWdCOztBQUV4QyxRQUFJLHVCQUF1QixJQUEzQjtBQUFBLFFBQ0EsaUJBQWlCLElBRGpCOztBQUdBLFFBQUcsZ0JBQWdCLEVBQW5CLEVBQXVCOztBQUVyQiw2QkFBdUIsV0FBVyxJQUFYLENBQWdCLE9BQWhCLENBQXdCLFlBQXhCLEtBQXlDLENBQUMsQ0FBakU7QUFFRDs7QUFFRCxRQUFHLGdCQUFnQixFQUFuQixFQUFzQjs7QUFFcEIsdUJB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Q0Q7QUFDRixPQUpEO0FBTUQsS0FUTSxDQUFQO0FBV0Q7O0FBRUQsVUFBUSxJQUFSLENBQWEsWUFBVztBQUN0QixRQUFJLElBQUo7O0FBRUE7QUFDQSxRQUFJLGNBQWMsU0FBUyxzQkFBVCxDQUFnQyxhQUFoQyxDQUFsQjtBQUNBLFNBQUksSUFBSSxJQUFFLENBQVYsRUFBYSxJQUFJLFlBQVksTUFBN0IsRUFBcUMsR0FBckMsRUFBMEM7QUFDeEMsa0JBQVksQ0FBWixFQUFlLGdCQUFmLENBQWdDLE9BQWhDLEVBQXlDLFlBQVU7O0FBRWpEO0FBQ0EsWUFBSSxZQUFKLENBQWlCLEtBQUssc0JBQUwsQ0FBNEIsS0FBN0M7QUFFRCxPQUxEO0FBTUQ7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsUUFBSSxhQUFhLFNBQVMsY0FBVCxDQUF3QixXQUF4QixDQUFqQjtBQUNBLGVBQVcsZ0JBQVgsQ0FBNEIsT0FBNUIsRUFBcUMsWUFBVzs7QUFFOUMsVUFBSSxZQUFKLENBQWlCLEtBQUssS0FBdEI7QUFFRCxLQUpEO0FBTUQsR0F4QkQ7QUEwQkQsQ0EzQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4vLyBtb2R1bGUgdmFyaWFibGVzLCB1c2VkIHRvIGZpbHRlciB0aGUgcmVzdGF1cmFudHMgYnkgbmFtZSBhbmQgdHlwZVxudmFyIHJlc3RhdXJhbnRzLCBcbnR5cGVTZWxlY3RlZCA9ICcnLCBcbnNlYXJjaFN0cmluZyA9ICcnO1xuXG4vKiBcbiAgSW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24gbG9hZGluZyB0aGUgcmVzdGF1cmFudHMgZGF0YSBcbiAgYW5kIGFkZGluZyB0aGUgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBpbnRlcmFjdGl2ZSBlbGVtZW50cy5cbiovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcblxuICBmZXRjaCgnZGF0YS9yZXN0YXVyYW50cy5qc29uJylcbiAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgLnRoZW4oc3RvcmVSZXN0YXVyYW50cylcbiAgICAudGhlbihzaG93UmVzdGF1cmFudHMpXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgbG9hZCB0aGUgcmVzdGF1cmFudHMuJywgZXJyb3IpO1xuICAgIH0pO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJCeVR5cGUodHlwZSkge1xuXG4gIHR5cGVTZWxlY3RlZCA9IHR5cGU7XG4gIHNob3dSZXN0YXVyYW50cyhmaWx0ZXJSZXN0YXVyYW50cygpKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQnlOYW1lKG5hbWUpIHtcbiAgXG4gIHNlYXJjaFN0cmluZyA9IG5hbWU7XG4gIHNob3dSZXN0YXVyYW50cyhmaWx0ZXJSZXN0YXVyYW50cygpKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyUmVzdGF1cmFudHMoKSB7XG5cbiAgcmV0dXJuIHJlc3RhdXJhbnRzLmZpbHRlcigocmVzdGF1cmFudCkgPT4ge1xuICAgIFxuICAgIHZhciBjb250YWluc1NlYXJjaFN0cmluZyA9IHRydWUsIFxuICAgIGlzVHlwZVNlbGVjdGVkID0gdHJ1ZTtcbiAgICBcbiAgICBpZihzZWFyY2hTdHJpbmcgIT0gJycpIHtcbiAgXG4gICAgICBjb250YWluc1NlYXJjaFN0cmluZyA9IHJlc3RhdXJhbnQubmFtZS5pbmRleE9mKHNlYXJjaFN0cmluZykgIT0gLTE7XG4gIFxuICAgIH0gXG5cbiAgICBpZih0eXBlU2VsZWN0ZWQgIT0gJycpe1xuXG4gICAgICBpc1R5cGVTZWxlY3RlZCA9IChyZXN0YXVyYW50LnR5cGUgPT09IHR5cGVTZWxlY3RlZCk7XG5cbiAgICB9IFxuXG4gICAgcmV0dXJuIGNvbnRhaW5zU2VhcmNoU3RyaW5nICYmIGlzVHlwZVNlbGVjdGVkO1xuICAgIFxuICB9KTtcblxufVxuXG4vKiBcbiAgU3RvcmVzIHRoZSByZXN0YXVyYW50cyBhcnJheSBpbiBhIHZhcmlhYmxlIGZvciBmaWx0ZXJzIFxuICBUaGV5IGNvdWxkIGJlIHN0b3JlZCB0byBsb2NhbHN0b3JhZ2Ugb3IgaW5kZXhlZERCXG4gIGJ1dCBmb3IgdGhpcyBhcHAgaXQgd2lsbCBkbyB3aXRoIGEgbW9kdWxlIHZhcmlhYmxlLlxuKi9cbmZ1bmN0aW9uIHN0b3JlUmVzdGF1cmFudHMocmVzKSB7XG4gIHJlc3RhdXJhbnRzID0gcmVzO1xuICByZXR1cm4gcmVzO1xufVxuXG4vKlxuICBSZW5kZXIgYWxsIHJlc3RhdXJhbnRzIHVzaW5nIHRoZSByZXN0YXVyYW50IHRlbXBsYXRlXG4qL1xuZnVuY3Rpb24gc2hvd1Jlc3RhdXJhbnRzKHJlc3RhdXJhbnRzKSB7XG4gIFxuICB2YXIgcmVzdGF1cmFudHNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnRzLWxpc3QnKSxcbiAgaHRtbCA9IHJlc3RhdXJhbnRzLm1hcChyZXN0ID0+IHJlc3RhdXJhbnRUbXBsKHJlc3QpKTtcbiAgcmVzdGF1cmFudHNMaXN0LmlubmVySFRNTCA9IGh0bWwuam9pbignJyk7XG5cbn1cblxuLypcbiAgQXZlcmFnZSBvZiBhbiBhcnJheSBvZiBudW1iZXJzXG4qL1xuZnVuY3Rpb24gYXZnKGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5yZWR1Y2UoKHByZXYsIGN1cikgPT4gcHJldiArIGN1ciwgMCkvYXJyYXkubGVuZ3RoO1xufVxuXG4vKlxuICBDYWxjdWxhdGUgdGhlIGF2ZXJhZ2UgZnJvbSBhbGwgc3RhcnMgaW4gdGhlIHJldmlld3NcbiovXG5mdW5jdGlvbiBjYWxjdWxhdGVTdGFycyhyZXZpZXdzKSB7XG5cbiAgdmFyIHN0YXJzID0gcmV2aWV3cy5tYXAoKHJldmlldykgPT4gcmV2aWV3LnN0YXJzKTtcbiAgcmV0dXJuIGF2ZyhzdGFycykgO1xuXG59XG5cbi8qXG4gIENhbGN1bGF0ZSBob3cgZnVsbCBpcyB0aGUgY3VycmVudCBzdGFyXG4qL1xuZnVuY3Rpb24gc3RhclR5cGUob3JkZXIsIG51bWJlcikge1xuXG4gIGlmKG51bWJlciAtIG9yZGVyID09IC0wLjUpIHtcbiAgICByZXR1cm4gJ2hhbGYnO1xuICB9IGVsc2UgaWYobnVtYmVyIC0gb3JkZXIgPj0gMCkge1xuICAgIHJldHVybiAnZnVsbCdcbiAgfVxuXG4gIHJldHVybiAnZW1wdHknO1xuXG59XG5cbi8vLS0tLS0tLS0tLSBUZW1wbGF0ZXMgLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiByZXN0YXVyYW50VG1wbChyZXN0YXVyYW50KSB7XG5cbiAgcmV0dXJuIGA8YXJ0aWNsZSBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgPGgyPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiI21vcmVcIj5cbiAgICAgICAgICAgICAgICAke3Jlc3RhdXJhbnQubmFtZX1cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAke3N0YXJzVG1wbChjYWxjdWxhdGVTdGFycyhyZXN0YXVyYW50LnJldmlld3MpKX1cbiAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGh1bWJcIj5cbiAgICAgICAgICAgICAgPGltZyBzcmM9XCIke3Jlc3RhdXJhbnQucGhvdG99XCIgYWx0PVwiJHtyZXN0YXVyYW50Lm5hbWV9IFBob3RvZ3JhcGhcIj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvY2F0aW9uXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPkxvY2F0aW9uOjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmYSBmYS1tYXAtbWFya2VyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBcbiAgICAgICAgICAgICAgJHtyZXN0YXVyYW50LmFkZHJlc3N9XG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwibWFwc1wiIGhyZWY9XCIke21hcHNMaW5rKHJlc3RhdXJhbnQuYWRkcmVzcyl9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+T3BlbiBpbiBNYXBzPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwib3BlbmluZ1wiPlxuICAgICAgICAgICAgICBPcGVuczogJHtvcGVuaW5nVG1wbChyZXN0YXVyYW50Lm9wZW5pbmdIb3Vycyl9IFxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgJHtyZXN0YXVyYW50LmRlc2NyaXB0aW9ufVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiMTIgcmV2aWV3cyAtIEFkZCB5b3VyIHJldmlld1wiLz5cbiAgICAgICAgICA8L2FydGljbGU+YDtcblxufVxuXG5mdW5jdGlvbiBvcGVuaW5nVG1wbChvcGVuaW5nSG91cnMpIHtcblxuICByZXR1cm4gb3BlbmluZ0hvdXJzLm1hcCh0aW1lVG1wbCkuam9pbignIHwgJyk7XG5cbn1cblxuZnVuY3Rpb24gdGltZVRtcGwodGltZSkge1xuXG4gIHJldHVybiBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj4ke3RpbWUub3Blbn0gLSAke3RpbWUuY2xvc2V9PC9zcGFuPmA7XG5cbn1cblxuZnVuY3Rpb24gc3RhcnNUbXBsKG51bWJlcikge1xuXG4gIHJldHVybiBgPGRpdiBjbGFzcz1cInN0YXJzXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj4ke251bWJlcn0gc3RhcnM8L3NwYW4+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSgxLCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDIsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoMywgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSg0LCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDUsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgIDwvZGl2PmA7XG5cbn1cblxuZnVuY3Rpb24gbWFwc0xpbmsoYWRkcmVzcykge1xuXG4gIHJldHVybiBgaHR0cDovL21hcHMuZ29vZ2xlLmNvbS8/cT0ke2VuY29kZVVSSUNvbXBvbmVudChhZGRyZXNzKX1gO1xuXG59IiwiaW1wb3J0ICogYXMgQXBwIGZyb20gJy4vYXBwLmpzJztcblxuKGZ1bmN0aW9uKCkge1xuXG4gIGZ1bmN0aW9uIHJlYWR5KCkge1xuICAgICAgXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgXG4gICAgICAvLyByZXNvbHZlIHRoZSBwcm9taXNlIHdoZW4gdGhlIGRvY3VtZW50IGlzIHJlYWR5XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdsb2FkaW5nJykge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9O1xuXG4gIHJlYWR5KCkudGhlbihmdW5jdGlvbigpIHtcbiAgICBBcHAuaW5pdCgpO1xuXG4gICAgLy8gYWRkIGZpbHRlcmluZyBsaXN0ZW5lcnNcbiAgICB2YXIgdHlwZUJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0eXBlLWJ1dHRvbicpO1xuICAgIGZvcih2YXIgaT0wOyBpIDwgdHlwZUJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHR5cGVCdXR0b25zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcblxuICAgICAgICAvLyBnZXRzIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQgRklYTUU6IHRvbyB1Z2x5IDpQXG4gICAgICAgIEFwcC5maWx0ZXJCeVR5cGUodGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnZhbHVlKTtcblxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGlucHV0IGxpc3RlbmVyIGZvciB0aGUgc2VhcmNoIGJveCwgd2Ugd2FudCB0byB1cGRhdGVcbiAgICAvLyB0aGUgbGlzdCBvbiBlYWNoIGtleXN0cm9rZSAodGhlIGxpc3QgaXMgYWxyZWFkeSBjb21wbGV0ZWx5IFxuICAgIC8vIGxvYWRlZCBzbyB0aGlzIGRvZXNuJ3QgbWFrZSBtb3JlIHJlcXVlc3RzKVxuICAgIHZhciBuYW1lRmlsdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaGJveCcpO1xuICAgIG5hbWVGaWx0ZXIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgQXBwLmZpbHRlckJ5TmFtZSh0aGlzLnZhbHVlKTtcblxuICAgIH0pO1xuXG4gIH0pO1xuXG59KSgpOyJdfQ==
