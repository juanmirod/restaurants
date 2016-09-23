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

var _util = require('./util.js');

var Util = _interopRequireWildcard(_util);

var _stars = require('./stars.js');

var Stars = _interopRequireWildcard(_stars);

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

    var restaurantElem = Util.htmlToElement(restaurantTmpl(restaurant));
    var button = restaurantElem.querySelector('.reviews-button');

    button.addEventListener('click', function () {
      return Modal.openModal(restaurant);
    });

    restaurantsList.appendChild(restaurantElem);
  });
}

//---------- Templates ---------------
function restaurantTmpl(restaurant) {

  return '<article class="row">\n            <h2>\n              <a href="#more">\n                ' + restaurant.name + '\n              </a>\n              ' + Stars.starsTmpl(Stars.calculateStars(restaurant.reviews)) + '\n            </h2>\n            <div class="thumb">\n              <img src="' + restaurant.photo + '" alt="' + restaurant.name + ' Photograph">\n            </div>\n            <div class="location">\n              <span class="sr-only">Location:</span>\n              <span class="fa fa-map-marker" aria-hidden="true"></span> \n              ' + restaurant.address + '\n              <a class="maps" href="' + mapsLink(restaurant.address) + '" target="_blank">Open in Maps</a>\n            </div>\n            <div class="opening">\n              Opens: ' + openingTmpl(restaurant.openingHours) + ' \n            </div>\n            <div class="description">\n              ' + restaurant.description + '\n            </div>\n            <input class="reviews-button" type="button" value="12 reviews - Add your review"/>\n          </article>';
}

function openingTmpl(openingHours) {

  return openingHours.map(timeTmpl).join(' | ');
}

function timeTmpl(time) {

  return '<span class="text-success">' + time.open + ' - ' + time.close + '</span>';
}

