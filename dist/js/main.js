(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;

/* 
  Initialize the application loading the restaurants data 
  and adding the event listeners to the interactive elements.
*/
function init() {

  fetch('data/restaurants.json').then(function (response) {
    return response.json();
  }).then(showRestaurants).catch(function (error) {
    console.error('Could not load the restaurants.', error);
  });
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
  });
})();

},{"./app.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7UUNLZ0IsSSxHQUFBLEk7O0FBSmhCOzs7O0FBSU8sU0FBUyxJQUFULEdBQWdCOztBQUVyQixRQUFNLHVCQUFOLEVBQ0csSUFESCxDQUNRO0FBQUEsV0FBWSxTQUFTLElBQVQsRUFBWjtBQUFBLEdBRFIsRUFFRyxJQUZILENBRVEsZUFGUixFQUdHLEtBSEgsQ0FHUyxVQUFTLEtBQVQsRUFBZ0I7QUFDckIsWUFBUSxLQUFSLENBQWMsaUNBQWQsRUFBaUQsS0FBakQ7QUFDRCxHQUxIO0FBT0Q7O0FBRUQ7OztBQUdBLFNBQVMsZUFBVCxDQUF5QixXQUF6QixFQUFzQzs7QUFFcEMsTUFBSSxrQkFBa0IsU0FBUyxjQUFULENBQXdCLGtCQUF4QixDQUF0QjtBQUFBLE1BQ0EsT0FBTyxZQUFZLEdBQVosQ0FBZ0I7QUFBQSxXQUFRLGVBQWUsSUFBZixDQUFSO0FBQUEsR0FBaEIsQ0FEUDtBQUVBLGtCQUFnQixTQUFoQixHQUE0QixLQUFLLElBQUwsQ0FBVSxFQUFWLENBQTVCO0FBRUQ7O0FBRUQ7OztBQUdBLFNBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0I7QUFDbEIsU0FBTyxNQUFNLE1BQU4sQ0FBYSxVQUFDLElBQUQsRUFBTyxHQUFQO0FBQUEsV0FBZSxPQUFPLEdBQXRCO0FBQUEsR0FBYixFQUF3QyxDQUF4QyxJQUEyQyxNQUFNLE1BQXhEO0FBQ0Q7O0FBRUQ7OztBQUdBLFNBQVMsY0FBVCxDQUF3QixPQUF4QixFQUFpQzs7QUFFL0IsTUFBSSxRQUFRLFFBQVEsR0FBUixDQUFZLFVBQUMsTUFBRDtBQUFBLFdBQVksT0FBTyxLQUFuQjtBQUFBLEdBQVosQ0FBWjtBQUNBLFNBQU8sSUFBSSxLQUFKLENBQVA7QUFFRDs7QUFFRDs7O0FBR0EsU0FBUyxRQUFULENBQWtCLEtBQWxCLEVBQXlCLE1BQXpCLEVBQWlDOztBQUUvQixNQUFHLFNBQVMsS0FBVCxJQUFrQixDQUFDLEdBQXRCLEVBQTJCO0FBQ3pCLFdBQU8sTUFBUDtBQUNELEdBRkQsTUFFTyxJQUFHLFNBQVMsS0FBVCxJQUFrQixDQUFyQixFQUF3QjtBQUM3QixXQUFPLE1BQVA7QUFDRDs7QUFFRCxTQUFPLE9BQVA7QUFFRDs7QUFFRDtBQUNBLFNBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQzs7QUFFbEMsdUdBR2dCLFdBQVcsSUFIM0IsNENBS2MsVUFBVSxlQUFlLFdBQVcsT0FBMUIsQ0FBVixDQUxkLHNGQVF3QixXQUFXLEtBUm5DLGVBUWtELFdBQVcsSUFSN0QsNk5BYWMsV0FBVyxPQWJ6Qiw4Q0Fjb0MsU0FBUyxXQUFXLE9BQXBCLENBZHBDLHdIQWlCcUIsWUFBWSxXQUFXLFlBQXZCLENBakJyQixvRkFvQmMsV0FBVyxXQXBCekI7QUF5QkQ7O0FBRUQsU0FBUyxXQUFULENBQXFCLFlBQXJCLEVBQW1DOztBQUVqQyxTQUFPLGFBQWEsR0FBYixDQUFpQixRQUFqQixFQUEyQixJQUEzQixDQUFnQyxLQUFoQyxDQUFQO0FBRUQ7O0FBRUQsU0FBUyxRQUFULENBQWtCLElBQWxCLEVBQXdCOztBQUV0Qix5Q0FBcUMsS0FBSyxJQUExQyxXQUFvRCxLQUFLLEtBQXpEO0FBRUQ7O0FBRUQsU0FBUyxTQUFULENBQW1CLE1BQW5CLEVBQTJCOztBQUV6QixxRUFDa0MsTUFEbEMsd0RBRWlDLFNBQVMsQ0FBVCxFQUFZLE1BQVosQ0FGakMsb0VBR2lDLFNBQVMsQ0FBVCxFQUFZLE1BQVosQ0FIakMsb0VBSWlDLFNBQVMsQ0FBVCxFQUFZLE1BQVosQ0FKakMsb0VBS2lDLFNBQVMsQ0FBVCxFQUFZLE1BQVosQ0FMakMsb0VBTWlDLFNBQVMsQ0FBVCxFQUFZLE1BQVosQ0FOakM7QUFTRDs7QUFFRCxTQUFTLFFBQVQsQ0FBa0IsT0FBbEIsRUFBMkI7O0FBRXpCLHdDQUFvQyxtQkFBbUIsT0FBbkIsQ0FBcEM7QUFFRDs7Ozs7QUN0SEQ7O0lBQVksRzs7OztBQUVaLENBQUMsWUFBVzs7QUFFVixXQUFTLEtBQVQsR0FBaUI7O0FBRWYsV0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFTLE9BQVQsRUFBa0IsTUFBbEIsRUFBMEI7O0FBRTNDO0FBQ0EsZUFBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBVztBQUN2RCxZQUFHLFNBQVMsVUFBVCxLQUF3QixTQUEzQixFQUFzQztBQUNwQztBQUNEO0FBQ0YsT0FKRDtBQU1ELEtBVE0sQ0FBUDtBQVdEOztBQUVELFVBQVEsSUFBUixDQUFhLFlBQVc7QUFDdEIsUUFBSSxJQUFKO0FBQ0QsR0FGRDtBQUlELENBckJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyogXG4gIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uIGxvYWRpbmcgdGhlIHJlc3RhdXJhbnRzIGRhdGEgXG4gIGFuZCBhZGRpbmcgdGhlIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgaW50ZXJhY3RpdmUgZWxlbWVudHMuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgZmV0Y2goJ2RhdGEvcmVzdGF1cmFudHMuanNvbicpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIC50aGVuKHNob3dSZXN0YXVyYW50cylcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBsb2FkIHRoZSByZXN0YXVyYW50cy4nLCBlcnJvcik7XG4gICAgfSk7XG5cbn1cblxuLypcbiAgUmVuZGVyIGFsbCByZXN0YXVyYW50cyB1c2luZyB0aGUgcmVzdGF1cmFudCB0ZW1wbGF0ZVxuKi9cbmZ1bmN0aW9uIHNob3dSZXN0YXVyYW50cyhyZXN0YXVyYW50cykge1xuICBcbiAgdmFyIHJlc3RhdXJhbnRzTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0JyksXG4gIGh0bWwgPSByZXN0YXVyYW50cy5tYXAocmVzdCA9PiByZXN0YXVyYW50VG1wbChyZXN0KSk7XG4gIHJlc3RhdXJhbnRzTGlzdC5pbm5lckhUTUwgPSBodG1sLmpvaW4oJycpO1xuXG59XG5cbi8qXG4gIEF2ZXJhZ2Ugb2YgYW4gYXJyYXkgb2YgbnVtYmVyc1xuKi9cbmZ1bmN0aW9uIGF2ZyhhcnJheSkge1xuICByZXR1cm4gYXJyYXkucmVkdWNlKChwcmV2LCBjdXIpID0+IHByZXYgKyBjdXIsIDApL2FycmF5Lmxlbmd0aDtcbn1cblxuLypcbiAgQ2FsY3VsYXRlIHRoZSBhdmVyYWdlIGZyb20gYWxsIHN0YXJzIGluIHRoZSByZXZpZXdzXG4qL1xuZnVuY3Rpb24gY2FsY3VsYXRlU3RhcnMocmV2aWV3cykge1xuXG4gIHZhciBzdGFycyA9IHJldmlld3MubWFwKChyZXZpZXcpID0+IHJldmlldy5zdGFycyk7XG4gIHJldHVybiBhdmcoc3RhcnMpIDtcblxufVxuXG4vKlxuICBDYWxjdWxhdGUgaG93IGZ1bGwgaXMgdGhlIGN1cnJlbnQgc3RhclxuKi9cbmZ1bmN0aW9uIHN0YXJUeXBlKG9yZGVyLCBudW1iZXIpIHtcblxuICBpZihudW1iZXIgLSBvcmRlciA9PSAtMC41KSB7XG4gICAgcmV0dXJuICdoYWxmJztcbiAgfSBlbHNlIGlmKG51bWJlciAtIG9yZGVyID49IDApIHtcbiAgICByZXR1cm4gJ2Z1bGwnXG4gIH1cblxuICByZXR1cm4gJ2VtcHR5JztcblxufVxuXG4vLy0tLS0tLS0tLS0gVGVtcGxhdGVzIC0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gcmVzdGF1cmFudFRtcGwocmVzdGF1cmFudCkge1xuXG4gIHJldHVybiBgPGFydGljbGUgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgIDxoMj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cIiNtb3JlXCI+XG4gICAgICAgICAgICAgICAgJHtyZXN0YXVyYW50Lm5hbWV9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgJHtzdGFyc1RtcGwoY2FsY3VsYXRlU3RhcnMocmVzdGF1cmFudC5yZXZpZXdzKSl9XG4gICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRodW1iXCI+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtyZXN0YXVyYW50LnBob3RvfVwiIGFsdD1cIiR7cmVzdGF1cmFudC5uYW1lfSBQaG90b2dyYXBoXCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2NhdGlvblwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Mb2NhdGlvbjo8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmEgZmEtbWFwLW1hcmtlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gXG4gICAgICAgICAgICAgICR7cmVzdGF1cmFudC5hZGRyZXNzfVxuICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1hcHNcIiBocmVmPVwiJHttYXBzTGluayhyZXN0YXVyYW50LmFkZHJlc3MpfVwiIHRhcmdldD1cIl9ibGFua1wiPk9wZW4gaW4gTWFwczwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9wZW5pbmdcIj5cbiAgICAgICAgICAgICAgT3BlbnM6ICR7b3BlbmluZ1RtcGwocmVzdGF1cmFudC5vcGVuaW5nSG91cnMpfSBcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICR7cmVzdGF1cmFudC5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjEyIHJldmlld3MgLSBBZGQgeW91ciByZXZpZXdcIi8+XG4gICAgICAgICAgPC9hcnRpY2xlPmA7XG5cbn1cblxuZnVuY3Rpb24gb3BlbmluZ1RtcGwob3BlbmluZ0hvdXJzKSB7XG5cbiAgcmV0dXJuIG9wZW5pbmdIb3Vycy5tYXAodGltZVRtcGwpLmpvaW4oJyB8ICcpO1xuXG59XG5cbmZ1bmN0aW9uIHRpbWVUbXBsKHRpbWUpIHtcblxuICByZXR1cm4gYDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JHt0aW1lLm9wZW59IC0gJHt0aW1lLmNsb3NlfTwvc3Bhbj5gO1xuXG59XG5cbmZ1bmN0aW9uIHN0YXJzVG1wbChudW1iZXIpIHtcblxuICByZXR1cm4gYDxkaXYgY2xhc3M9XCJzdGFyc1wiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+JHtudW1iZXJ9IHN0YXJzPC9zcGFuPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoMSwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSgyLCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDMsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoNCwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSg1LCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICA8L2Rpdj5gO1xuXG59XG5cbmZ1bmN0aW9uIG1hcHNMaW5rKGFkZHJlc3MpIHtcblxuICByZXR1cm4gYGh0dHA6Ly9tYXBzLmdvb2dsZS5jb20vP3E9JHtlbmNvZGVVUklDb21wb25lbnQoYWRkcmVzcyl9YDtcblxufSIsImltcG9ydCAqIGFzIEFwcCBmcm9tICcuL2FwcC5qcyc7XG5cbihmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiByZWFkeSgpIHtcbiAgICAgIFxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIFxuICAgICAgLy8gcmVzb2x2ZSB0aGUgcHJvbWlzZSB3aGVuIHRoZSBkb2N1bWVudCBpcyByZWFkeVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnbG9hZGluZycpIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfTtcblxuICByZWFkeSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgQXBwLmluaXQoKTtcbiAgfSk7XG5cbn0pKCk7Il19
