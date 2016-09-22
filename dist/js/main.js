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

function showRestaurants(restaurants) {

  var restaurantsList = document.getElementById('restaurants-list'),
      html = restaurants.map(function (rest) {
    return restaurantTmpl(rest);
  });
  restaurantsList.innerHTML = html.join();
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

function avg(array) {
  return array.reduce(function (prev, cur) {
    return prev + cur;
  }, 0) / array.length;
}

function calculateStars(reviews) {

  var stars = reviews.map(function (review) {
    return review.stars;
  });
  return avg(stars);
}

function starType(order, number) {

  if (number - order == -0.5) {
    return 'half';
  } else if (number - order >= 0) {
    return 'full';
  }

  return 'empty';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7UUNLZ0IsSSxHQUFBLEk7O0FBSmhCOzs7O0FBSU8sU0FBUyxJQUFULEdBQWdCOztBQUVyQixRQUFNLHVCQUFOLEVBQ0csSUFESCxDQUNRO0FBQUEsV0FBWSxTQUFTLElBQVQsRUFBWjtBQUFBLEdBRFIsRUFFRyxJQUZILENBRVEsZUFGUixFQUdHLEtBSEgsQ0FHUyxVQUFTLEtBQVQsRUFBZ0I7QUFDckIsWUFBUSxLQUFSLENBQWMsaUNBQWQsRUFBaUQsS0FBakQ7QUFDRCxHQUxIO0FBT0Q7O0FBRUQsU0FBUyxlQUFULENBQXlCLFdBQXpCLEVBQXNDOztBQUVwQyxNQUFJLGtCQUFrQixTQUFTLGNBQVQsQ0FBd0Isa0JBQXhCLENBQXRCO0FBQUEsTUFDQSxPQUFPLFlBQVksR0FBWixDQUFnQjtBQUFBLFdBQVEsZUFBZSxJQUFmLENBQVI7QUFBQSxHQUFoQixDQURQO0FBRUEsa0JBQWdCLFNBQWhCLEdBQTRCLEtBQUssSUFBTCxFQUE1QjtBQUVEOztBQUVEO0FBQ0EsU0FBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DOztBQUVsQyx1R0FHZ0IsV0FBVyxJQUgzQiw0Q0FLYyxVQUFVLGVBQWUsV0FBVyxPQUExQixDQUFWLENBTGQsc0ZBUXdCLFdBQVcsS0FSbkMsZUFRa0QsV0FBVyxJQVI3RCw2TkFhYyxXQUFXLE9BYnpCLDhDQWNvQyxTQUFTLFdBQVcsT0FBcEIsQ0FkcEMsd0hBaUJxQixZQUFZLFdBQVcsWUFBdkIsQ0FqQnJCLG9GQW9CYyxXQUFXLFdBcEJ6QjtBQXlCRDs7QUFFRCxTQUFTLFdBQVQsQ0FBcUIsWUFBckIsRUFBbUM7O0FBRWpDLFNBQU8sYUFBYSxHQUFiLENBQWlCLFFBQWpCLEVBQTJCLElBQTNCLENBQWdDLEtBQWhDLENBQVA7QUFFRDs7QUFFRCxTQUFTLFFBQVQsQ0FBa0IsSUFBbEIsRUFBd0I7O0FBRXRCLHlDQUFxQyxLQUFLLElBQTFDLFdBQW9ELEtBQUssS0FBekQ7QUFFRDs7QUFFRCxTQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQW9CO0FBQ2xCLFNBQU8sTUFBTSxNQUFOLENBQWEsVUFBQyxJQUFELEVBQU8sR0FBUDtBQUFBLFdBQWUsT0FBTyxHQUF0QjtBQUFBLEdBQWIsRUFBd0MsQ0FBeEMsSUFBMkMsTUFBTSxNQUF4RDtBQUNEOztBQUVELFNBQVMsY0FBVCxDQUF3QixPQUF4QixFQUFpQzs7QUFFL0IsTUFBSSxRQUFRLFFBQVEsR0FBUixDQUFZLFVBQUMsTUFBRDtBQUFBLFdBQVksT0FBTyxLQUFuQjtBQUFBLEdBQVosQ0FBWjtBQUNBLFNBQU8sSUFBSSxLQUFKLENBQVA7QUFFRDs7QUFFRCxTQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFBeUIsTUFBekIsRUFBaUM7O0FBRS9CLE1BQUcsU0FBUyxLQUFULElBQWtCLENBQUMsR0FBdEIsRUFBMkI7QUFDekIsV0FBTyxNQUFQO0FBQ0QsR0FGRCxNQUVPLElBQUcsU0FBUyxLQUFULElBQWtCLENBQXJCLEVBQXdCO0FBQzdCLFdBQU8sTUFBUDtBQUNEOztBQUVELFNBQU8sT0FBUDtBQUVEOztBQUVELFNBQVMsU0FBVCxDQUFtQixNQUFuQixFQUEyQjs7QUFFekIscUVBQ2tDLE1BRGxDLHdEQUVpQyxTQUFTLENBQVQsRUFBWSxNQUFaLENBRmpDLG9FQUdpQyxTQUFTLENBQVQsRUFBWSxNQUFaLENBSGpDLG9FQUlpQyxTQUFTLENBQVQsRUFBWSxNQUFaLENBSmpDLG9FQUtpQyxTQUFTLENBQVQsRUFBWSxNQUFaLENBTGpDLG9FQU1pQyxTQUFTLENBQVQsRUFBWSxNQUFaLENBTmpDO0FBU0Q7O0FBRUQsU0FBUyxRQUFULENBQWtCLE9BQWxCLEVBQTJCOztBQUV6Qix3Q0FBb0MsbUJBQW1CLE9BQW5CLENBQXBDO0FBRUQ7Ozs7O0FDMUdEOztJQUFZLEc7Ozs7QUFFWixDQUFDLFlBQVc7O0FBRVYsV0FBUyxLQUFULEdBQWlCOztBQUVmLFdBQU8sSUFBSSxPQUFKLENBQVksVUFBUyxPQUFULEVBQWtCLE1BQWxCLEVBQTBCOztBQUUzQztBQUNBLGVBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQVc7QUFDdkQsWUFBRyxTQUFTLFVBQVQsS0FBd0IsU0FBM0IsRUFBc0M7QUFDcEM7QUFDRDtBQUNGLE9BSkQ7QUFNRCxLQVRNLENBQVA7QUFXRDs7QUFFRCxVQUFRLElBQVIsQ0FBYSxZQUFXO0FBQ3RCLFFBQUksSUFBSjtBQUNELEdBRkQ7QUFJRCxDQXJCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbi8qIFxuICBJbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvbiBsb2FkaW5nIHRoZSByZXN0YXVyYW50cyBkYXRhIFxuICBhbmQgYWRkaW5nIHRoZSBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIGludGVyYWN0aXZlIGVsZW1lbnRzLlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuXG4gIGZldGNoKCdkYXRhL3Jlc3RhdXJhbnRzLmpzb24nKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAudGhlbihzaG93UmVzdGF1cmFudHMpXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgbG9hZCB0aGUgcmVzdGF1cmFudHMuJywgZXJyb3IpO1xuICAgIH0pO1xuXG59XG5cbmZ1bmN0aW9uIHNob3dSZXN0YXVyYW50cyhyZXN0YXVyYW50cykge1xuICBcbiAgdmFyIHJlc3RhdXJhbnRzTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0JyksXG4gIGh0bWwgPSByZXN0YXVyYW50cy5tYXAocmVzdCA9PiByZXN0YXVyYW50VG1wbChyZXN0KSk7XG4gIHJlc3RhdXJhbnRzTGlzdC5pbm5lckhUTUwgPSBodG1sLmpvaW4oKTtcblxufVxuXG4vLy0tLS0tLS0tLS0gVGVtcGxhdGVzIC0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gcmVzdGF1cmFudFRtcGwocmVzdGF1cmFudCkge1xuXG4gIHJldHVybiBgPGFydGljbGUgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgIDxoMj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cIiNtb3JlXCI+XG4gICAgICAgICAgICAgICAgJHtyZXN0YXVyYW50Lm5hbWV9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgJHtzdGFyc1RtcGwoY2FsY3VsYXRlU3RhcnMocmVzdGF1cmFudC5yZXZpZXdzKSl9XG4gICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRodW1iXCI+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtyZXN0YXVyYW50LnBob3RvfVwiIGFsdD1cIiR7cmVzdGF1cmFudC5uYW1lfSBQaG90b2dyYXBoXCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2NhdGlvblwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Mb2NhdGlvbjo8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmEgZmEtbWFwLW1hcmtlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gXG4gICAgICAgICAgICAgICR7cmVzdGF1cmFudC5hZGRyZXNzfVxuICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1hcHNcIiBocmVmPVwiJHttYXBzTGluayhyZXN0YXVyYW50LmFkZHJlc3MpfVwiIHRhcmdldD1cIl9ibGFua1wiPk9wZW4gaW4gTWFwczwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9wZW5pbmdcIj5cbiAgICAgICAgICAgICAgT3BlbnM6ICR7b3BlbmluZ1RtcGwocmVzdGF1cmFudC5vcGVuaW5nSG91cnMpfSBcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICR7cmVzdGF1cmFudC5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjEyIHJldmlld3MgLSBBZGQgeW91ciByZXZpZXdcIi8+XG4gICAgICAgICAgPC9hcnRpY2xlPmA7XG5cbn1cblxuZnVuY3Rpb24gb3BlbmluZ1RtcGwob3BlbmluZ0hvdXJzKSB7XG5cbiAgcmV0dXJuIG9wZW5pbmdIb3Vycy5tYXAodGltZVRtcGwpLmpvaW4oJyB8ICcpO1xuXG59XG5cbmZ1bmN0aW9uIHRpbWVUbXBsKHRpbWUpIHtcblxuICByZXR1cm4gYDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JHt0aW1lLm9wZW59IC0gJHt0aW1lLmNsb3NlfTwvc3Bhbj5gO1xuXG59XG5cbmZ1bmN0aW9uIGF2ZyhhcnJheSkge1xuICByZXR1cm4gYXJyYXkucmVkdWNlKChwcmV2LCBjdXIpID0+IHByZXYgKyBjdXIsIDApL2FycmF5Lmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlU3RhcnMocmV2aWV3cykge1xuXG4gIHZhciBzdGFycyA9IHJldmlld3MubWFwKChyZXZpZXcpID0+IHJldmlldy5zdGFycyk7XG4gIHJldHVybiBhdmcoc3RhcnMpIDtcblxufVxuXG5mdW5jdGlvbiBzdGFyVHlwZShvcmRlciwgbnVtYmVyKSB7XG5cbiAgaWYobnVtYmVyIC0gb3JkZXIgPT0gLTAuNSkge1xuICAgIHJldHVybiAnaGFsZic7XG4gIH0gZWxzZSBpZihudW1iZXIgLSBvcmRlciA+PSAwKSB7XG4gICAgcmV0dXJuICdmdWxsJ1xuICB9XG5cbiAgcmV0dXJuICdlbXB0eSc7XG5cbn1cblxuZnVuY3Rpb24gc3RhcnNUbXBsKG51bWJlcikge1xuXG4gIHJldHVybiBgPGRpdiBjbGFzcz1cInN0YXJzXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj4ke251bWJlcn0gc3RhcnM8L3NwYW4+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSgxLCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDIsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoMywgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSg0LCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDUsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgIDwvZGl2PmA7XG5cbn1cblxuZnVuY3Rpb24gbWFwc0xpbmsoYWRkcmVzcykge1xuXG4gIHJldHVybiBgaHR0cDovL21hcHMuZ29vZ2xlLmNvbS8/cT0ke2VuY29kZVVSSUNvbXBvbmVudChhZGRyZXNzKX1gO1xuXG59IiwiaW1wb3J0ICogYXMgQXBwIGZyb20gJy4vYXBwLmpzJztcblxuKGZ1bmN0aW9uKCkge1xuXG4gIGZ1bmN0aW9uIHJlYWR5KCkge1xuICAgICAgXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgXG4gICAgICAvLyByZXNvbHZlIHRoZSBwcm9taXNlIHdoZW4gdGhlIGRvY3VtZW50IGlzIHJlYWR5XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdsb2FkaW5nJykge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9O1xuXG4gIHJlYWR5KCkudGhlbihmdW5jdGlvbigpIHtcbiAgICBBcHAuaW5pdCgpO1xuICB9KTtcblxufSkoKTsiXX0=