function mapsLink(address) {

  return 'http://maps.google.com/?q=' + encodeURIComponent(address);
}

},{"./modal.js":3,"./stars.js":4,"./util.js":5}],2:[function(require,module,exports){
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

var _util = require('./util.js');

var Util = _interopRequireWildcard(_util);

var _stars = require('./stars.js');

var Stars = _interopRequireWildcard(_stars);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var focusableElementsString = 'a[href], [role="slider"], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

var wrapper, modal, overlay, closeButton, focusedElementBeforeModal;

function openModal(restaurant) {

  wrapper = document.getElementById('wrapper');
  modal = Util.htmlToElement(modalTmpl(restaurant));
  document.body.appendChild(modal);

  overlay = document.getElementById('overlay');
  closeButton = document.getElementById('close-modal');

  focusedElementBeforeModal = document.activeElement;

  // shows the modal and hides the rest of the content for
  // screen readers
  modal.removeAttribute('hidden');
  wrapper.setAttribute('aria-hidden', true);

  closeButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Add keyboard listener to create the focus-trap

  var _findFocusLimitElemen = findFocusLimitElements(modal);

  var firstElement = _findFocusLimitElemen.firstElement;
  var lastElement = _findFocusLimitElemen.lastElement;

  modal.addEventListener('keydown', focusTrapController(firstElement, lastElement));
}

function closeModal() {

  wrapper.removeAttribute('aria-hidden');
  document.body.removeChild(modal);
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

function modalTmpl(restaurant) {
  return '<div id="modal" role="dialog" aria-labelledby="modal-title" hidden>\n            <div id="overlay"></div>\n            <div class="dialog">\n              <header>\n                <h3 id="modal-title">' + restaurant.name + '</h3>\n              </header>\n              <div class="content">\n                ' + reviewsTmpl(restaurant.reviews) + '\n                <div class="new-review">\n                  <form aria-labelledby="form-title">\n                    <h3 id="form-title">Add your review</h3>\n                    <label class="sr-only" for="stars-rating">\n                      Please select a number of stars\n                    </label>\n                    <div id="stars-rating" \n                         role="slider"\n                         tabindex="0" \n                         aria-valuemin="0"\n                         aria-valuemax="5"\n                         aria-valuenow="0">\n                      <i class="fa fa-star empty" aria-hidden="true"></i>\n                      <i class="fa fa-star empty" aria-hidden="true"></i>\n                      <i class="fa fa-star empty" aria-hidden="true"></i>\n                      <i class="fa fa-star empty" aria-hidden="true"></i>\n                      <i class="fa fa-star empty" aria-hidden="true"></i>\n                    </div>\n                    <input id="review-name" \n                           type="text" \n                           name="name" \n                           placeholder="Your name"\n                           aria-label="Your name"\n                           autocomplete="name">\n                    <textarea id="comment" \n                              name="comment"\n                              aria-label="Comment" \n                              placeholder="Tell something about your experience in this restaurant.">\n                    </textarea>\n                  </form>\n                </div>\n              </div>\n              <footer>\n                <input id="close-modal" type="button" name="closeModal" value="Close">\n              </footer>\n            </div>\n          </div>';
}

function reviewsTmpl(reviews) {

  return reviews.map(reviewTmpl).join();
}

function reviewTmpl(review) {
  return '<div class="review">\n            <p class="author">\n              ' + Stars.starsTmpl(review.stars) + '\n              <span>by ' + review.name + ' on ' + review.created_at + '</span>              \n            </p>\n            <p class="comment">\n              ' + review.comment + '\n            </p>\n          </div>';
}

},{"./stars.js":4,"./util.js":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateStars = calculateStars;
exports.starsTmpl = starsTmpl;
/*
  Calculate the average from all stars in the reviews
*/
function calculateStars(reviews) {

  var stars = reviews.map(function (review) {
    return review.stars;
  });
  return avg(stars);
}

function starsTmpl(number) {

  return '<div class="stars">\n            <span class="sr-only">' + number + ' stars</span>\n            <i class="fa fa-star ' + starType(1, number) + '" aria-hidden="true"></i>\n            <i class="fa fa-star ' + starType(2, number) + '" aria-hidden="true"></i>\n            <i class="fa fa-star ' + starType(3, number) + '" aria-hidden="true"></i>\n            <i class="fa fa-star ' + starType(4, number) + '" aria-hidden="true"></i>\n            <i class="fa fa-star ' + starType(5, number) + '" aria-hidden="true"></i>\n          </div>';
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

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.htmlToElement = htmlToElement;
function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9tYWluLmpzIiwianMvbW9kYWwuanMiLCJqcy9zdGFycy5qcyIsImpzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ2FnQixJLEdBQUEsSTtRQVlBLFksR0FBQSxZO1FBT0EsWSxHQUFBLFk7UUFPQSxpQixHQUFBLGlCOztBQXZDaEI7O0lBQVksSzs7QUFDWjs7SUFBWSxJOztBQUNaOztJQUFZLEs7Ozs7QUFFWjtBQUNBLElBQUksV0FBSjtBQUFBLElBQ0EsZUFBZSxFQURmO0FBQUEsSUFFQSxlQUFlLEVBRmY7O0FBSUE7Ozs7QUFJTyxTQUFTLElBQVQsR0FBZ0I7O0FBRXJCLFFBQU0sdUJBQU4sRUFDRyxJQURILENBQ1E7QUFBQSxXQUFZLFNBQVMsSUFBVCxFQUFaO0FBQUEsR0FEUixFQUVHLElBRkgsQ0FFUSxnQkFGUixFQUdHLElBSEgsQ0FHUSxlQUhSLEVBSUcsS0FKSCxDQUlTLFVBQVMsS0FBVCxFQUFnQjtBQUNyQixZQUFRLEtBQVIsQ0FBYyxpQ0FBZCxFQUFpRCxLQUFqRDtBQUNELEdBTkg7QUFRRDs7QUFFTSxTQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEI7O0FBRWpDLGlCQUFlLElBQWY7QUFDQSxrQkFBZ0IsbUJBQWhCO0FBRUQ7O0FBRU0sU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCOztBQUVqQyxpQkFBZSxJQUFmO0FBQ0Esa0JBQWdCLG1CQUFoQjtBQUVEOztBQUVNLFNBQVMsaUJBQVQsR0FBNkI7O0FBRWxDLFNBQU8sWUFBWSxNQUFaLENBQW1CLFVBQUMsVUFBRCxFQUFnQjs7QUFFeEMsUUFBSSx1QkFBdUIsSUFBM0I7QUFBQSxRQUNBLGlCQUFpQixJQURqQjs7QUFHQSxRQUFHLGdCQUFnQixFQUFuQixFQUF1Qjs7QUFFckIsNkJBQXVCLFdBQVcsSUFBWCxD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QUFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBNb2RhbCBmcm9tICcuL21vZGFsLmpzJztcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi91dGlsLmpzJztcbmltcG9ydCAqIGFzIFN0YXJzIGZyb20gJy4vc3RhcnMuanMnO1xuXG4vLyBtb2R1bGUgdmFyaWFibGVzLCB1c2VkIHRvIGZpbHRlciB0aGUgcmVzdGF1cmFudHMgYnkgbmFtZSBhbmQgdHlwZVxudmFyIHJlc3RhdXJhbnRzLCBcbnR5cGVTZWxlY3RlZCA9ICcnLCBcbnNlYXJjaFN0cmluZyA9ICcnO1xuXG4vKiBcbiAgSW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24gbG9hZGluZyB0aGUgcmVzdGF1cmFudHMgZGF0YSBcbiAgYW5kIGFkZGluZyB0aGUgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBpbnRlcmFjdGl2ZSBlbGVtZW50cy5cbiovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcblxuICBmZXRjaCgnZGF0YS9yZXN0YXVyYW50cy5qc29uJylcbiAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgLnRoZW4oc3RvcmVSZXN0YXVyYW50cylcbiAgICAudGhlbihzaG93UmVzdGF1cmFudHMpXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgbG9hZCB0aGUgcmVzdGF1cmFudHMuJywgZXJyb3IpO1xuICAgIH0pO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJCeVR5cGUodHlwZSkge1xuXG4gIHR5cGVTZWxlY3RlZCA9IHR5cGU7XG4gIHNob3dSZXN0YXVyYW50cyhmaWx0ZXJSZXN0YXVyYW50cygpKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQnlOYW1lKG5hbWUpIHtcbiAgXG4gIHNlYXJjaFN0cmluZyA9IG5hbWU7XG4gIHNob3dSZXN0YXVyYW50cyhmaWx0ZXJSZXN0YXVyYW50cygpKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyUmVzdGF1cmFudHMoKSB7XG5cbiAgcmV0dXJuIHJlc3RhdXJhbnRzLmZpbHRlcigocmVzdGF1cmFudCkgPT4ge1xuICAgIFxuICAgIHZhciBjb250YWluc1NlYXJjaFN0cmluZyA9IHRydWUsIFxuICAgIGlzVHlwZVNlbGVjdGVkID0gdHJ1ZTtcbiAgICBcbiAgICBpZihzZWFyY2hTdHJpbmcgIT0gJycpIHtcbiAgXG4gICAgICBjb250YWluc1NlYXJjaFN0cmluZyA9IHJlc3RhdXJhbnQubmFtZS5pbmRleE9mKHNlYXJjaFN0cmluZykgIT0gLTE7XG4gIFxuICAgIH0gXG5cbiAgICBpZih0eXBlU2VsZWN0ZWQgIT0gJycpe1xuXG4gICAgICBpc1R5cGVTZWxlY3RlZCA9IChyZXN0YXVyYW50LnR5cGUgPT09IHR5cGVTZWxlY3RlZCk7XG5cbiAgICB9IFxuXG4gICAgcmV0dXJuIGNvbnRhaW5zU2VhcmNoU3RyaW5nICYmIGlzVHlwZVNlbGVjdGVkO1xuICAgIFxuICB9KTtcblxufVxuXG4vKiBcbiAgU3RvcmVzIHRoZSByZXN0YXVyYW50cyBhcnJheSBpbiBhIHZhcmlhYmxlIGZvciBmaWx0ZXJzIFxuICBUaGV5IGNvdWxkIGJlIHN0b3JlZCB0byBsb2NhbHN0b3JhZ2Ugb3IgaW5kZXhlZERCXG4gIGJ1dCBmb3IgdGhpcyBhcHAgaXQgd2lsbCBkbyB3aXRoIGEgbW9kdWxlIHZhcmlhYmxlLlxuKi9cbmZ1bmN0aW9uIHN0b3JlUmVzdGF1cmFudHMocmVzKSB7XG4gIHJlc3RhdXJhbnRzID0gcmVzO1xuICByZXR1cm4gcmVzO1xufVxuXG4vKlxuICBSZW5kZXIgYWxsIHJlc3RhdXJhbnRzIHVzaW5nIHRoZSByZXN0YXVyYW50IHRlbXBsYXRlXG4qL1xuZnVuY3Rpb24gc2hvd1Jlc3RhdXJhbnRzKHJlc3RhdXJhbnRzKSB7XG4gIFxuICB2YXIgcmVzdGF1cmFudHNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnRzLWxpc3QnKTtcbiAgcmVzdGF1cmFudHNMaXN0LmlubmVySFRNTCA9ICcnO1xuICByZXN0YXVyYW50cy5mb3JFYWNoKChyZXN0YXVyYW50KSA9PiB7XG5cbiAgICB2YXIgcmVzdGF1cmFudEVsZW0gPSBVdGlsLmh0bWxUb0VsZW1lbnQocmVzdGF1cmFudFRtcGwocmVzdGF1cmFudCkpO1xuICAgIHZhciBidXR0b24gPSByZXN0YXVyYW50RWxlbS5xdWVyeVNlbGVjdG9yKCcucmV2aWV3cy1idXR0b24nKTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gTW9kYWwub3Blbk1vZGFsKHJlc3RhdXJhbnQpO1xuICAgIH0pO1xuXG4gICAgcmVzdGF1cmFudHNMaXN0LmFwcGVuZENoaWxkKHJlc3RhdXJhbnRFbGVtKTtcblxuICB9KTtcblxufVxuXG4vLy0tLS0tLS0tLS0gVGVtcGxhdGVzIC0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gcmVzdGF1cmFudFRtcGwocmVzdGF1cmFudCkge1xuXG4gIHJldHVybiBgPGFydGljbGUgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgIDxoMj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cIiNtb3JlXCI+XG4gICAgICAgICAgICAgICAgJHtyZXN0YXVyYW50Lm5hbWV9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgJHtTdGFycy5zdGFyc1RtcGwoU3RhcnMuY2FsY3VsYXRlU3RhcnMocmVzdGF1cmFudC5yZXZpZXdzKSl9XG4gICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRodW1iXCI+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtyZXN0YXVyYW50LnBob3RvfVwiIGFsdD1cIiR7cmVzdGF1cmFudC5uYW1lfSBQaG90b2dyYXBoXCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2NhdGlvblwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Mb2NhdGlvbjo8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmEgZmEtbWFwLW1hcmtlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gXG4gICAgICAgICAgICAgICR7cmVzdGF1cmFudC5hZGRyZXNzfVxuICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1hcHNcIiBocmVmPVwiJHttYXBzTGluayhyZXN0YXVyYW50LmFkZHJlc3MpfVwiIHRhcmdldD1cIl9ibGFua1wiPk9wZW4gaW4gTWFwczwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9wZW5pbmdcIj5cbiAgICAgICAgICAgICAgT3BlbnM6ICR7b3BlbmluZ1RtcGwocmVzdGF1cmFudC5vcGVuaW5nSG91cnMpfSBcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICR7cmVzdGF1cmFudC5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwicmV2aWV3cy1idXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCIxMiByZXZpZXdzIC0gQWRkIHlvdXIgcmV2aWV3XCIvPlxuICAgICAgICAgIDwvYXJ0aWNsZT5gO1xuXG59XG5cbmZ1bmN0aW9uIG9wZW5pbmdUbXBsKG9wZW5pbmdIb3Vycykge1xuXG4gIHJldHVybiBvcGVuaW5nSG91cnMubWFwKHRpbWVUbXBsKS5qb2luKCcgfCAnKTtcblxufVxuXG5mdW5jdGlvbiB0aW1lVG1wbCh0aW1lKSB7XG5cbiAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInRleHQtc3VjY2Vzc1wiPiR7dGltZS5vcGVufSAtICR7dGltZS5jbG9zZX08L3NwYW4+YDtcblxufVxuXG5mdW5jdGlvbiBtYXBzTGluayhhZGRyZXNzKSB7XG5cbiAgcmV0dXJuIGBodHRwOi8vbWFwcy5nb29nbGUuY29tLz9xPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGFkZHJlc3MpfWA7XG5cbn1cbiIsImltcG9ydCAqIGFzIEFwcCBmcm9tICcuL2FwcC5qcyc7XG5cbihmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiByZWFkeSgpIHtcbiAgICAgIFxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIFxuICAgICAgLy8gcmVzb2x2ZSB0aGUgcHJvbWlzZSB3aGVuIHRoZSBkb2N1bWVudCBpcyByZWFkeVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnbG9hZGluZycpIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfTtcblxuICByZWFkeSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgQXBwLmluaXQoKTtcblxuICAgIC8vIGFkZCBmaWx0ZXJpbmcgbGlzdGVuZXJzXG4gICAgdmFyIHR5cGVCdXR0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3R5cGUnKTtcbiAgICBmb3IodmFyIGk9MDsgaSA8IHR5cGVCdXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0eXBlQnV0dG9uc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuXG4gICAgICAgIEFwcC5maWx0ZXJCeVR5cGUodGhpcy52YWx1ZSk7XG5cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCBpbnB1dCBsaXN0ZW5lciBmb3IgdGhlIHNlYXJjaCBib3gsIHdlIHdhbnQgdG8gdXBkYXRlXG4gICAgLy8gdGhlIGxpc3Qgb24gZWFjaCBrZXlzdHJva2UgKHRoZSBsaXN0IGlzIGFscmVhZHkgY29tcGxldGVseSBcbiAgICAvLyBsb2FkZWQgc28gdGhpcyBkb2Vzbid0IG1ha2UgbW9yZSByZXF1ZXN0cylcbiAgICB2YXIgbmFtZUZpbHRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2hib3gnKTtcbiAgICBuYW1lRmlsdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIEFwcC5maWx0ZXJCeU5hbWUodGhpcy52YWx1ZSk7XG5cbiAgICB9KTtcblxuICB9KTtcblxufSkoKTsiLCJpbXBvcnQgKiBhcyBVdGlsIGZyb20gJy4vdXRpbC5qcyc7XG5pbXBvcnQgKiBhcyBTdGFycyBmcm9tICcuL3N0YXJzLmpzJztcblxuY29uc3QgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnYVtocmVmXSwgW3JvbGU9XCJzbGlkZXJcIl0sIGFyZWFbaHJlZl0sIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCBpZnJhbWUsIG9iamVjdCwgZW1iZWQsIFt0YWJpbmRleD1cIjBcIl0sIFtjb250ZW50ZWRpdGFibGVdJztcblxudmFyIHdyYXBwZXIsIG1vZGFsLCBvdmVybGF5LCBjbG9zZUJ1dHRvbiwgZm9jdXNlZEVsZW1lbnRCZWZvcmVNb2RhbDtcblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5Nb2RhbChyZXN0YXVyYW50KSB7XG5cbiAgd3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyJyk7XG4gIG1vZGFsID0gVXRpbC5odG1sVG9FbGVtZW50KG1vZGFsVG1wbChyZXN0YXVyYW50KSk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobW9kYWwpO1xuICBcbiAgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdmVybGF5Jyk7XG4gIGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlLW1vZGFsJyk7XG5cbiAgZm9jdXNlZEVsZW1lbnRCZWZvcmVNb2RhbCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cbiAgLy8gc2hvd3MgdGhlIG1vZGFsIGFuZCBoaWRlcyB0aGUgcmVzdCBvZiB0aGUgY29udGVudCBmb3JcbiAgLy8gc2NyZWVuIHJlYWRlcnNcbiAgbW9kYWwucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU1vZGFsKTtcbiAgb3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTW9kYWwpO1xuXG4gIC8vIEFkZCBrZXlib2FyZCBsaXN0ZW5lciB0byBjcmVhdGUgdGhlIGZvY3VzLXRyYXBcbiAgdmFyIHtmaXJzdEVsZW1lbnQsIGxhc3RFbGVtZW50fSA9IGZpbmRGb2N1c0xpbWl0RWxlbWVudHMobW9kYWwpO1xuICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZm9jdXNUcmFwQ29udHJvbGxlcihmaXJzdEVsZW1lbnQsIGxhc3RFbGVtZW50KSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XG5cbiAgd3JhcHBlci5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobW9kYWwpOyAgXG5cbn1cblxuZnVuY3Rpb24gZmluZEZvY3VzTGltaXRFbGVtZW50cyhtb2RhbCkge1xuXG4gIC8vIEZpbmQgYWxsIGZvY3VzYWJsZSBjaGlsZHJlblxuICB2YXIgZm9jdXNhYmxlRWxlbWVudHMgPSBtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nKTtcbiAgXG4gIHJldHVybiB7XG4gICAgZmlyc3RFbGVtZW50OiBmb2N1c2FibGVFbGVtZW50c1swXSxcbiAgICBsYXN0RWxlbWVudDogZm9jdXNhYmxlRWxlbWVudHNbZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMV1cbiAgfTtcblxufVxuXG5mdW5jdGlvbiBmb2N1c1RyYXBDb250cm9sbGVyKGZpcnN0RWxlbWVudCwgbGFzdEVsZW1lbnQpIHtcblxuICBmaXJzdEVsZW1lbnQuZm9jdXMoKTtcblxuICByZXR1cm4gZnVuY3Rpb24oZXZ0KSB7XG4gICAgLy8gQ2hlY2sgZm9yIFRBQiBrZXkgcHJlc3NcbiAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDkpIHtcblxuICAgICAgLy8gU0hJRlQgKyBUQUJcbiAgICAgIGlmIChldnQuc2hpZnRLZXkpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0RWxlbWVudCkge1xuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGxhc3RFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cblxuICAgICAgLy8gVEFCXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdEVsZW1lbnQpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBmaXJzdEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEVTQ0FQRVxuICAgIGlmIChldnQua2V5Q29kZSA9PT0gMjcpIHtcbiAgICAgIGNsb3NlTW9kYWwoKTtcbiAgICB9XG4gIH07XG5cbn1cblxuZnVuY3Rpb24gbW9kYWxUbXBsKHJlc3RhdXJhbnQpIHtcbiAgcmV0dXJuIGA8ZGl2IGlkPVwibW9kYWxcIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1sYWJlbGxlZGJ5PVwibW9kYWwtdGl0bGVcIiBoaWRkZW4+XG4gICAgICAgICAgICA8ZGl2IGlkPVwib3ZlcmxheVwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZ1wiPlxuICAgICAgICAgICAgICA8aGVhZGVyPlxuICAgICAgICAgICAgICAgIDxoMyBpZD1cIm1vZGFsLXRpdGxlXCI+JHtyZXN0YXVyYW50Lm5hbWV9PC9oMz5cbiAgICAgICAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XG4gICAgICAgICAgICAgICAgJHtyZXZpZXdzVG1wbChyZXN0YXVyYW50LnJldmlld3MpfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZXctcmV2aWV3XCI+XG4gICAgICAgICAgICAgICAgICA8Zm9ybSBhcmlhLWxhYmVsbGVkYnk9XCJmb3JtLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMyBpZD1cImZvcm0tdGl0bGVcIj5BZGQgeW91ciByZXZpZXc8L2gzPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJzci1vbmx5XCIgZm9yPVwic3RhcnMtcmF0aW5nXCI+XG4gICAgICAgICAgICAgICAgICAgICAgUGxlYXNlIHNlbGVjdCBhIG51bWJlciBvZiBzdGFyc1xuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwic3RhcnMtcmF0aW5nXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgcm9sZT1cInNsaWRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGFiaW5kZXg9XCIwXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS12YWx1ZW1pbj1cIjBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtdmFsdWVtYXg9XCI1XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLXZhbHVlbm93PVwiMFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBlbXB0eVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgZW1wdHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyIGVtcHR5XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBlbXB0eVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgZW1wdHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJyZXZpZXctbmFtZVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJuYW1lXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIllvdXIgbmFtZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiWW91ciBuYW1lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9jb21wbGV0ZT1cIm5hbWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiY29tbWVudFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT1cImNvbW1lbnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkNvbW1lbnRcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVGVsbCBzb21ldGhpbmcgYWJvdXQgeW91ciBleHBlcmllbmNlIGluIHRoaXMgcmVzdGF1cmFudC5cIj5cbiAgICAgICAgICAgICAgICAgICAgPC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxmb290ZXI+XG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiY2xvc2UtbW9kYWxcIiB0eXBlPVwiYnV0dG9uXCIgbmFtZT1cImNsb3NlTW9kYWxcIiB2YWx1ZT1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgIDwvZm9vdGVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+YDtcbn1cblxuZnVuY3Rpb24gcmV2aWV3c1RtcGwocmV2aWV3cykge1xuXG4gIHJldHVybiByZXZpZXdzLm1hcChyZXZpZXdUbXBsKS5qb2luKCk7XG5cbn1cblxuZnVuY3Rpb24gcmV2aWV3VG1wbChyZXZpZXcpIHtcbiAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwicmV2aWV3XCI+XG4gICAgICAgICAgICA8cCBjbGFzcz1cImF1dGhvclwiPlxuICAgICAgICAgICAgICAke1N0YXJzLnN0YXJzVG1wbChyZXZpZXcuc3RhcnMpfVxuICAgICAgICAgICAgICA8c3Bhbj5ieSAke3Jldmlldy5uYW1lfSBvbiAke3Jldmlldy5jcmVhdGVkX2F0fTwvc3Bhbj4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJjb21tZW50XCI+XG4gICAgICAgICAgICAgICR7cmV2aWV3LmNvbW1lbnR9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+YDtcbn0iLCIvKlxuICBDYWxjdWxhdGUgdGhlIGF2ZXJhZ2UgZnJvbSBhbGwgc3RhcnMgaW4gdGhlIHJldmlld3NcbiovXG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlU3RhcnMocmV2aWV3cykge1xuXG4gIHZhciBzdGFycyA9IHJldmlld3MubWFwKChyZXZpZXcpID0+IHJldmlldy5zdGFycyk7XG4gIHJldHVybiBhdmcoc3RhcnMpIDtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnNUbXBsKG51bWJlcikge1xuXG4gIHJldHVybiBgPGRpdiBjbGFzcz1cInN0YXJzXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj4ke251bWJlcn0gc3RhcnM8L3NwYW4+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSgxLCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDIsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoMywgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSg0LCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDUsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgIDwvZGl2PmA7XG5cbn1cblxuLypcbiAgQXZlcmFnZSBvZiBhbiBhcnJheSBvZiBudW1iZXJzXG4qL1xuZnVuY3Rpb24gYXZnKGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5yZWR1Y2UoKHByZXYsIGN1cikgPT4gcHJldiArIGN1ciwgMCkvYXJyYXkubGVuZ3RoO1xufVxuXG4vKlxuICBDYWxjdWxhdGUgaG93IGZ1bGwgaXMgdGhlIGN1cnJlbnQgc3RhclxuKi9cbmZ1bmN0aW9uIHN0YXJUeXBlKG9yZGVyLCBudW1iZXIpIHtcblxuICBpZihudW1iZXIgLSBvcmRlciA9PSAtMC41KSB7XG4gICAgcmV0dXJuICdoYWxmJztcbiAgfSBlbHNlIGlmKG51bWJlciAtIG9yZGVyID49IDApIHtcbiAgICByZXR1cm4gJ2Z1bGwnXG4gIH1cblxuICByZXR1cm4gJ2VtcHR5JztcblxufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gaHRtbFRvRWxlbWVudChodG1sKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sO1xuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQ7XG59XG4iXX0=
