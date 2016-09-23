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

var wrapper, modal, overlay, submitButton, closeButton, focusedElementBeforeModal;

function openModal(restaurant) {

  wrapper = document.getElementById('wrapper');
  modal = Util.htmlToElement(modalTmpl(restaurant));
  document.body.appendChild(modal);

  overlay = document.getElementById('overlay');
  closeButton = document.getElementById('close-modal');
  submitButton = document.getElementById('add-review');
  var starsRating = document.getElementById('stars-rating');

  focusedElementBeforeModal = document.activeElement;

  // shows the modal and hides the rest of the content for
  // screen readers
  modal.removeAttribute('hidden');
  window.requestAnimationFrame(function () {
    modal.className = 'show';
  });
  wrapper.setAttribute('aria-hidden', true);

  closeButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  submitButton.addEventListener('click', submitReview(restaurant));
  starsRating.addEventListener('keydown', Stars.starsRatingKeydownHandler);
  for (var i = 0; i < starsRating.children.length; i++) {
    starsRating.children[i].addEventListener('mouseover', Stars.starsRatingHoverHandler);
  }

  // Add keyboard listener to create the focus-trap

  var _findFocusLimitElemen = findFocusLimitElements(modal);

  var firstElement = _findFocusLimitElemen.firstElement;
  var lastElement = _findFocusLimitElemen.lastElement;

  modal.addEventListener('keydown', focusTrapController(firstElement, lastElement));
}

function closeModal() {

  wrapper.removeAttribute('aria-hidden');
  modal.className = '';

  var transitionEvent = Util.whichTransitionEvent();
  transitionEvent && modal.addEventListener(transitionEvent, removeModal);
}

function submitReview(restaurant) {

  return function () {

    var name = document.getElementById('review-name');
    var comment = document.getElementById('comment');
    var stars = document.getElementById('stars-rating');
    var review = {
      name: name.value,
      comment: comment.value,
      stars: stars.getAttribute('aria-valuenow'),
      created_at: Date.now()
    };

    restaurant.reviews.push(review);
    removeModal();
    openModal(restaurant);
  };
}

function removeModal() {
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
  return '<div id="modal" role="dialog" aria-labelledby="modal-title" hidden>\n            <div id="overlay"></div>\n            <div class="dialog">\n              <header>\n                <h3 id="modal-title">' + restaurant.name + '</h3>\n              </header>\n              <div class="content">\n                ' + reviewsTmpl(restaurant.reviews) + '\n                <div class="new-review">\n                  <form aria-labelledby="form-title">\n                    <h3 id="form-title">Add your review</h3>\n                    ' + Stars.starsRating() + '\n                    <input id="review-name" \n                           type="text" \n                           name="name" \n                           placeholder="Your name"\n                           aria-label="Your name"\n                           autocomplete="name">\n                    <textarea id="comment" \n                              name="comment"\n                              aria-label="Comment" \n                              placeholder="Tell something about your experience in this restaurant."></textarea>\n                  </form>\n                </div>\n              </div>\n              <footer>\n                <input id="add-review" type="button" name="addReview" value="Submit">\n                <input id="close-modal" type="button" name="closeModal" value="Close">\n              </footer>\n            </div>\n          </div>';
}

