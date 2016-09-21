(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

  var restaurantsList = document.getElementById('restaurants-list');

  restaurantsList.innerHTML = '';
  restaurants.forEach(function (restaurant) {
    restaurantsList.innerHTML += restaurantTmpl(restaurant);
  });

  console.assert(restaurantsList.childElementCount > 0, 'The app should load some restaurants');
}

function restaurantTmpl(restaurant) {

  console.assert((typeof restaurant === 'undefined' ? 'undefined' : _typeof(restaurant)) === 'object');

  return '<article class="row">\n            <h2>\n              <a href="#more">\n                ' + restaurant.name + '\n              </a>\n              <i class="fa fa-star full" aria-hidden="true"></i>\n              <i class="fa fa-star full" aria-hidden="true"></i>\n              <i class="fa fa-star full" aria-hidden="true"></i>\n              <i class="fa fa-star full" aria-hidden="true"></i>\n              <i class="fa fa-star empty" aria-hidden="true"></i>\n            </h2>\n            <div class="thumb">\n              <img src="' + restaurant.photo + '" alt="' + restaurant.name + ' Photograph">\n            </div>\n            <div class="location">\n              <span class="sr-only">Location:</span>\n              <span class="fa fa-map-marker" aria-hidden="true"></span> \n              ' + restaurant.address + '\n              <a class="maps" href="#" target="_blank">Open in Maps</a>\n            </div>\n            <div class="opening">\n              Opens: <span class="text-success">9:00 - 14:00</span> | <span class="text-success">16:00 - 20:00</span>\n            </div>\n            <div class="description">\n              ' + restaurant.description + '\n            </div>\n            <input type="button" value="12 reviews - Add your review"/>\n          </article>';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7UUNLZ0IsSSxHQUFBLEk7O0FBSmhCOzs7O0FBSU8sU0FBUyxJQUFULEdBQWdCOztBQUVyQixRQUFNLHVCQUFOLEVBQ0csSUFESCxDQUNRO0FBQUEsV0FBWSxTQUFTLElBQVQsRUFBWjtBQUFBLEdBRFIsRUFFRyxJQUZILENBRVEsZUFGUixFQUdHLEtBSEgsQ0FHUyxVQUFTLEtBQVQsRUFBZ0I7QUFDckIsWUFBUSxLQUFSLENBQWMsaUNBQWQsRUFBaUQsS0FBakQ7QUFDRCxHQUxIO0FBT0Q7O0FBRUQsU0FBUyxlQUFULENBQXlCLFdBQXpCLEVBQXNDOztBQUVwQyxNQUFJLGtCQUFrQixTQUFTLGNBQVQsQ0FBd0Isa0JBQXhCLENBQXRCOztBQUVBLGtCQUFnQixTQUFoQixHQUE0QixFQUE1QjtBQUNBLGNBQVksT0FBWixDQUFvQixVQUFTLFVBQVQsRUFBcUI7QUFDdkMsb0JBQWdCLFNBQWhCLElBQTZCLGVBQWUsVUFBZixDQUE3QjtBQUNELEdBRkQ7O0FBSUEsVUFBUSxNQUFSLENBQWUsZ0JBQWdCLGlCQUFoQixHQUFvQyxDQUFuRCxFQUFzRCxzQ0FBdEQ7QUFDRDs7QUFFRCxTQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0M7O0FBRWxDLFVBQVEsTUFBUixDQUFlLFFBQU8sVUFBUCx5Q0FBTyxVQUFQLE9BQXNCLFFBQXJDOztBQUVBLHVHQUdnQixXQUFXLElBSDNCLHFiQVl3QixXQUFXLEtBWm5DLGVBWWtELFdBQVcsSUFaN0QsNk5BaUJjLFdBQVcsT0FqQnpCLDBVQXdCYyxXQUFXLFdBeEJ6QjtBQTZCRDs7Ozs7QUM3REQ7O0lBQVksRzs7OztBQUVaLENBQUMsWUFBVzs7QUFFVixXQUFTLEtBQVQsR0FBaUI7O0FBRWYsV0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFTLE9BQVQsRUFBa0IsTUFBbEIsRUFBMEI7O0FBRTNDO0FBQ0EsZUFBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBVztBQUN2RCxZQUFHLFNBQVMsVUFBVCxLQUF3QixTQUEzQixFQUFzQztBQUNwQztBQUNEO0FBQ0YsT0FKRDtBQU1ELEtBVE0sQ0FBUDtBQVdEOztBQUVELFVBQVEsSUFBUixDQUFhLFlBQVc7QUFDdEIsUUFBSSxJQUFKO0FBQ0QsR0FGRDtBQUlELENBckJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyogXG4gIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uIGxvYWRpbmcgdGhlIHJlc3RhdXJhbnRzIGRhdGEgXG4gIGFuZCBhZGRpbmcgdGhlIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgaW50ZXJhY3RpdmUgZWxlbWVudHMuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgZmV0Y2goJ2RhdGEvcmVzdGF1cmFudHMuanNvbicpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIC50aGVuKHNob3dSZXN0YXVyYW50cylcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBsb2FkIHRoZSByZXN0YXVyYW50cy4nLCBlcnJvcik7XG4gICAgfSk7XG5cbn1cblxuZnVuY3Rpb24gc2hvd1Jlc3RhdXJhbnRzKHJlc3RhdXJhbnRzKSB7XG4gIFxuICB2YXIgcmVzdGF1cmFudHNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnRzLWxpc3QnKTtcblxuICByZXN0YXVyYW50c0xpc3QuaW5uZXJIVE1MID0gJyc7XG4gIHJlc3RhdXJhbnRzLmZvckVhY2goZnVuY3Rpb24ocmVzdGF1cmFudCkge1xuICAgIHJlc3RhdXJhbnRzTGlzdC5pbm5lckhUTUwgKz0gcmVzdGF1cmFudFRtcGwocmVzdGF1cmFudCk7XG4gIH0pXG5cbiAgY29uc29sZS5hc3NlcnQocmVzdGF1cmFudHNMaXN0LmNoaWxkRWxlbWVudENvdW50ID4gMCwgJ1RoZSBhcHAgc2hvdWxkIGxvYWQgc29tZSByZXN0YXVyYW50cycpO1xufVxuXG5mdW5jdGlvbiByZXN0YXVyYW50VG1wbChyZXN0YXVyYW50KSB7XG4gIFxuICBjb25zb2xlLmFzc2VydCh0eXBlb2YgcmVzdGF1cmFudCA9PT0gJ29iamVjdCcpO1xuXG4gIHJldHVybiBgPGFydGljbGUgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgIDxoMj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cIiNtb3JlXCI+XG4gICAgICAgICAgICAgICAgJHtyZXN0YXVyYW50Lm5hbWV9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyIGZ1bGxcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBmdWxsXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgZnVsbFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyIGZ1bGxcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBlbXB0eVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGh1bWJcIj5cbiAgICAgICAgICAgICAgPGltZyBzcmM9XCIke3Jlc3RhdXJhbnQucGhvdG99XCIgYWx0PVwiJHtyZXN0YXVyYW50Lm5hbWV9IFBob3RvZ3JhcGhcIj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvY2F0aW9uXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPkxvY2F0aW9uOjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmYSBmYS1tYXAtbWFya2VyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBcbiAgICAgICAgICAgICAgJHtyZXN0YXVyYW50LmFkZHJlc3N9XG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwibWFwc1wiIGhyZWY9XCIjXCIgdGFyZ2V0PVwiX2JsYW5rXCI+T3BlbiBpbiBNYXBzPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwib3BlbmluZ1wiPlxuICAgICAgICAgICAgICBPcGVuczogPHNwYW4gY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj45OjAwIC0gMTQ6MDA8L3NwYW4+IHwgPHNwYW4gY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj4xNjowMCAtIDIwOjAwPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgJHtyZXN0YXVyYW50LmRlc2NyaXB0aW9ufVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiMTIgcmV2aWV3cyAtIEFkZCB5b3VyIHJldmlld1wiLz5cbiAgICAgICAgICA8L2FydGljbGU+YDtcblxufSIsImltcG9ydCAqIGFzIEFwcCBmcm9tICcuL2FwcC5qcyc7XG5cbihmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiByZWFkeSgpIHtcbiAgICAgIFxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIFxuICAgICAgLy8gcmVzb2x2ZSB0aGUgcHJvbWlzZSB3aGVuIHRoZSBkb2N1bWVudCBpcyByZWFkeVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnbG9hZGluZycpIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfTtcblxuICByZWFkeSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgQXBwLmluaXQoKTtcbiAgfSk7XG5cbn0pKCk7Il19
