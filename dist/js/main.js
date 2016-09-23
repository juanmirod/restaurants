(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.filterByType = filterByType;
exports.filterByName = filterByName;
exports.filterRestaurants = filterRestaurants;

var _modal = require('./modal.js');

var Modal = _interopRequireWildcard(_modal);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

  var restaurantsList = document.getElementById('restaurants-list');
  restaurantsList.innerHTML = '';
  restaurants.forEach(function (restaurant) {

    var restaurantElem = htmlToElement(restaurantTmpl(restaurant));
    var button = restaurantElem.querySelector('.reviews-button');

    button.addEventListener('click', function () {
      return Modal.openModal(restaurant);
    });

    restaurantsList.appendChild(restaurantElem);
  });
}

function htmlToElement(html) {
  var template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstChild;
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

  return '<article class="row">\n            <h2>\n              <a href="#more">\n                ' + restaurant.name + '\n              </a>\n              ' + starsTmpl(calculateStars(restaurant.reviews)) + '\n            </h2>\n            <div class="thumb">\n              <img src="' + restaurant.photo + '" alt="' + restaurant.name + ' Photograph">\n            </div>\n            <div class="location">\n              <span class="sr-only">Location:</span>\n              <span class="fa fa-map-marker" aria-hidden="true"></span> \n              ' + restaurant.address + '\n              <a class="maps" href="' + mapsLink(restaurant.address) + '" target="_blank">Open in Maps</a>\n            </div>\n            <div class="opening">\n              Opens: ' + openingTmpl(restaurant.openingHours) + ' \n            </div>\n            <div class="description">\n              ' + restaurant.description + '\n            </div>\n            <input class="reviews-button" type="button" value="12 reviews - Add your review"/>\n          </article>';
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

},{"./modal.js":3}],2:[function(require,module,exports){
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

},{"./app.js":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openModal = openModal;
exports.closeModal = closeModal;

var focusableElementsString = 'a[href], [role="slider"], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

var wrapper, modal, overlay, closeButton, focusedElementBeforeModal;

function openModal(restaurant) {

  wrapper = document.getElementById('wrapper');
  modal = document.getElementById('modal');
  overlay = document.getElementById('overlay');
  closeButton = document.getElementById('close-modal');

  focusedElementBeforeModal = document.activeElement;

  closeButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // shows the modal and hides the rest of the content for
  // screen readers
  modal.removeAttribute('hidden');
  wrapper.setAttribute('aria-hidden', true);

  // Add keyboard listener to create the focus-trap

  var _findFocusLimitElemen = findFocusLimitElements(modal);

  var firstElement = _findFocusLimitElemen.firstElement;
  var lastElement = _findFocusLimitElemen.lastElement;

  modal.addEventListener('keydown', focusTrapController(firstElement, lastElement));
}

function closeModal() {

  wrapper.removeAttribute('aria-hidden');
  modal.setAttribute('hidden', true);
}

function findFocusLimitElements(modal) {

  // Find all focusable children
  var focusableElements = modal.querySelectorAll(focusableElementsString);

  return {
    firstElement: focusableElements[0],
    lastElement: focusableElements[focusableElements.length - 1]
  };
}

function focusTrapController(firstElement, lastElement) {

  firstElement.focus();

  return function (evt) {
    // Check for TAB key press
    if (evt.keyCode === 9) {

      // SHIFT + TAB
      if (evt.shiftKey) {
        if (document.activeElement === firstElement) {
          evt.preventDefault();
          lastElement.focus();
        }

        // TAB
      } else {
        if (document.activeElement === lastElement) {
          evt.preventDefault();
          firstElement.focus();
        }
      }
    }

    // ESCAPE
    if (evt.keyCode === 27) {
      closeModal();
    }
  };
}

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9tYWluLmpzIiwianMvbW9kYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ1dnQixJLEdBQUEsSTtRQVlBLFksR0FBQSxZO1FBT0EsWSxHQUFBLFk7UUFPQSxpQixHQUFBLGlCOztBQXJDaEI7O0lBQVksSzs7OztBQUVaO0FBQ0EsSUFBSSxXQUFKO0FBQUEsSUFDQSxlQUFlLEVBRGY7QUFBQSxJQUVBLGVBQWUsRUFGZjs7QUFJQTs7OztBQUlPLFNBQVMsSUFBVCxHQUFnQjs7QUFFckIsUUFBTSx1QkFBTixFQUNHLElBREgsQ0FDUTtBQUFBLFdBQVksU0FBUyxJQUFULEVBQVo7QUFBQSxHQURSLEVBRUcsSUFGSCxDQUVRLGdCQUZSLEVBR0csSUFISCxDQUdRLGVBSFIsRUFJRyxLQUpILENBSVMsVUFBUyxLQUFULEVBQWdCO0FBQ3JCLFlBQVEsS0FBUixDQUFjLGlDQUFkLEVBQWlELEtBQWpEO0FBQ0QsR0FOSDtBQVFEOztBQUVNLFNBQVMsWUFBVCxDQUFzQixJQUF0QixFQUE0Qjs7QUFFakMsaUJBQWUsSUFBZjtBQUNBLGtCQUFnQixtQkFBaEI7QUFFRDs7QUFFTSxTQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEI7O0FBRWpDLGlCQUFlLElBQWY7QUFDQSxrQkFBZ0IsbUJBQWhCO0FBRUQ7O0FBRU0sU0FBUyxpQkFBVCxHQUE2Qjs7QUFFbEMsU0FBTyxZQUFZLE1BQVosQ0FBbUIsVUFBQyxVQUFELEVBQWdCOztBQUV4QyxRQUFJLHVCQUF1QixJQUEzQjtBQUFBLFFBQ0EsaUJBQWlCLElBRGpCOztBQUdBLFFBQUcsZ0JBQWdCLEVBQW5CLEVBQXVCOztBQUVyQiw2QkFBdUIsV0FBVyxJQUFYLENBQWdCLE9BQWhCLENBQXdCLFlBQXhCLEtBQXlDLENBQUMsQ0FBakU7QUFFRDs7QUFFRCxRQUFH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QUFhLEtBQWI7O0FBRUEsU0FBTyxVQUFTLEdBQVQsRUFBYztBQUNuQjtBQUNBLFFBQUksSUFBSSxPQUFKLEtBQWdCLENBQXBCLEVBQXVCOztBQUVyQjtBQUNBLFVBQUksSUFBSSxRQUFSLEVBQWtCO0FBQ2hCLFlBQUksU0FBUyxhQUFULEtBQTJCLFlBQS9CLEVBQTZDO0FBQzNDLGNBQUksY0FBSjtBQUNBLHNCQUFZLEtBQVo7QUFDRDs7QUFFSDtBQUNDLE9BUEQsTUFPTztBQUNMLFlBQUksU0FBUyxhQUFULEtBQTJCLFdBQS9CLEVBQTRDO0FBQzFDLGNBQUksY0FBSjtBQUNBLHVCQUFhLEtBQWI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQ7QUFDQSxRQUFJLElBQUksT0FBSixLQUFnQixFQUFwQixFQUF3QjtBQUN0QjtBQUNEO0FBQ0YsR0F4QkQ7QUEwQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgTW9kYWwgZnJvbSAnLi9tb2RhbC5qcyc7XG5cbi8vIG1vZHVsZSB2YXJpYWJsZXMsIHVzZWQgdG8gZmlsdGVyIHRoZSByZXN0YXVyYW50cyBieSBuYW1lIGFuZCB0eXBlXG52YXIgcmVzdGF1cmFudHMsIFxudHlwZVNlbGVjdGVkID0gJycsIFxuc2VhcmNoU3RyaW5nID0gJyc7XG5cbi8qIFxuICBJbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvbiBsb2FkaW5nIHRoZSByZXN0YXVyYW50cyBkYXRhIFxuICBhbmQgYWRkaW5nIHRoZSBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIGludGVyYWN0aXZlIGVsZW1lbnRzLlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuXG4gIGZldGNoKCdkYXRhL3Jlc3RhdXJhbnRzLmpzb24nKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAudGhlbihzdG9yZVJlc3RhdXJhbnRzKVxuICAgIC50aGVuKHNob3dSZXN0YXVyYW50cylcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBsb2FkIHRoZSByZXN0YXVyYW50cy4nLCBlcnJvcik7XG4gICAgfSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckJ5VHlwZSh0eXBlKSB7XG5cbiAgdHlwZVNlbGVjdGVkID0gdHlwZTtcbiAgc2hvd1Jlc3RhdXJhbnRzKGZpbHRlclJlc3RhdXJhbnRzKCkpO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJCeU5hbWUobmFtZSkge1xuICBcbiAgc2VhcmNoU3RyaW5nID0gbmFtZTtcbiAgc2hvd1Jlc3RhdXJhbnRzKGZpbHRlclJlc3RhdXJhbnRzKCkpO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJSZXN0YXVyYW50cygpIHtcblxuICByZXR1cm4gcmVzdGF1cmFudHMuZmlsdGVyKChyZXN0YXVyYW50KSA9PiB7XG4gICAgXG4gICAgdmFyIGNvbnRhaW5zU2VhcmNoU3RyaW5nID0gdHJ1ZSwgXG4gICAgaXNUeXBlU2VsZWN0ZWQgPSB0cnVlO1xuICAgIFxuICAgIGlmKHNlYXJjaFN0cmluZyAhPSAnJykge1xuICBcbiAgICAgIGNvbnRhaW5zU2VhcmNoU3RyaW5nID0gcmVzdGF1cmFudC5uYW1lLmluZGV4T2Yoc2VhcmNoU3RyaW5nKSAhPSAtMTtcbiAgXG4gICAgfSBcblxuICAgIGlmKHR5cGVTZWxlY3RlZCAhPSAnJyl7XG5cbiAgICAgIGlzVHlwZVNlbGVjdGVkID0gKHJlc3RhdXJhbnQudHlwZSA9PT0gdHlwZVNlbGVjdGVkKTtcblxuICAgIH0gXG5cbiAgICByZXR1cm4gY29udGFpbnNTZWFyY2hTdHJpbmcgJiYgaXNUeXBlU2VsZWN0ZWQ7XG4gICAgXG4gIH0pO1xuXG59XG5cbi8qIFxuICBTdG9yZXMgdGhlIHJlc3RhdXJhbnRzIGFycmF5IGluIGEgdmFyaWFibGUgZm9yIGZpbHRlcnMgXG4gIFRoZXkgY291bGQgYmUgc3RvcmVkIHRvIGxvY2Fsc3RvcmFnZSBvciBpbmRleGVkREJcbiAgYnV0IGZvciB0aGlzIGFwcCBpdCB3aWxsIGRvIHdpdGggYSBtb2R1bGUgdmFyaWFibGUuXG4qL1xuZnVuY3Rpb24gc3RvcmVSZXN0YXVyYW50cyhyZXMpIHtcbiAgcmVzdGF1cmFudHMgPSByZXM7XG4gIHJldHVybiByZXM7XG59XG5cbi8qXG4gIFJlbmRlciBhbGwgcmVzdGF1cmFudHMgdXNpbmcgdGhlIHJlc3RhdXJhbnQgdGVtcGxhdGVcbiovXG5mdW5jdGlvbiBzaG93UmVzdGF1cmFudHMocmVzdGF1cmFudHMpIHtcbiAgXG4gIHZhciByZXN0YXVyYW50c0xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudHMtbGlzdCcpO1xuICByZXN0YXVyYW50c0xpc3QuaW5uZXJIVE1MID0gJyc7XG4gIHJlc3RhdXJhbnRzLmZvckVhY2goKHJlc3RhdXJhbnQpID0+IHtcblxuICAgIHZhciByZXN0YXVyYW50RWxlbSA9IGh0bWxUb0VsZW1lbnQocmVzdGF1cmFudFRtcGwocmVzdGF1cmFudCkpO1xuICAgIHZhciBidXR0b24gPSByZXN0YXVyYW50RWxlbS5xdWVyeVNlbGVjdG9yKCcucmV2aWV3cy1idXR0b24nKTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gTW9kYWwub3Blbk1vZGFsKHJlc3RhdXJhbnQpO1xuICAgIH0pO1xuXG4gICAgcmVzdGF1cmFudHNMaXN0LmFwcGVuZENoaWxkKHJlc3RhdXJhbnRFbGVtKTtcblxuICB9KTtcblxufVxuXG5mdW5jdGlvbiBodG1sVG9FbGVtZW50KGh0bWwpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZDtcbn1cblxuLypcbiAgQXZlcmFnZSBvZiBhbiBhcnJheSBvZiBudW1iZXJzXG4qL1xuZnVuY3Rpb24gYXZnKGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5yZWR1Y2UoKHByZXYsIGN1cikgPT4gcHJldiArIGN1ciwgMCkvYXJyYXkubGVuZ3RoO1xufVxuXG4vKlxuICBDYWxjdWxhdGUgdGhlIGF2ZXJhZ2UgZnJvbSBhbGwgc3RhcnMgaW4gdGhlIHJldmlld3NcbiovXG5mdW5jdGlvbiBjYWxjdWxhdGVTdGFycyhyZXZpZXdzKSB7XG5cbiAgdmFyIHN0YXJzID0gcmV2aWV3cy5tYXAoKHJldmlldykgPT4gcmV2aWV3LnN0YXJzKTtcbiAgcmV0dXJuIGF2ZyhzdGFycykgO1xuXG59XG5cbi8qXG4gIENhbGN1bGF0ZSBob3cgZnVsbCBpcyB0aGUgY3VycmVudCBzdGFyXG4qL1xuZnVuY3Rpb24gc3RhclR5cGUob3JkZXIsIG51bWJlcikge1xuXG4gIGlmKG51bWJlciAtIG9yZGVyID09IC0wLjUpIHtcbiAgICByZXR1cm4gJ2hhbGYnO1xuICB9IGVsc2UgaWYobnVtYmVyIC0gb3JkZXIgPj0gMCkge1xuICAgIHJldHVybiAnZnVsbCdcbiAgfVxuXG4gIHJldHVybiAnZW1wdHknO1xuXG59XG5cbi8vLS0tLS0tLS0tLSBUZW1wbGF0ZXMgLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiByZXN0YXVyYW50VG1wbChyZXN0YXVyYW50KSB7XG5cbiAgcmV0dXJuIGA8YXJ0aWNsZSBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgPGgyPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiI21vcmVcIj5cbiAgICAgICAgICAgICAgICAke3Jlc3RhdXJhbnQubmFtZX1cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAke3N0YXJzVG1wbChjYWxjdWxhdGVTdGFycyhyZXN0YXVyYW50LnJldmlld3MpKX1cbiAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGh1bWJcIj5cbiAgICAgICAgICAgICAgPGltZyBzcmM9XCIke3Jlc3RhdXJhbnQucGhvdG99XCIgYWx0PVwiJHtyZXN0YXVyYW50Lm5hbWV9IFBob3RvZ3JhcGhcIj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvY2F0aW9uXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPkxvY2F0aW9uOjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmYSBmYS1tYXAtbWFya2VyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBcbiAgICAgICAgICAgICAgJHtyZXN0YXVyYW50LmFkZHJlc3N9XG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwibWFwc1wiIGhyZWY9XCIke21hcHNMaW5rKHJlc3RhdXJhbnQuYWRkcmVzcyl9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+T3BlbiBpbiBNYXBzPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwib3BlbmluZ1wiPlxuICAgICAgICAgICAgICBPcGVuczogJHtvcGVuaW5nVG1wbChyZXN0YXVyYW50Lm9wZW5pbmdIb3Vycyl9IFxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgJHtyZXN0YXVyYW50LmRlc2NyaXB0aW9ufVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJyZXZpZXdzLWJ1dHRvblwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjEyIHJldmlld3MgLSBBZGQgeW91ciByZXZpZXdcIi8+XG4gICAgICAgICAgPC9hcnRpY2xlPmA7XG5cbn1cblxuZnVuY3Rpb24gb3BlbmluZ1RtcGwob3BlbmluZ0hvdXJzKSB7XG5cbiAgcmV0dXJuIG9wZW5pbmdIb3Vycy5tYXAodGltZVRtcGwpLmpvaW4oJyB8ICcpO1xuXG59XG5cbmZ1bmN0aW9uIHRpbWVUbXBsKHRpbWUpIHtcblxuICByZXR1cm4gYDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JHt0aW1lLm9wZW59IC0gJHt0aW1lLmNsb3NlfTwvc3Bhbj5gO1xuXG59XG5cbmZ1bmN0aW9uIHN0YXJzVG1wbChudW1iZXIpIHtcblxuICByZXR1cm4gYDxkaXYgY2xhc3M9XCJzdGFyc1wiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+JHtudW1iZXJ9IHN0YXJzPC9zcGFuPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoMSwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSgyLCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDMsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoNCwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSg1LCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICA8L2Rpdj5gO1xuXG59XG5cbmZ1bmN0aW9uIG1hcHNMaW5rKGFkZHJlc3MpIHtcblxuICByZXR1cm4gYGh0dHA6Ly9tYXBzLmdvb2dsZS5jb20vP3E9JHtlbmNvZGVVUklDb21wb25lbnQoYWRkcmVzcyl9YDtcblxufSIsImltcG9ydCAqIGFzIEFwcCBmcm9tICcuL2FwcC5qcyc7XG5cbihmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiByZWFkeSgpIHtcbiAgICAgIFxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIFxuICAgICAgLy8gcmVzb2x2ZSB0aGUgcHJvbWlzZSB3aGVuIHRoZSBkb2N1bWVudCBpcyByZWFkeVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnbG9hZGluZycpIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfTtcblxuICByZWFkeSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgQXBwLmluaXQoKTtcblxuICAgIC8vIGFkZCBmaWx0ZXJpbmcgbGlzdGVuZXJzXG4gICAgdmFyIHR5cGVCdXR0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3R5cGUnKTtcbiAgICBmb3IodmFyIGk9MDsgaSA8IHR5cGVCdXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0eXBlQnV0dG9uc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuXG4gICAgICAgIEFwcC5maWx0ZXJCeVR5cGUodGhpcy52YWx1ZSk7XG5cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCBpbnB1dCBsaXN0ZW5lciBmb3IgdGhlIHNlYXJjaCBib3gsIHdlIHdhbnQgdG8gdXBkYXRlXG4gICAgLy8gdGhlIGxpc3Qgb24gZWFjaCBrZXlzdHJva2UgKHRoZSBsaXN0IGlzIGFscmVhZHkgY29tcGxldGVseSBcbiAgICAvLyBsb2FkZWQgc28gdGhpcyBkb2Vzbid0IG1ha2UgbW9yZSByZXF1ZXN0cylcbiAgICB2YXIgbmFtZUZpbHRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2hib3gnKTtcbiAgICBuYW1lRmlsdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIEFwcC5maWx0ZXJCeU5hbWUodGhpcy52YWx1ZSk7XG5cbiAgICB9KTtcblxuICB9KTtcblxufSkoKTsiLCJcbmNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nID0gJ2FbaHJlZl0sIFtyb2xlPVwic2xpZGVyXCJdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSc7XG5cbnZhciB3cmFwcGVyLCBtb2RhbCwgb3ZlcmxheSwgY2xvc2VCdXR0b24sIGZvY3VzZWRFbGVtZW50QmVmb3JlTW9kYWw7XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuTW9kYWwocmVzdGF1cmFudCkge1xuXG4gIHdyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpO1xuICBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbCcpO1xuICBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXknKTtcbiAgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2UtbW9kYWwnKTtcblxuICBmb2N1c2VkRWxlbWVudEJlZm9yZU1vZGFsID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblxuICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTW9kYWwpO1xuICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VNb2RhbCk7XG5cbiAgLy8gc2hvd3MgdGhlIG1vZGFsIGFuZCBoaWRlcyB0aGUgcmVzdCBvZiB0aGUgY29udGVudCBmb3JcbiAgLy8gc2NyZWVuIHJlYWRlcnNcbiAgbW9kYWwucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgLy8gQWRkIGtleWJvYXJkIGxpc3RlbmVyIHRvIGNyZWF0ZSB0aGUgZm9jdXMtdHJhcFxuICB2YXIge2ZpcnN0RWxlbWVudCwgbGFzdEVsZW1lbnR9ID0gZmluZEZvY3VzTGltaXRFbGVtZW50cyhtb2RhbCk7XG4gIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmb2N1c1RyYXBDb250cm9sbGVyKGZpcnN0RWxlbWVudCwgbGFzdEVsZW1lbnQpKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcblxuICB3cmFwcGVyLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgbW9kYWwuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKTsgIFxuXG59XG5cbmZ1bmN0aW9uIGZpbmRGb2N1c0xpbWl0RWxlbWVudHMobW9kYWwpIHtcblxuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cbiAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XG4gIFxuICByZXR1cm4ge1xuICAgIGZpcnN0RWxlbWVudDogZm9jdXNhYmxlRWxlbWVudHNbMF0sXG4gICAgbGFzdEVsZW1lbnQ6IGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdXG4gIH07XG5cbn1cblxuZnVuY3Rpb24gZm9jdXNUcmFwQ29udHJvbGxlcihmaXJzdEVsZW1lbnQsIGxhc3RFbGVtZW50KSB7XG5cbiAgZmlyc3RFbGVtZW50LmZvY3VzKCk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGV2dCkge1xuICAgIC8vIENoZWNrIGZvciBUQUIga2V5IHByZXNzXG4gICAgaWYgKGV2dC5rZXlDb2RlID09PSA5KSB7XG5cbiAgICAgIC8vIFNISUZUICsgVEFCXG4gICAgICBpZiAoZXZ0LnNoaWZ0S2V5KSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdEVsZW1lbnQpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBsYXN0RWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgIC8vIFRBQlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3RFbGVtZW50KSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZmlyc3RFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFU0NBUEVcbiAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDI3KSB7XG4gICAgICBjbG9zZU1vZGFsKCk7XG4gICAgfVxuICB9O1xuXG59Il19
