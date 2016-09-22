(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.filterByTypeHandler = filterByTypeHandler;

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

function filterByTypeHandler(event) {

  var type = this.children[0].value; // gets the value of the input FIXME: too ugly :P
  showRestaurants(restaurants.filter(function (restaurant) {
    return restaurant.type === type;
  }));
}

/* 
  Stores the restaurants array in a variable for filters 
  They could be stored to localstorage or indexedDB
  but for this app it will do with a module variable.
*/
var restaurants;
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
      typeButtons[i].addEventListener('click', App.filterByTypeHandler);
    }
  });
})();

},{"./app.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7UUNLZ0IsSSxHQUFBLEk7UUFZQSxtQixHQUFBLG1COztBQWhCaEI7Ozs7QUFJTyxTQUFTLElBQVQsR0FBZ0I7O0FBRXJCLFFBQU0sdUJBQU4sRUFDRyxJQURILENBQ1E7QUFBQSxXQUFZLFNBQVMsSUFBVCxFQUFaO0FBQUEsR0FEUixFQUVHLElBRkgsQ0FFUSxnQkFGUixFQUdHLElBSEgsQ0FHUSxlQUhSLEVBSUcsS0FKSCxDQUlTLFVBQVMsS0FBVCxFQUFnQjtBQUNyQixZQUFRLEtBQVIsQ0FBYyxpQ0FBZCxFQUFpRCxLQUFqRDtBQUNELEdBTkg7QUFRRDs7QUFFTSxTQUFTLG1CQUFULENBQTZCLEtBQTdCLEVBQW9DOztBQUV6QyxNQUFJLE9BQU8sS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixLQUE1QixDQUZ5QyxDQUVOO0FBQ25DLGtCQUFnQixZQUFZLE1BQVosQ0FBbUIsVUFBQyxVQUFEO0FBQUEsV0FDakMsV0FBVyxJQUFYLEtBQW9CLElBRGE7QUFBQSxHQUFuQixDQUFoQjtBQUlEOztBQUVEOzs7OztBQUtBLElBQUksV0FBSjtBQUNBLFNBQVMsZ0JBQVQsQ0FBMEIsR0FBMUIsRUFBK0I7QUFDN0IsZ0JBQWMsR0FBZDtBQUNBLFNBQU8sR0FBUDtBQUNEOztBQUVEOzs7QUFHQSxTQUFTLGVBQVQsQ0FBeUIsV0FBekIsRUFBc0M7O0FBRXBDLE1BQUksa0JBQWtCLFNBQVMsY0FBVCxDQUF3QixrQkFBeEIsQ0FBdEI7QUFBQSxNQUNBLE9BQU8sWUFBWSxHQUFaLENBQWdCO0FBQUEsV0FBUSxlQUFlLElBQWYsQ0FBUjtBQUFBLEdBQWhCLENBRFA7QUFFQSxrQkFBZ0IsU0FBaEIsR0FBNEIsS0FBSyxJQUFMLENBQVUsRUFBVixDQUE1QjtBQUVEOztBQUVEOzs7QUFHQSxTQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQW9CO0FBQ2xCLFNBQU8sTUFBTSxNQUFOLENBQWEsVUFBQyxJQUFELEVBQU8sR0FBUDtBQUFBLFdBQWUsT0FBTyxHQUF0QjtBQUFBLEdBQWIsRUFBd0MsQ0FBeEMsSUFBMkMsTUFBTSxNQUF4RDtBQUNEOztBQUVEOzs7QUFHQSxTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsRUFBaUM7O0FBRS9CLE1BQUksUUFBUSxRQUFRLEdBQVIsQ0FBWSxVQUFDLE1BQUQ7QUFBQSxXQUFZLE9BQU8sS0FBbkI7QUFBQSxHQUFaLENBQVo7QUFDQSxTQUFPLElBQUksS0FBSixDQUFQO0FBRUQ7O0FBRUQ7OztBQUdBLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUF5QixNQUF6QixFQUFpQzs7QUFFL0IsTUFBRyxTQUFTLEtBQVQsSUFBa0IsQ0FBQyxHQUF0QixFQUEyQjtBQUN6QixXQUFPLE1BQVA7QUFDRCxHQUZELE1BRU8sSUFBRyxTQUFTLEtBQVQsSUFBa0IsQ0FBckIsRUFBd0I7QUFDN0IsV0FBTyxNQUFQO0FBQ0Q7O0FBRUQsU0FBTyxPQUFQO0FBRUQ7O0FBRUQ7QUFDQSxTQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0M7O0FBRWxDLHVHQUdnQixXQUFXLElBSDNCLDRDQUtjLFVBQVUsZUFBZSxXQUFXLE9BQTFCLENBQVYsQ0FMZCxzRkFRd0IsV0FBVyxLQVJuQyxlQVFrRCxXQUFXLElBUjdELDZOQWFjLFdBQVcsT0FiekIsOENBY29DLFNBQVMsV0FBVyxPQUFwQixDQWRwQyx3SEFpQnFCLFlBQVksV0FBVyxZQUF2QixDQWpCckIsb0ZBb0JjLFdBQVcsV0FwQnpCO0FBeUJEOztBQUVELFNBQVMsV0FBVCxDQUFxQixZQUFyQixFQUFtQzs7QUFFakMsU0FBTyxhQUFhLEdBQWIsQ0FBaUIsUUFBakIsRUFBMkIsSUFBM0IsQ0FBZ0MsS0FBaEMsQ0FBUDtBQUVEOztBQUVELFNBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF3Qjs7QUFFdEIseUNBQXFDLEtBQUssSUFBMUMsV0FBb0QsS0FBSyxLQUF6RDtBQUVEOztBQUVELFNBQVMsU0FBVCxDQUFtQixNQUFuQixFQUEyQjs7QUFFekIscUVBQ2tDLE1BRGxDLHdEQUVpQyxTQUFTLENBQVQsRUFBWSxNQUFaLENBRmpDLG9FQUdpQyxTQUFTLENBQVQsRUFBWSxNQUFaLENBSGpDLG9FQUlpQyxTQUFTLENBQVQsRUFBWSxNQUFaLENBSmpDLG9FQUtpQyxTQUFTLENBQVQsRUFBWSxNQUFaLENBTGpDLG9FQU1pQyxTQUFTLENBQVQsRUFBWSxNQUFaLENBTmpDO0FBU0Q7O0FBRUQsU0FBUyxRQUFULENBQWtCLE9BQWxCLEVBQTJCOztBQUV6Qix3Q0FBb0MsbUJBQW1CLE9BQW5CLENBQXBDO0FBRUQ7Ozs7O0FDM0lEOztJQUFZLEc7Ozs7QUFFWixDQUFDLFlBQVc7O0FBRVYsV0FBUyxLQUFULEdBQWlCOztBQUVmLFdBQU8sSUFBSSxPQUFKLENBQVksVUFBUyxPQUFULEVBQWtCLE1BQWxCLEVBQTBCOztBQUUzQztBQUNBLGVBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQVc7QUFDdkQsWUFBRyxTQUFTLFVBQVQsS0FBd0IsU0FBM0IsRUFBc0M7QUFDcEM7QUFDRDtBQUNGLE9BSkQ7QUFNRCxLQVRNLENBQVA7QUFXRDs7QUFFRCxVQUFRLElBQVIsQ0FBYSxZQUFXO0FBQ3RCLFFBQUksSUFBSjs7QUFFQTtBQUNBLFFBQUksY0FBYyxTQUFTLHNCQUFULENBQWdDLGFBQWhDLENBQWxCO0FBQ0EsU0FBSSxJQUFJLElBQUUsQ0FBVixFQUFhLElBQUksWUFBWSxNQUE3QixFQUFxQyxHQUFyQyxFQUEwQztBQUN4QyxrQkFBWSxDQUFaLEVBQWUsZ0JBQWYsQ0FBZ0MsT0FBaEMsRUFBeUMsSUFBSSxtQkFBN0M7QUFDRDtBQUVGLEdBVEQ7QUFXRCxDQTVCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbi8qIFxuICBJbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvbiBsb2FkaW5nIHRoZSByZXN0YXVyYW50cyBkYXRhIFxuICBhbmQgYWRkaW5nIHRoZSBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIGludGVyYWN0aXZlIGVsZW1lbnRzLlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuXG4gIGZldGNoKCdkYXRhL3Jlc3RhdXJhbnRzLmpzb24nKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAudGhlbihzdG9yZVJlc3RhdXJhbnRzKVxuICAgIC50aGVuKHNob3dSZXN0YXVyYW50cylcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBsb2FkIHRoZSByZXN0YXVyYW50cy4nLCBlcnJvcik7XG4gICAgfSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckJ5VHlwZUhhbmRsZXIoZXZlbnQpIHtcblxuICB2YXIgdHlwZSA9IHRoaXMuY2hpbGRyZW5bMF0udmFsdWU7IC8vIGdldHMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBGSVhNRTogdG9vIHVnbHkgOlBcbiAgc2hvd1Jlc3RhdXJhbnRzKHJlc3RhdXJhbnRzLmZpbHRlcigocmVzdGF1cmFudCkgPT4gXG4gICAgcmVzdGF1cmFudC50eXBlID09PSB0eXBlXG4gICkpO1xuXG59XG5cbi8qIFxuICBTdG9yZXMgdGhlIHJlc3RhdXJhbnRzIGFycmF5IGluIGEgdmFyaWFibGUgZm9yIGZpbHRlcnMgXG4gIFRoZXkgY291bGQgYmUgc3RvcmVkIHRvIGxvY2Fsc3RvcmFnZSBvciBpbmRleGVkREJcbiAgYnV0IGZvciB0aGlzIGFwcCBpdCB3aWxsIGRvIHdpdGggYSBtb2R1bGUgdmFyaWFibGUuXG4qL1xudmFyIHJlc3RhdXJhbnRzO1xuZnVuY3Rpb24gc3RvcmVSZXN0YXVyYW50cyhyZXMpIHtcbiAgcmVzdGF1cmFudHMgPSByZXM7XG4gIHJldHVybiByZXM7XG59XG5cbi8qXG4gIFJlbmRlciBhbGwgcmVzdGF1cmFudHMgdXNpbmcgdGhlIHJlc3RhdXJhbnQgdGVtcGxhdGVcbiovXG5mdW5jdGlvbiBzaG93UmVzdGF1cmFudHMocmVzdGF1cmFudHMpIHtcbiAgXG4gIHZhciByZXN0YXVyYW50c0xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudHMtbGlzdCcpLFxuICBodG1sID0gcmVzdGF1cmFudHMubWFwKHJlc3QgPT4gcmVzdGF1cmFudFRtcGwocmVzdCkpO1xuICByZXN0YXVyYW50c0xpc3QuaW5uZXJIVE1MID0gaHRtbC5qb2luKCcnKTtcblxufVxuXG4vKlxuICBBdmVyYWdlIG9mIGFuIGFycmF5IG9mIG51bWJlcnNcbiovXG5mdW5jdGlvbiBhdmcoYXJyYXkpIHtcbiAgcmV0dXJuIGFycmF5LnJlZHVjZSgocHJldiwgY3VyKSA9PiBwcmV2ICsgY3VyLCAwKS9hcnJheS5sZW5ndGg7XG59XG5cbi8qXG4gIENhbGN1bGF0ZSB0aGUgYXZlcmFnZSBmcm9tIGFsbCBzdGFycyBpbiB0aGUgcmV2aWV3c1xuKi9cbmZ1bmN0aW9uIGNhbGN1bGF0ZVN0YXJzKHJldmlld3MpIHtcblxuICB2YXIgc3RhcnMgPSByZXZpZXdzLm1hcCgocmV2aWV3KSA9PiByZXZpZXcuc3RhcnMpO1xuICByZXR1cm4gYXZnKHN0YXJzKSA7XG5cbn1cblxuLypcbiAgQ2FsY3VsYXRlIGhvdyBmdWxsIGlzIHRoZSBjdXJyZW50IHN0YXJcbiovXG5mdW5jdGlvbiBzdGFyVHlwZShvcmRlciwgbnVtYmVyKSB7XG5cbiAgaWYobnVtYmVyIC0gb3JkZXIgPT0gLTAuNSkge1xuICAgIHJldHVybiAnaGFsZic7XG4gIH0gZWxzZSBpZihudW1iZXIgLSBvcmRlciA+PSAwKSB7XG4gICAgcmV0dXJuICdmdWxsJ1xuICB9XG5cbiAgcmV0dXJuICdlbXB0eSc7XG5cbn1cblxuLy8tLS0tLS0tLS0tIFRlbXBsYXRlcyAtLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIHJlc3RhdXJhbnRUbXBsKHJlc3RhdXJhbnQpIHtcblxuICByZXR1cm4gYDxhcnRpY2xlIGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICA8aDI+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCIjbW9yZVwiPlxuICAgICAgICAgICAgICAgICR7cmVzdGF1cmFudC5uYW1lfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICR7c3RhcnNUbXBsKGNhbGN1bGF0ZVN0YXJzKHJlc3RhdXJhbnQucmV2aWV3cykpfVxuICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aHVtYlwiPlxuICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7cmVzdGF1cmFudC5waG90b31cIiBhbHQ9XCIke3Jlc3RhdXJhbnQubmFtZX0gUGhvdG9ncmFwaFwiPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9jYXRpb25cIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+TG9jYXRpb246PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZhIGZhLW1hcC1tYXJrZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IFxuICAgICAgICAgICAgICAke3Jlc3RhdXJhbnQuYWRkcmVzc31cbiAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtYXBzXCIgaHJlZj1cIiR7bWFwc0xpbmsocmVzdGF1cmFudC5hZGRyZXNzKX1cIiB0YXJnZXQ9XCJfYmxhbmtcIj5PcGVuIGluIE1hcHM8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvcGVuaW5nXCI+XG4gICAgICAgICAgICAgIE9wZW5zOiAke29wZW5pbmdUbXBsKHJlc3RhdXJhbnQub3BlbmluZ0hvdXJzKX0gXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAke3Jlc3RhdXJhbnQuZGVzY3JpcHRpb259XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCIxMiByZXZpZXdzIC0gQWRkIHlvdXIgcmV2aWV3XCIvPlxuICAgICAgICAgIDwvYXJ0aWNsZT5gO1xuXG59XG5cbmZ1bmN0aW9uIG9wZW5pbmdUbXBsKG9wZW5pbmdIb3Vycykge1xuXG4gIHJldHVybiBvcGVuaW5nSG91cnMubWFwKHRpbWVUbXBsKS5qb2luKCcgfCAnKTtcblxufVxuXG5mdW5jdGlvbiB0aW1lVG1wbCh0aW1lKSB7XG5cbiAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInRleHQtc3VjY2Vzc1wiPiR7dGltZS5vcGVufSAtICR7dGltZS5jbG9zZX08L3NwYW4+YDtcblxufVxuXG5mdW5jdGlvbiBzdGFyc1RtcGwobnVtYmVyKSB7XG5cbiAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwic3RhcnNcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPiR7bnVtYmVyfSBzdGFyczwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDEsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoMiwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSgzLCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDQsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoNSwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgPC9kaXY+YDtcblxufVxuXG5mdW5jdGlvbiBtYXBzTGluayhhZGRyZXNzKSB7XG5cbiAgcmV0dXJuIGBodHRwOi8vbWFwcy5nb29nbGUuY29tLz9xPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGFkZHJlc3MpfWA7XG5cbn0iLCJpbXBvcnQgKiBhcyBBcHAgZnJvbSAnLi9hcHAuanMnO1xuXG4oZnVuY3Rpb24oKSB7XG5cbiAgZnVuY3Rpb24gcmVhZHkoKSB7XG4gICAgICBcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBcbiAgICAgIC8vIHJlc29sdmUgdGhlIHByb21pc2Ugd2hlbiB0aGUgZG9jdW1lbnQgaXMgcmVhZHlcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnKSB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gIH07XG5cbiAgcmVhZHkoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIEFwcC5pbml0KCk7XG5cbiAgICAvLyBhZGQgZmlsdGVyaW5nIGxpc3RlbmVyc1xuICAgIHZhciB0eXBlQnV0dG9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3R5cGUtYnV0dG9uJyk7XG4gICAgZm9yKHZhciBpPTA7IGkgPCB0eXBlQnV0dG9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdHlwZUJ1dHRvbnNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBBcHAuZmlsdGVyQnlUeXBlSGFuZGxlcik7XG4gICAgfVxuXG4gIH0pO1xuXG59KSgpOyJdfQ==