function reviewsTmpl(reviews) {

  return reviews.map(reviewTmpl).join('');
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
exports.starsRating = starsRating;
exports.starsRatingKeydownHandler = starsRatingKeydownHandler;
exports.starsRatingHoverHandler = starsRatingHoverHandler;
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

function starsRating() {

  return '<label class="sr-only" for="stars-rating">\n            Please select a number of stars\n          </label>\n          <div id="stars-rating" \n               role="slider"\n               tabindex="0" \n               aria-valuemin="0"\n               aria-valuemax="5"\n               aria-valuenow="0">\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n          </div>';
}

function starsRatingKeydownHandler(evt) {

  var elem = evt.target;
  switch (evt.keyCode) {

    // Arrow LEFT/DOWN
    case 37:
    case 40:
      evt.preventDefault();
      var value = parseInt(elem.getAttribute('aria-valuenow')) - 1; // 0-5 values
      if (value < 0) {
        value = 5;
      }
      elem.setAttribute('aria-valuenow', value);
      fillStars(elem);
      break;

    // Arrow RIGHT/UP
    case 38:
    case 39:
      evt.preventDefault();
      var value = (parseInt(elem.getAttribute('aria-valuenow')) + 1) % 6;
      elem.setAttribute('aria-valuenow', value);
      fillStars(elem);
      break;

  }
}

function starsRatingHoverHandler(evt) {

  var elem = evt.target.parentElement;
  var i = Array.prototype.indexOf.call(elem.children, evt.target);
  elem.setAttribute('aria-valuenow', i + 1);
  fillStars(elem);
}

function fillStars(elem) {
  var value = elem.getAttribute('aria-valuenow');
  for (var i = 0; i < elem.children.length; i++) {
    elem.children[i].className = 'fa fa-star ' + starType(i + 1, value);
  }
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
exports.whichTransitionEvent = whichTransitionEvent;
function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}

/*
  Selects the browser transition event, from:
  https://davidwalsh.name/css-animation-callback
*/
function whichTransitionEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
    };

    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9tYWluLmpzIiwianMvbW9kYWwuanMiLCJqcy9zdGFycy5qcyIsImpzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ2FnQixJLEdBQUEsSTtRQVlBLFksR0FBQSxZO1FBT0EsWSxHQUFBLFk7UUFPQSxpQixHQUFBLGlCOztBQXZDaEI7O0lBQVksSzs7QUFDWjs7SUFBWSxJOztBQUNaOztJQUFZLEs7Ozs7QUFFWjtBQUNBLElBQUksV0FBSjtBQUFBLElBQ0EsZUFBZSxFQURmO0FBQUEsSUFFQSxlQUFlLEVBRmY7O0FBSUE7Ozs7QUFJTyxTQUFTLElBQVQsR0FBZ0I7O0FBRXJCLFFBQU0sdUJBQU4sRUFDRyxJQURILENBQ1E7QUFBQSxXQUFZLFNBQVMsSUFBVCxFQUFaO0FBQUEsR0FEUixFQUVHLElBRkgsQ0FFUSxnQkFGUixFQUdHLElBSEgsQ0FHUSxlQUhSLEVBSUcsS0FKSCxDQUlTLFVBQVMsS0FBVCxFQUFnQjtBQUNyQixZQUFRLEtBQVIsQ0FBYyxpQ0FBZCxFQUFpRCxLQUFqRDtBQUNELEdBTkg7QUFRRDs7QUFFTSxTQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEI7O0FBRWpDLGlCQUFlLElBQWY7QUFDQSxrQkFBZ0IsbUJBQWhCO0FBRUQ7O0FBRU0sU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCOztBQUVqQyxpQkFBZSxJQUFmO0FBQ0Esa0JBQWdCLG1CQUFoQjtBQUVEOztBQUVNLFNBQVMsaUJBQVQsR0FBNkI7O0FBRWxDLFNBQU8sWUFBWSxNQUFaLENBQW1CLFVBQUMsVUFBRCxFQUFnQjs7QUFFeEMsUUFBSSx1QkFBdUIsSUFBM0I7QUFBQSxRQUNBLGlCQUFpQixJQURqQjs7QUFHQSxRQUFHLGdCQUFnQixFQUFuQixFQUF1Qjs7QUFFckIsNkJBQXVCLFdBQVcsSUFBWCxD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LEtBQVQsSUFBa0IsQ0FBckIsRUFBd0I7QUFDN0IsV0FBTyxNQUFQO0FBQ0Q7O0FBRUQsU0FBTyxPQUFQO0FBRUQ7Ozs7Ozs7O1FDMUdlLGEsR0FBQSxhO1FBVUEsb0IsR0FBQSxvQjtBQVZULFNBQVMsYUFBVCxDQUF1QixJQUF2QixFQUE2QjtBQUNoQyxRQUFJLFdBQVcsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQWY7QUFDQSxhQUFTLFNBQVQsR0FBcUIsSUFBckI7QUFDQSxXQUFPLFNBQVMsT0FBVCxDQUFpQixVQUF4QjtBQUNIOztBQUVEOzs7O0FBSU8sU0FBUyxvQkFBVCxHQUErQjtBQUNsQyxRQUFJLENBQUo7QUFDQSxRQUFJLEtBQUssU0FBUyxhQUFULENBQXVCLGFBQXZCLENBQVQ7QUFDQSxRQUFJLGNBQWM7QUFDaEIsc0JBQWEsZUFERztBQUVoQix1QkFBYyxnQkFGRTtBQUdoQix5QkFBZ0IsZUFIQTtBQUloQiw0QkFBbUI7QUFKSCxLQUFsQjs7QUFPQSxTQUFJLENBQUosSUFBUyxXQUFULEVBQXFCO0FBQ2pCLFlBQUksR0FBRyxLQUFILENBQVMsQ0FBVCxNQUFnQixTQUFwQixFQUErQjtBQUMzQixtQkFBTyxZQUFZLENBQVosQ0FBUDtBQUNIO0FBQ0o7QUFDSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBNb2RhbCBmcm9tICcuL21vZGFsLmpzJztcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi91dGlsLmpzJztcbmltcG9ydCAqIGFzIFN0YXJzIGZyb20gJy4vc3RhcnMuanMnO1xuXG4vLyBtb2R1bGUgdmFyaWFibGVzLCB1c2VkIHRvIGZpbHRlciB0aGUgcmVzdGF1cmFudHMgYnkgbmFtZSBhbmQgdHlwZVxudmFyIHJlc3RhdXJhbnRzLCBcbnR5cGVTZWxlY3RlZCA9ICcnLCBcbnNlYXJjaFN0cmluZyA9ICcnO1xuXG4vKiBcbiAgSW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24gbG9hZGluZyB0aGUgcmVzdGF1cmFudHMgZGF0YSBcbiAgYW5kIGFkZGluZyB0aGUgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBpbnRlcmFjdGl2ZSBlbGVtZW50cy5cbiovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcblxuICBmZXRjaCgnZGF0YS9yZXN0YXVyYW50cy5qc29uJylcbiAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgLnRoZW4oc3RvcmVSZXN0YXVyYW50cylcbiAgICAudGhlbihzaG93UmVzdGF1cmFudHMpXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgbG9hZCB0aGUgcmVzdGF1cmFudHMuJywgZXJyb3IpO1xuICAgIH0pO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJCeVR5cGUodHlwZSkge1xuXG4gIHR5cGVTZWxlY3RlZCA9IHR5cGU7XG4gIHNob3dSZXN0YXVyYW50cyhmaWx0ZXJSZXN0YXVyYW50cygpKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQnlOYW1lKG5hbWUpIHtcbiAgXG4gIHNlYXJjaFN0cmluZyA9IG5hbWU7XG4gIHNob3dSZXN0YXVyYW50cyhmaWx0ZXJSZXN0YXVyYW50cygpKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyUmVzdGF1cmFudHMoKSB7XG5cbiAgcmV0dXJuIHJlc3RhdXJhbnRzLmZpbHRlcigocmVzdGF1cmFudCkgPT4ge1xuICAgIFxuICAgIHZhciBjb250YWluc1NlYXJjaFN0cmluZyA9IHRydWUsIFxuICAgIGlzVHlwZVNlbGVjdGVkID0gdHJ1ZTtcbiAgICBcbiAgICBpZihzZWFyY2hTdHJpbmcgIT0gJycpIHtcbiAgXG4gICAgICBjb250YWluc1NlYXJjaFN0cmluZyA9IHJlc3RhdXJhbnQubmFtZS5pbmRleE9mKHNlYXJjaFN0cmluZykgIT0gLTE7XG4gIFxuICAgIH0gXG5cbiAgICBpZih0eXBlU2VsZWN0ZWQgIT0gJycpe1xuXG4gICAgICBpc1R5cGVTZWxlY3RlZCA9IChyZXN0YXVyYW50LnR5cGUgPT09IHR5cGVTZWxlY3RlZCk7XG5cbiAgICB9IFxuXG4gICAgcmV0dXJuIGNvbnRhaW5zU2VhcmNoU3RyaW5nICYmIGlzVHlwZVNlbGVjdGVkO1xuICAgIFxuICB9KTtcblxufVxuXG4vKiBcbiAgU3RvcmVzIHRoZSByZXN0YXVyYW50cyBhcnJheSBpbiBhIHZhcmlhYmxlIGZvciBmaWx0ZXJzIFxuICBUaGV5IGNvdWxkIGJlIHN0b3JlZCB0byBsb2NhbHN0b3JhZ2Ugb3IgaW5kZXhlZERCXG4gIGJ1dCBmb3IgdGhpcyBhcHAgaXQgd2lsbCBkbyB3aXRoIGEgbW9kdWxlIHZhcmlhYmxlLlxuKi9cbmZ1bmN0aW9uIHN0b3JlUmVzdGF1cmFudHMocmVzKSB7XG4gIHJlc3RhdXJhbnRzID0gcmVzO1xuICByZXR1cm4gcmVzO1xufVxuXG4vKlxuICBSZW5kZXIgYWxsIHJlc3RhdXJhbnRzIHVzaW5nIHRoZSByZXN0YXVyYW50IHRlbXBsYXRlXG4qL1xuZnVuY3Rpb24gc2hvd1Jlc3RhdXJhbnRzKHJlc3RhdXJhbnRzKSB7XG4gIFxuICB2YXIgcmVzdGF1cmFudHNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnRzLWxpc3QnKTtcbiAgcmVzdGF1cmFudHNMaXN0LmlubmVySFRNTCA9ICcnO1xuICByZXN0YXVyYW50cy5mb3JFYWNoKChyZXN0YXVyYW50KSA9PiB7XG5cbiAgICB2YXIgcmVzdGF1cmFudEVsZW0gPSBVdGlsLmh0bWxUb0VsZW1lbnQocmVzdGF1cmFudFRtcGwocmVzdGF1cmFudCkpO1xuICAgIHZhciBidXR0b24gPSByZXN0YXVyYW50RWxlbS5xdWVyeVNlbGVjdG9yKCcucmV2aWV3cy1idXR0b24nKTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gTW9kYWwub3Blbk1vZGFsKHJlc3RhdXJhbnQpO1xuICAgIH0pO1xuXG4gICAgcmVzdGF1cmFudHNMaXN0LmFwcGVuZENoaWxkKHJlc3RhdXJhbnRFbGVtKTtcblxuICB9KTtcblxufVxuXG4vLy0tLS0tLS0tLS0gVGVtcGxhdGVzIC0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gcmVzdGF1cmFudFRtcGwocmVzdGF1cmFudCkge1xuXG4gIHJldHVybiBgPGFydGljbGUgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgIDxoMj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cIiNtb3JlXCI+XG4gICAgICAgICAgICAgICAgJHtyZXN0YXVyYW50Lm5hbWV9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgJHtTdGFycy5zdGFyc1RtcGwoU3RhcnMuY2FsY3VsYXRlU3RhcnMocmVzdGF1cmFudC5yZXZpZXdzKSl9XG4gICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRodW1iXCI+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtyZXN0YXVyYW50LnBob3RvfVwiIGFsdD1cIiR7cmVzdGF1cmFudC5uYW1lfSBQaG90b2dyYXBoXCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2NhdGlvblwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Mb2NhdGlvbjo8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmEgZmEtbWFwLW1hcmtlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gXG4gICAgICAgICAgICAgICR7cmVzdGF1cmFudC5hZGRyZXNzfVxuICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1hcHNcIiBocmVmPVwiJHttYXBzTGluayhyZXN0YXVyYW50LmFkZHJlc3MpfVwiIHRhcmdldD1cIl9ibGFua1wiPk9wZW4gaW4gTWFwczwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9wZW5pbmdcIj5cbiAgICAgICAgICAgICAgT3BlbnM6ICR7b3BlbmluZ1RtcGwocmVzdGF1cmFudC5vcGVuaW5nSG91cnMpfSBcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICR7cmVzdGF1cmFudC5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwicmV2aWV3cy1idXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCIxMiByZXZpZXdzIC0gQWRkIHlvdXIgcmV2aWV3XCIvPlxuICAgICAgICAgIDwvYXJ0aWNsZT5gO1xuXG59XG5cbmZ1bmN0aW9uIG9wZW5pbmdUbXBsKG9wZW5pbmdIb3Vycykge1xuXG4gIHJldHVybiBvcGVuaW5nSG91cnMubWFwKHRpbWVUbXBsKS5qb2luKCcgfCAnKTtcblxufVxuXG5mdW5jdGlvbiB0aW1lVG1wbCh0aW1lKSB7XG5cbiAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInRleHQtc3VjY2Vzc1wiPiR7dGltZS5vcGVufSAtICR7dGltZS5jbG9zZX08L3NwYW4+YDtcblxufVxuXG5mdW5jdGlvbiBtYXBzTGluayhhZGRyZXNzKSB7XG5cbiAgcmV0dXJuIGBodHRwOi8vbWFwcy5nb29nbGUuY29tLz9xPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGFkZHJlc3MpfWA7XG5cbn1cbiIsImltcG9ydCAqIGFzIEFwcCBmcm9tICcuL2FwcC5qcyc7XG5cbihmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiByZWFkeSgpIHtcbiAgICAgIFxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIFxuICAgICAgLy8gcmVzb2x2ZSB0aGUgcHJvbWlzZSB3aGVuIHRoZSBkb2N1bWVudCBpcyByZWFkeVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnbG9hZGluZycpIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfTtcblxuICByZWFkeSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgQXBwLmluaXQoKTtcblxuICAgIC8vIGFkZCBmaWx0ZXJpbmcgbGlzdGVuZXJzXG4gICAgdmFyIHR5cGVCdXR0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3R5cGUnKTtcbiAgICBmb3IodmFyIGk9MDsgaSA8IHR5cGVCdXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0eXBlQnV0dG9uc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuXG4gICAgICAgIEFwcC5maWx0ZXJCeVR5cGUodGhpcy52YWx1ZSk7XG5cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCBpbnB1dCBsaXN0ZW5lciBmb3IgdGhlIHNlYXJjaCBib3gsIHdlIHdhbnQgdG8gdXBkYXRlXG4gICAgLy8gdGhlIGxpc3Qgb24gZWFjaCBrZXlzdHJva2UgKHRoZSBsaXN0IGlzIGFscmVhZHkgY29tcGxldGVseSBcbiAgICAvLyBsb2FkZWQgc28gdGhpcyBkb2Vzbid0IG1ha2UgbW9yZSByZXF1ZXN0cylcbiAgICB2YXIgbmFtZUZpbHRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2hib3gnKTtcbiAgICBuYW1lRmlsdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIEFwcC5maWx0ZXJCeU5hbWUodGhpcy52YWx1ZSk7XG5cbiAgICB9KTtcblxuICB9KTtcblxufSkoKTsiLCJpbXBvcnQgKiBhcyBVdGlsIGZyb20gJy4vdXRpbC5qcyc7XG5pbXBvcnQgKiBhcyBTdGFycyBmcm9tICcuL3N0YXJzLmpzJztcblxuY29uc3QgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnYVtocmVmXSwgW3JvbGU9XCJzbGlkZXJcIl0sIGFyZWFbaHJlZl0sIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCBpZnJhbWUsIG9iamVjdCwgZW1iZWQsIFt0YWJpbmRleD1cIjBcIl0sIFtjb250ZW50ZWRpdGFibGVdJztcblxudmFyIHdyYXBwZXIsIG1vZGFsLCBvdmVybGF5LCBzdWJtaXRCdXR0b24sIGNsb3NlQnV0dG9uLCBmb2N1c2VkRWxlbWVudEJlZm9yZU1vZGFsO1xuXG5leHBvcnQgZnVuY3Rpb24gb3Blbk1vZGFsKHJlc3RhdXJhbnQpIHtcblxuICB3cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyYXBwZXInKTtcbiAgbW9kYWwgPSBVdGlsLmh0bWxUb0VsZW1lbnQobW9kYWxUbXBsKHJlc3RhdXJhbnQpKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbCk7XG4gIFxuICBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXknKTtcbiAgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2UtbW9kYWwnKTtcbiAgc3VibWl0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZC1yZXZpZXcnKTtcbiAgdmFyIHN0YXJzUmF0aW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJzLXJhdGluZycpO1xuXG4gIGZvY3VzZWRFbGVtZW50QmVmb3JlTW9kYWwgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gIC8vIHNob3dzIHRoZSBtb2RhbCBhbmQgaGlkZXMgdGhlIHJlc3Qgb2YgdGhlIGNvbnRlbnQgZm9yXG4gIC8vIHNjcmVlbiByZWFkZXJzXG4gIG1vZGFsLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXtcbiAgICBtb2RhbC5jbGFzc05hbWUgPSAnc2hvdyc7XG4gIH0pO1xuICB3cmFwcGVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblxuICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTW9kYWwpO1xuICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VNb2RhbCk7XG4gIHN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN1Ym1pdFJldmlldyhyZXN0YXVyYW50KSk7XG4gIHN0YXJzUmF0aW5nLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBTdGFycy5zdGFyc1JhdGluZ0tleWRvd25IYW5kbGVyKTtcbiAgZm9yKHZhciBpPTA7IGkgPCBzdGFyc1JhdGluZy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIHN0YXJzUmF0aW5nLmNoaWxkcmVuW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIFN0YXJzLnN0YXJzUmF0aW5nSG92ZXJIYW5kbGVyKTtcbiAgfSBcblxuICAvLyBBZGQga2V5Ym9hcmQgbGlzdGVuZXIgdG8gY3JlYXRlIHRoZSBmb2N1cy10cmFwXG4gIHZhciB7Zmlyc3RFbGVtZW50LCBsYXN0RWxlbWVudH0gPSBmaW5kRm9jdXNMaW1pdEVsZW1lbnRzKG1vZGFsKTtcbiAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZvY3VzVHJhcENvbnRyb2xsZXIoZmlyc3RFbGVtZW50LCBsYXN0RWxlbWVudCkpO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuXG4gIHdyYXBwZXIucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICBtb2RhbC5jbGFzc05hbWUgPSAnJztcbiAgXG4gIHZhciB0cmFuc2l0aW9uRXZlbnQgPSBVdGlsLndoaWNoVHJhbnNpdGlvbkV2ZW50KCk7XG4gIHRyYW5zaXRpb25FdmVudCAmJiBtb2RhbC5hZGRFdmVudExpc3RlbmVyKHRyYW5zaXRpb25FdmVudCwgcmVtb3ZlTW9kYWwpO1xuXG59XG5cbmZ1bmN0aW9uIHN1Ym1pdFJldmlldyhyZXN0YXVyYW50KSB7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXctbmFtZScpO1xuICAgIHZhciBjb21tZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbW1lbnQnKTtcbiAgICB2YXIgc3RhcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnMtcmF0aW5nJyk7XG4gICAgdmFyIHJldmlldyA9IHtcbiAgICAgIG5hbWU6IG5hbWUudmFsdWUsXG4gICAgICBjb21tZW50OiBjb21tZW50LnZhbHVlLFxuICAgICAgc3RhcnM6IHN0YXJzLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycpLFxuICAgICAgY3JlYXRlZF9hdDogRGF0ZS5ub3coKVxuICAgIH07XG5cbiAgICByZXN0YXVyYW50LnJldmlld3MucHVzaChyZXZpZXcpO1xuICAgIHJlbW92ZU1vZGFsKCk7XG4gICAgb3Blbk1vZGFsKHJlc3RhdXJhbnQpO1xuXG4gIH07ICBcblxufVxuXG5mdW5jdGlvbiByZW1vdmVNb2RhbCgpIHtcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChtb2RhbCk7XG59XG5cbmZ1bmN0aW9uIGZpbmRGb2N1c0xpbWl0RWxlbWVudHMobW9kYWwpIHtcblxuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cbiAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XG4gIFxuICByZXR1cm4ge1xuICAgIGZpcnN0RWxlbWVudDogZm9jdXNhYmxlRWxlbWVudHNbMF0sXG4gICAgbGFzdEVsZW1lbnQ6IGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdXG4gIH07XG5cbn1cblxuZnVuY3Rpb24gZm9jdXNUcmFwQ29udHJvbGxlcihmaXJzdEVsZW1lbnQsIGxhc3RFbGVtZW50KSB7XG5cbiAgZmlyc3RFbGVtZW50LmZvY3VzKCk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGV2dCkge1xuICAgIC8vIENoZWNrIGZvciBUQUIga2V5IHByZXNzXG4gICAgaWYgKGV2dC5rZXlDb2RlID09PSA5KSB7XG5cbiAgICAgIC8vIFNISUZUICsgVEFCXG4gICAgICBpZiAoZXZ0LnNoaWZ0S2V5KSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdEVsZW1lbnQpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBsYXN0RWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgIC8vIFRBQlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3RFbGVtZW50KSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZmlyc3RFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFU0NBUEVcbiAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDI3KSB7XG4gICAgICBjbG9zZU1vZGFsKCk7XG4gICAgfVxuICB9O1xuXG59XG5cbmZ1bmN0aW9uIG1vZGFsVG1wbChyZXN0YXVyYW50KSB7XG4gIHJldHVybiBgPGRpdiBpZD1cIm1vZGFsXCIgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbGFiZWxsZWRieT1cIm1vZGFsLXRpdGxlXCIgaGlkZGVuPlxuICAgICAgICAgICAgPGRpdiBpZD1cIm92ZXJsYXlcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2dcIj5cbiAgICAgICAgICAgICAgPGhlYWRlcj5cbiAgICAgICAgICAgICAgICA8aDMgaWQ9XCJtb2RhbC10aXRsZVwiPiR7cmVzdGF1cmFudC5uYW1lfTwvaDM+XG4gICAgICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxuICAgICAgICAgICAgICAgICR7cmV2aWV3c1RtcGwocmVzdGF1cmFudC5yZXZpZXdzKX1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmV3LXJldmlld1wiPlxuICAgICAgICAgICAgICAgICAgPGZvcm0gYXJpYS1sYWJlbGxlZGJ5PVwiZm9ybS10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aDMgaWQ9XCJmb3JtLXRpdGxlXCI+QWRkIHlvdXIgcmV2aWV3PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgJHtTdGFycy5zdGFyc1JhdGluZygpfVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJyZXZpZXctbmFtZVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJuYW1lXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIllvdXIgbmFtZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiWW91ciBuYW1lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9jb21wbGV0ZT1cIm5hbWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiY29tbWVudFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT1cImNvbW1lbnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkNvbW1lbnRcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVGVsbCBzb21ldGhpbmcgYWJvdXQgeW91ciBleHBlcmllbmNlIGluIHRoaXMgcmVzdGF1cmFudC5cIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGZvb3Rlcj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJhZGQtcmV2aWV3XCIgdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJhZGRSZXZpZXdcIiB2YWx1ZT1cIlN1Ym1pdFwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNsb3NlLW1vZGFsXCIgdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJjbG9zZU1vZGFsXCIgdmFsdWU9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8L2Zvb3Rlcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PmA7XG59XG5cbmZ1bmN0aW9uIHJldmlld3NUbXBsKHJldmlld3MpIHtcblxuICByZXR1cm4gcmV2aWV3cy5tYXAocmV2aWV3VG1wbCkuam9pbignJyk7XG5cbn1cblxuZnVuY3Rpb24gcmV2aWV3VG1wbChyZXZpZXcpIHtcbiAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwicmV2aWV3XCI+XG4gICAgICAgICAgICA8cCBjbGFzcz1cImF1dGhvclwiPlxuICAgICAgICAgICAgICAke1N0YXJzLnN0YXJzVG1wbChyZXZpZXcuc3RhcnMpfVxuICAgICAgICAgICAgICA8c3Bhbj5ieSAke3Jldmlldy5uYW1lfSBvbiAke3Jldmlldy5jcmVhdGVkX2F0fTwvc3Bhbj4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJjb21tZW50XCI+XG4gICAgICAgICAgICAgICR7cmV2aWV3LmNvbW1lbnR9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+YDtcbn0iLCIvKlxuICBDYWxjdWxhdGUgdGhlIGF2ZXJhZ2UgZnJvbSBhbGwgc3RhcnMgaW4gdGhlIHJldmlld3NcbiovXG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlU3RhcnMocmV2aWV3cykge1xuXG4gIHZhciBzdGFycyA9IHJldmlld3MubWFwKChyZXZpZXcpID0+IHJldmlldy5zdGFycyk7XG4gIHJldHVybiBhdmcoc3RhcnMpIDtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnNUbXBsKG51bWJlcikge1xuXG4gIHJldHVybiBgPGRpdiBjbGFzcz1cInN0YXJzXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj4ke251bWJlcn0gc3RhcnM8L3NwYW4+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSgxLCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDIsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoMywgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSg0LCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDUsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgIDwvZGl2PmA7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJzUmF0aW5nKCkge1xuXG4gIHJldHVybiBgPGxhYmVsIGNsYXNzPVwic3Itb25seVwiIGZvcj1cInN0YXJzLXJhdGluZ1wiPlxuICAgICAgICAgICAgUGxlYXNlIHNlbGVjdCBhIG51bWJlciBvZiBzdGFyc1xuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGRpdiBpZD1cInN0YXJzLXJhdGluZ1wiIFxuICAgICAgICAgICAgICAgcm9sZT1cInNsaWRlclwiXG4gICAgICAgICAgICAgICB0YWJpbmRleD1cIjBcIiBcbiAgICAgICAgICAgICAgIGFyaWEtdmFsdWVtaW49XCIwXCJcbiAgICAgICAgICAgICAgIGFyaWEtdmFsdWVtYXg9XCI1XCJcbiAgICAgICAgICAgICAgIGFyaWEtdmFsdWVub3c9XCIwXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgZW1wdHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgZW1wdHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgZW1wdHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgZW1wdHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgZW1wdHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgPC9kaXY+YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJzUmF0aW5nS2V5ZG93bkhhbmRsZXIoZXZ0KSB7XG5cbiAgdmFyIGVsZW0gPSBldnQudGFyZ2V0O1xuICBzd2l0Y2goZXZ0LmtleUNvZGUpIHtcblxuICAgIC8vIEFycm93IExFRlQvRE9XTlxuICAgIGNhc2UgMzc6XG4gICAgY2FzZSA0MDpcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIHZhbHVlID0gKHBhcnNlSW50KGVsZW0uZ2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JykpLTEpOyAvLyAwLTUgdmFsdWVzXG4gICAgICBpZih2YWx1ZSA8IDApIHtcbiAgICAgICAgdmFsdWUgPSA1O1xuICAgICAgfSBcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgdmFsdWUpO1xuICAgICAgZmlsbFN0YXJzKGVsZW0pO1xuICAgICAgYnJlYWs7XG5cbiAgICAvLyBBcnJvdyBSSUdIVC9VUFxuICAgIGNhc2UgMzg6XG4gICAgY2FzZSAzOTpcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIHZhbHVlID0gKHBhcnNlSW50KGVsZW0uZ2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JykpKzEpJTY7IFxuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCB2YWx1ZSk7XG4gICAgICBmaWxsU3RhcnMoZWxlbSk7XG4gICAgICBicmVhaztcblxuICB9XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJzUmF0aW5nSG92ZXJIYW5kbGVyKGV2dCkge1xuXG4gIHZhciBlbGVtID0gZXZ0LnRhcmdldC5wYXJlbnRFbGVtZW50O1xuICB2YXIgaSA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoZWxlbS5jaGlsZHJlbiwgZXZ0LnRhcmdldCk7XG4gIGVsZW0uc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgaSsxKTtcbiAgZmlsbFN0YXJzKGVsZW0pO1xufVxuXG5mdW5jdGlvbiBmaWxsU3RhcnMoZWxlbSkge1xuICB2YXIgdmFsdWUgPSBlbGVtLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycpO1xuICBmb3IodmFyIGk9MDsgaSA8IGVsZW0uY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuICAgICBlbGVtLmNoaWxkcmVuW2ldLmNsYXNzTmFtZSA9ICdmYSBmYS1zdGFyICcgKyBzdGFyVHlwZShpKzEsIHZhbHVlKTtcbiAgfVxufVxuXG4vKlxuICBBdmVyYWdlIG9mIGFuIGFycmF5IG9mIG51bWJlcnNcbiovXG5mdW5jdGlvbiBhdmcoYXJyYXkpIHtcbiAgcmV0dXJuIGFycmF5LnJlZHVjZSgocHJldiwgY3VyKSA9PiBwcmV2ICsgY3VyLCAwKS9hcnJheS5sZW5ndGg7XG59XG5cbi8qXG4gIENhbGN1bGF0ZSBob3cgZnVsbCBpcyB0aGUgY3VycmVudCBzdGFyXG4qL1xuZnVuY3Rpb24gc3RhclR5cGUob3JkZXIsIG51bWJlcikge1xuXG4gIGlmKG51bWJlciAtIG9yZGVyID09IC0wLjUpIHtcbiAgICByZXR1cm4gJ2hhbGYnO1xuICB9IGVsc2UgaWYobnVtYmVyIC0gb3JkZXIgPj0gMCkge1xuICAgIHJldHVybiAnZnVsbCdcbiAgfVxuXG4gIHJldHVybiAnZW1wdHknO1xuXG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBodG1sVG9FbGVtZW50KGh0bWwpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZDtcbn1cblxuLypcbiAgU2VsZWN0cyB0aGUgYnJvd3NlciB0cmFuc2l0aW9uIGV2ZW50LCBmcm9tOlxuICBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9jc3MtYW5pbWF0aW9uLWNhbGxiYWNrXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHdoaWNoVHJhbnNpdGlvbkV2ZW50KCl7XG4gICAgdmFyIHQ7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZmFrZWVsZW1lbnQnKTtcbiAgICB2YXIgdHJhbnNpdGlvbnMgPSB7XG4gICAgICAndHJhbnNpdGlvbic6J3RyYW5zaXRpb25lbmQnLFxuICAgICAgJ09UcmFuc2l0aW9uJzonb1RyYW5zaXRpb25FbmQnLFxuICAgICAgJ01velRyYW5zaXRpb24nOid0cmFuc2l0aW9uZW5kJyxcbiAgICAgICdXZWJraXRUcmFuc2l0aW9uJzond2Via2l0VHJhbnNpdGlvbkVuZCdcbiAgICB9XG5cbiAgICBmb3IodCBpbiB0cmFuc2l0aW9ucyl7XG4gICAgICAgIGlmKCBlbC5zdHlsZVt0XSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNpdGlvbnNbdF07XG4gICAgICAgIH1cbiAgICB9XG59Il19
