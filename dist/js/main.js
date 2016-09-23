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
    var typeButtons = document.getElementsByName('type');
    for (var i = 0; i < typeButtons.length; i++) {
      typeButtons[i].addEventListener('change', function () {

        App.filterByType(this.value);
      });
    }

    // Add input listener for the search box, we want to update
    // the list on each keystroke (the list is already completely 
    // loaded so this doesn't make more requests)
    var nameFilter = document.getElementById('searchbox');
    nameFilter.addEventListener('input', function () {

      App.filterByName(this.value);
    });
  });
})();

},{"./app.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7UUNVZ0IsSSxHQUFBLEk7UUFZQSxZLEdBQUEsWTtRQU9BLFksR0FBQSxZO1FBT0EsaUIsR0FBQSxpQjs7QUFuQ2hCO0FBQ0EsSUFBSSxXQUFKO0FBQUEsSUFDQSxlQUFlLEVBRGY7QUFBQSxJQUVBLGVBQWUsRUFGZjs7QUFJQTs7OztBQUlPLFNBQVMsSUFBVCxHQUFnQjs7QUFFckIsUUFBTSx1QkFBTixFQUNHLElBREgsQ0FDUTtBQUFBLFdBQVksU0FBUyxJQUFULEVBQVo7QUFBQSxHQURSLEVBRUcsSUFGSCxDQUVRLGdCQUZSLEVBR0csSUFISCxDQUdRLGVBSFIsRUFJRyxLQUpILENBSVMsVUFBUyxLQUFULEVBQWdCO0FBQ3JCLFlBQVEsS0FBUixDQUFjLGlDQUFkLEVBQWlELEtBQWpEO0FBQ0QsR0FOSDtBQVFEOztBQUVNLFNBQVMsWUFBVCxDQUFzQixJQUF0QixFQUE0Qjs7QUFFakMsaUJBQWUsSUFBZjtBQUNBLGtCQUFnQixtQkFBaEI7QUFFRDs7QUFFTSxTQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEI7O0FBRWpDLGlCQUFlLElBQWY7QUFDQSxrQkFBZ0IsbUJBQWhCO0FBRUQ7O0FBRU0sU0FBUyxpQkFBVCxHQUE2Qjs7QUFFbEMsU0FBTyxZQUFZLE1BQVosQ0FBbUIsVUFBQyxVQUFELEVBQWdCOztBQUV4QyxRQUFJLHVCQUF1QixJQUEzQjtBQUFBLFFBQ0EsaUJBQWlCLElBRGpCOztBQUdBLFFBQUcsZ0JBQWdCLEVBQW5CLEVBQXVCOztBQUVyQiw2QkFBdUIsV0FBVyxJQUFYLENBQWdCLE9BQWhCLENBQXdCLFlBQXhCLEtBQXlDLENBQUMsQ0FBakU7QUFFRDs7QUFFRCxRQUFHLGdCQUFnQixFQUFuQixFQUFzQjs7QUFFcEIsdUJB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Q0Q7QUFDRixPQUpEO0FBTUQsS0FUTSxDQUFQO0FBV0Q7O0FBRUQsVUFBUSxJQUFSLENBQWEsWUFBVztBQUN0QixRQUFJLElBQUo7O0FBRUE7QUFDQSxRQUFJLGNBQWMsU0FBUyxpQkFBVCxDQUEyQixNQUEzQixDQUFsQjtBQUNBLFNBQUksSUFBSSxJQUFFLENBQVYsRUFBYSxJQUFJLFlBQVksTUFBN0IsRUFBcUMsR0FBckMsRUFBMEM7QUFDeEMsa0JBQVksQ0FBWixFQUFlLGdCQUFmLENBQWdDLFFBQWhDLEVBQTBDLFlBQVU7O0FBRWxELFlBQUksWUFBSixDQUFpQixLQUFLLEtBQXRCO0FBRUQsT0FKRDtBQUtEOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFFBQUksYUFBYSxTQUFTLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBakI7QUFDQSxlQUFXLGdCQUFYLENBQTRCLE9BQTVCLEVBQXFDLFlBQVc7O0FBRTlDLFVBQUksWUFBSixDQUFpQixLQUFLLEtBQXRCO0FBRUQsS0FKRDtBQU1ELEdBdkJEO0FBeUJELENBMUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLy8gbW9kdWxlIHZhcmlhYmxlcywgdXNlZCB0byBmaWx0ZXIgdGhlIHJlc3RhdXJhbnRzIGJ5IG5hbWUgYW5kIHR5cGVcbnZhciByZXN0YXVyYW50cywgXG50eXBlU2VsZWN0ZWQgPSAnJywgXG5zZWFyY2hTdHJpbmcgPSAnJztcblxuLyogXG4gIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uIGxvYWRpbmcgdGhlIHJlc3RhdXJhbnRzIGRhdGEgXG4gIGFuZCBhZGRpbmcgdGhlIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgaW50ZXJhY3RpdmUgZWxlbWVudHMuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgZmV0Y2goJ2RhdGEvcmVzdGF1cmFudHMuanNvbicpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIC50aGVuKHN0b3JlUmVzdGF1cmFudHMpXG4gICAgLnRoZW4oc2hvd1Jlc3RhdXJhbnRzKVxuICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IGxvYWQgdGhlIHJlc3RhdXJhbnRzLicsIGVycm9yKTtcbiAgICB9KTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQnlUeXBlKHR5cGUpIHtcblxuICB0eXBlU2VsZWN0ZWQgPSB0eXBlO1xuICBzaG93UmVzdGF1cmFudHMoZmlsdGVyUmVzdGF1cmFudHMoKSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckJ5TmFtZShuYW1lKSB7XG4gIFxuICBzZWFyY2hTdHJpbmcgPSBuYW1lO1xuICBzaG93UmVzdGF1cmFudHMoZmlsdGVyUmVzdGF1cmFudHMoKSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlclJlc3RhdXJhbnRzKCkge1xuXG4gIHJldHVybiByZXN0YXVyYW50cy5maWx0ZXIoKHJlc3RhdXJhbnQpID0+IHtcbiAgICBcbiAgICB2YXIgY29udGFpbnNTZWFyY2hTdHJpbmcgPSB0cnVlLCBcbiAgICBpc1R5cGVTZWxlY3RlZCA9IHRydWU7XG4gICAgXG4gICAgaWYoc2VhcmNoU3RyaW5nICE9ICcnKSB7XG4gIFxuICAgICAgY29udGFpbnNTZWFyY2hTdHJpbmcgPSByZXN0YXVyYW50Lm5hbWUuaW5kZXhPZihzZWFyY2hTdHJpbmcpICE9IC0xO1xuICBcbiAgICB9IFxuXG4gICAgaWYodHlwZVNlbGVjdGVkICE9ICcnKXtcblxuICAgICAgaXNUeXBlU2VsZWN0ZWQgPSAocmVzdGF1cmFudC50eXBlID09PSB0eXBlU2VsZWN0ZWQpO1xuXG4gICAgfSBcblxuICAgIHJldHVybiBjb250YWluc1NlYXJjaFN0cmluZyAmJiBpc1R5cGVTZWxlY3RlZDtcbiAgICBcbiAgfSk7XG5cbn1cblxuLyogXG4gIFN0b3JlcyB0aGUgcmVzdGF1cmFudHMgYXJyYXkgaW4gYSB2YXJpYWJsZSBmb3IgZmlsdGVycyBcbiAgVGhleSBjb3VsZCBiZSBzdG9yZWQgdG8gbG9jYWxzdG9yYWdlIG9yIGluZGV4ZWREQlxuICBidXQgZm9yIHRoaXMgYXBwIGl0IHdpbGwgZG8gd2l0aCBhIG1vZHVsZSB2YXJpYWJsZS5cbiovXG5mdW5jdGlvbiBzdG9yZVJlc3RhdXJhbnRzKHJlcykge1xuICByZXN0YXVyYW50cyA9IHJlcztcbiAgcmV0dXJuIHJlcztcbn1cblxuLypcbiAgUmVuZGVyIGFsbCByZXN0YXVyYW50cyB1c2luZyB0aGUgcmVzdGF1cmFudCB0ZW1wbGF0ZVxuKi9cbmZ1bmN0aW9uIHNob3dSZXN0YXVyYW50cyhyZXN0YXVyYW50cykge1xuICBcbiAgdmFyIHJlc3RhdXJhbnRzTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0JyksXG4gIGh0bWwgPSByZXN0YXVyYW50cy5tYXAocmVzdCA9PiByZXN0YXVyYW50VG1wbChyZXN0KSk7XG4gIHJlc3RhdXJhbnRzTGlzdC5pbm5lckhUTUwgPSBodG1sLmpvaW4oJycpO1xuXG59XG5cbi8qXG4gIEF2ZXJhZ2Ugb2YgYW4gYXJyYXkgb2YgbnVtYmVyc1xuKi9cbmZ1bmN0aW9uIGF2ZyhhcnJheSkge1xuICByZXR1cm4gYXJyYXkucmVkdWNlKChwcmV2LCBjdXIpID0+IHByZXYgKyBjdXIsIDApL2FycmF5Lmxlbmd0aDtcbn1cblxuLypcbiAgQ2FsY3VsYXRlIHRoZSBhdmVyYWdlIGZyb20gYWxsIHN0YXJzIGluIHRoZSByZXZpZXdzXG4qL1xuZnVuY3Rpb24gY2FsY3VsYXRlU3RhcnMocmV2aWV3cykge1xuXG4gIHZhciBzdGFycyA9IHJldmlld3MubWFwKChyZXZpZXcpID0+IHJldmlldy5zdGFycyk7XG4gIHJldHVybiBhdmcoc3RhcnMpIDtcblxufVxuXG4vKlxuICBDYWxjdWxhdGUgaG93IGZ1bGwgaXMgdGhlIGN1cnJlbnQgc3RhclxuKi9cbmZ1bmN0aW9uIHN0YXJUeXBlKG9yZGVyLCBudW1iZXIpIHtcblxuICBpZihudW1iZXIgLSBvcmRlciA9PSAtMC41KSB7XG4gICAgcmV0dXJuICdoYWxmJztcbiAgfSBlbHNlIGlmKG51bWJlciAtIG9yZGVyID49IDApIHtcbiAgICByZXR1cm4gJ2Z1bGwnXG4gIH1cblxuICByZXR1cm4gJ2VtcHR5JztcblxufVxuXG4vLy0tLS0tLS0tLS0gVGVtcGxhdGVzIC0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gcmVzdGF1cmFudFRtcGwocmVzdGF1cmFudCkge1xuXG4gIHJldHVybiBgPGFydGljbGUgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgIDxoMj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cIiNtb3JlXCI+XG4gICAgICAgICAgICAgICAgJHtyZXN0YXVyYW50Lm5hbWV9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgJHtzdGFyc1RtcGwoY2FsY3VsYXRlU3RhcnMocmVzdGF1cmFudC5yZXZpZXdzKSl9XG4gICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRodW1iXCI+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtyZXN0YXVyYW50LnBob3RvfVwiIGFsdD1cIiR7cmVzdGF1cmFudC5uYW1lfSBQaG90b2dyYXBoXCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2NhdGlvblwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Mb2NhdGlvbjo8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmEgZmEtbWFwLW1hcmtlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gXG4gICAgICAgICAgICAgICR7cmVzdGF1cmFudC5hZGRyZXNzfVxuICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1hcHNcIiBocmVmPVwiJHttYXBzTGluayhyZXN0YXVyYW50LmFkZHJlc3MpfVwiIHRhcmdldD1cIl9ibGFua1wiPk9wZW4gaW4gTWFwczwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9wZW5pbmdcIj5cbiAgICAgICAgICAgICAgT3BlbnM6ICR7b3BlbmluZ1RtcGwocmVzdGF1cmFudC5vcGVuaW5nSG91cnMpfSBcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICR7cmVzdGF1cmFudC5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjEyIHJldmlld3MgLSBBZGQgeW91ciByZXZpZXdcIi8+XG4gICAgICAgICAgPC9hcnRpY2xlPmA7XG5cbn1cblxuZnVuY3Rpb24gb3BlbmluZ1RtcGwob3BlbmluZ0hvdXJzKSB7XG5cbiAgcmV0dXJuIG9wZW5pbmdIb3Vycy5tYXAodGltZVRtcGwpLmpvaW4oJyB8ICcpO1xuXG59XG5cbmZ1bmN0aW9uIHRpbWVUbXBsKHRpbWUpIHtcblxuICByZXR1cm4gYDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JHt0aW1lLm9wZW59IC0gJHt0aW1lLmNsb3NlfTwvc3Bhbj5gO1xuXG59XG5cbmZ1bmN0aW9uIHN0YXJzVG1wbChudW1iZXIpIHtcblxuICByZXR1cm4gYDxkaXYgY2xhc3M9XCJzdGFyc1wiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+JHtudW1iZXJ9IHN0YXJzPC9zcGFuPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoMSwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSgyLCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDMsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoNCwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSg1LCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICA8L2Rpdj5gO1xuXG59XG5cbmZ1bmN0aW9uIG1hcHNMaW5rKGFkZHJlc3MpIHtcblxuICByZXR1cm4gYGh0dHA6Ly9tYXBzLmdvb2dsZS5jb20vP3E9JHtlbmNvZGVVUklDb21wb25lbnQoYWRkcmVzcyl9YDtcblxufSIsImltcG9ydCAqIGFzIEFwcCBmcm9tICcuL2FwcC5qcyc7XG5cbihmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiByZWFkeSgpIHtcbiAgICAgIFxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIFxuICAgICAgLy8gcmVzb2x2ZSB0aGUgcHJvbWlzZSB3aGVuIHRoZSBkb2N1bWVudCBpcyByZWFkeVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnbG9hZGluZycpIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfTtcblxuICByZWFkeSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgQXBwLmluaXQoKTtcblxuICAgIC8vIGFkZCBmaWx0ZXJpbmcgbGlzdGVuZXJzXG4gICAgdmFyIHR5cGVCdXR0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3R5cGUnKTtcbiAgICBmb3IodmFyIGk9MDsgaSA8IHR5cGVCdXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0eXBlQnV0dG9uc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuXG4gICAgICAgIEFwcC5maWx0ZXJCeVR5cGUodGhpcy52YWx1ZSk7XG5cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCBpbnB1dCBsaXN0ZW5lciBmb3IgdGhlIHNlYXJjaCBib3gsIHdlIHdhbnQgdG8gdXBkYXRlXG4gICAgLy8gdGhlIGxpc3Qgb24gZWFjaCBrZXlzdHJva2UgKHRoZSBsaXN0IGlzIGFscmVhZHkgY29tcGxldGVseSBcbiAgICAvLyBsb2FkZWQgc28gdGhpcyBkb2Vzbid0IG1ha2UgbW9yZSByZXF1ZXN0cylcbiAgICB2YXIgbmFtZUZpbHRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2hib3gnKTtcbiAgICBuYW1lRmlsdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIEFwcC5maWx0ZXJCeU5hbWUodGhpcy52YWx1ZSk7XG5cbiAgICB9KTtcblxuICB9KTtcblxufSkoKTsiXX0=
