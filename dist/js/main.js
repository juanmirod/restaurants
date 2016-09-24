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

  return '<article class="row" aria-label="' + restaurant.name + ' ' + Stars.calculateStars(restaurant.reviews) + ' stars">\n            <h2>\n              ' + restaurant.name + '\n              ' + Stars.starsTmpl(Stars.calculateStars(restaurant.reviews)) + '\n            </h2>\n            <div class="thumb">\n              <img src="' + restaurant.photo + '" alt="' + restaurant.name + ' Photograph">\n            </div>\n            <div class="location">\n              <span class="sr-only">Location:</span>\n              <span class="fa fa-map-marker" aria-hidden="true"></span> \n              <span>' + restaurant.address + '</span>\n              <a class="maps" href="' + mapsLink(restaurant.address) + '" target="_blank">Open in Maps</a>\n            </div>\n            <div class="opening">\n              Opens: ' + openingTmpl(restaurant.openingHours) + ' \n            </div>\n            <div class="description">\n              ' + restaurant.description + '\n            </div>\n            <input class="reviews-button" type="button" value="12 reviews - Add your review"/>\n          </article>';
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
  starsRating.addEventListener('click', function () {
    document.getElementById('review-name').focus();
  });
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
  return '<div id="modal" role="dialog" aria-labelledby="modal-title" hidden>\n            <div id="overlay"></div>\n            <div id="dialog">\n              <header>\n                <h3 id="modal-title">' + restaurant.name + '</h3>\n              </header>\n              <div class="content">\n                ' + reviewsTmpl(restaurant.reviews) + '\n                <div class="new-review">\n                  <form aria-labelledby="form-title">\n                    <h3 id="form-title">Add your review</h3>\n                    ' + Stars.starsRating() + '\n                    <input id="review-name" \n                           type="text" \n                           name="name" \n                           placeholder="Your name"\n                           aria-label="Your name"\n                           autocomplete="name">\n                    <textarea id="comment" \n                              name="comment"\n                              aria-label="Comment" \n                              placeholder="Tell something about your experience in this restaurant."></textarea>\n                  </form>\n                </div>\n              </div>\n              <footer>\n                <input id="add-review" type="button" name="addReview" value="Submit">\n                <input id="close-modal" type="button" name="closeModal" value="Close">\n              </footer>\n            </div>\n          </div>';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9tYWluLmpzIiwianMvbW9kYWwuanMiLCJqcy9zdGFycy5qcyIsImpzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ2FnQixJLEdBQUEsSTtRQVlBLFksR0FBQSxZO1FBT0EsWSxHQUFBLFk7UUFPQSxpQixHQUFBLGlCOztBQXZDaEI7O0lBQVksSzs7QUFDWjs7SUFBWSxJOztBQUNaOztJQUFZLEs7Ozs7QUFFWjtBQUNBLElBQUksV0FBSjtBQUFBLElBQ0EsZUFBZSxFQURmO0FBQUEsSUFFQSxlQUFlLEVBRmY7O0FBSUE7Ozs7QUFJTyxTQUFTLElBQVQsR0FBZ0I7O0FBRXJCLFFBQU0sdUJBQU4sRUFDRyxJQURILENBQ1E7QUFBQSxXQUFZLFNBQVMsSUFBVCxFQUFaO0FBQUEsR0FEUixFQUVHLElBRkgsQ0FFUSxnQkFGUixFQUdHLElBSEgsQ0FHUSxlQUhSLEVBSUcsS0FKSCxDQUlTLFVBQVMsS0FBVCxFQUFnQjtBQUNyQixZQUFRLEtBQVIsQ0FBYyxpQ0FBZCxFQUFpRCxLQUFqRDtBQUNELEdBTkg7QUFRRDs7QUFFTSxTQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEI7O0FBRWpDLGlCQUFlLElBQWY7QUFDQSxrQkFBZ0IsbUJBQWhCO0FBRUQ7O0FBRU0sU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCOztBQUVqQyxpQkFBZSxJQUFmO0FBQ0Esa0JBQWdCLG1CQUFoQjtBQUVEOztBQUVNLFNBQVMsaUJBQVQsR0FBNkI7O0FBRWxDLFNBQU8sWUFBWSxNQUFaLENBQW1CLFVBQUMsVUFBRCxFQUFnQjs7QUFFeEMsUUFBSSx1QkFBdUIsSUFBM0I7QUFBQSxRQUNBLGlCQUFpQixJQURqQjs7QUFHQSxRQUFHLGdCQUFnQixFQUFuQixFQUF1Qjs7QUFFckIsNkJBQXVCLFdBQVcsSUFBWCxD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O0FBQ0Q7O0FBRUQ7OztBQUdBLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUF5QixNQUF6QixFQUFpQzs7QUFFL0IsTUFBRyxTQUFTLEtBQVQsSUFBa0IsQ0FBQyxHQUF0QixFQUEyQjtBQUN6QixXQUFPLE1BQVA7QUFDRCxHQUZELE1BRU8sSUFBRyxTQUFTLEtBQVQsSUFBa0IsQ0FBckIsRUFBd0I7QUFDN0IsV0FBTyxNQUFQO0FBQ0Q7O0FBRUQsU0FBTyxPQUFQO0FBRUQ7Ozs7Ozs7O1FDMUdlLGEsR0FBQSxhO1FBVUEsb0IsR0FBQSxvQjtBQVZULFNBQVMsYUFBVCxDQUF1QixJQUF2QixFQUE2QjtBQUNoQyxRQUFJLFdBQVcsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQWY7QUFDQSxhQUFTLFNBQVQsR0FBcUIsSUFBckI7QUFDQSxXQUFPLFNBQVMsT0FBVCxDQUFpQixVQUF4QjtBQUNIOztBQUVEOzs7O0FBSU8sU0FBUyxvQkFBVCxHQUErQjtBQUNsQyxRQUFJLENBQUo7QUFDQSxRQUFJLEtBQUssU0FBUyxhQUFULENBQXVCLGFBQXZCLENBQVQ7QUFDQSxRQUFJLGNBQWM7QUFDaEIsc0JBQWEsZUFERztBQUVoQix1QkFBYyxnQkFGRTtBQUdoQix5QkFBZ0IsZUFIQTtBQUloQiw0QkFBbUI7QUFKSCxLQUFsQjs7QUFPQSxTQUFJLENBQUosSUFBUyxXQUFULEVBQXFCO0FBQ2pCLFlBQUksR0FBRyxLQUFILENBQVMsQ0FBVCxNQUFnQixTQUFwQixFQUErQjtBQUMzQixtQkFBTyxZQUFZLENBQVosQ0FBUDtBQUNIO0FBQ0o7QUFDSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBNb2RhbCBmcm9tICcuL21vZGFsLmpzJztcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi91dGlsLmpzJztcbmltcG9ydCAqIGFzIFN0YXJzIGZyb20gJy4vc3RhcnMuanMnO1xuXG4vLyBtb2R1bGUgdmFyaWFibGVzLCB1c2VkIHRvIGZpbHRlciB0aGUgcmVzdGF1cmFudHMgYnkgbmFtZSBhbmQgdHlwZVxudmFyIHJlc3RhdXJhbnRzLCBcbnR5cGVTZWxlY3RlZCA9ICcnLCBcbnNlYXJjaFN0cmluZyA9ICcnO1xuXG4vKiBcbiAgSW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24gbG9hZGluZyB0aGUgcmVzdGF1cmFudHMgZGF0YSBcbiAgYW5kIGFkZGluZyB0aGUgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBpbnRlcmFjdGl2ZSBlbGVtZW50cy5cbiovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcblxuICBmZXRjaCgnZGF0YS9yZXN0YXVyYW50cy5qc29uJylcbiAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgLnRoZW4oc3RvcmVSZXN0YXVyYW50cylcbiAgICAudGhlbihzaG93UmVzdGF1cmFudHMpXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgbG9hZCB0aGUgcmVzdGF1cmFudHMuJywgZXJyb3IpO1xuICAgIH0pO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJCeVR5cGUodHlwZSkge1xuXG4gIHR5cGVTZWxlY3RlZCA9IHR5cGU7XG4gIHNob3dSZXN0YXVyYW50cyhmaWx0ZXJSZXN0YXVyYW50cygpKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQnlOYW1lKG5hbWUpIHtcbiAgXG4gIHNlYXJjaFN0cmluZyA9IG5hbWU7XG4gIHNob3dSZXN0YXVyYW50cyhmaWx0ZXJSZXN0YXVyYW50cygpKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyUmVzdGF1cmFudHMoKSB7XG5cbiAgcmV0dXJuIHJlc3RhdXJhbnRzLmZpbHRlcigocmVzdGF1cmFudCkgPT4ge1xuICAgIFxuICAgIHZhciBjb250YWluc1NlYXJjaFN0cmluZyA9IHRydWUsIFxuICAgIGlzVHlwZVNlbGVjdGVkID0gdHJ1ZTtcbiAgICBcbiAgICBpZihzZWFyY2hTdHJpbmcgIT0gJycpIHtcbiAgXG4gICAgICBjb250YWluc1NlYXJjaFN0cmluZyA9IHJlc3RhdXJhbnQubmFtZS5pbmRleE9mKHNlYXJjaFN0cmluZykgIT0gLTE7XG4gIFxuICAgIH0gXG5cbiAgICBpZih0eXBlU2VsZWN0ZWQgIT0gJycpe1xuXG4gICAgICBpc1R5cGVTZWxlY3RlZCA9IChyZXN0YXVyYW50LnR5cGUgPT09IHR5cGVTZWxlY3RlZCk7XG5cbiAgICB9IFxuXG4gICAgcmV0dXJuIGNvbnRhaW5zU2VhcmNoU3RyaW5nICYmIGlzVHlwZVNlbGVjdGVkO1xuICAgIFxuICB9KTtcblxufVxuXG4vKiBcbiAgU3RvcmVzIHRoZSByZXN0YXVyYW50cyBhcnJheSBpbiBhIHZhcmlhYmxlIGZvciBmaWx0ZXJzIFxuICBUaGV5IGNvdWxkIGJlIHN0b3JlZCB0byBsb2NhbHN0b3JhZ2Ugb3IgaW5kZXhlZERCXG4gIGJ1dCBmb3IgdGhpcyBhcHAgaXQgd2lsbCBkbyB3aXRoIGEgbW9kdWxlIHZhcmlhYmxlLlxuKi9cbmZ1bmN0aW9uIHN0b3JlUmVzdGF1cmFudHMocmVzKSB7XG4gIHJlc3RhdXJhbnRzID0gcmVzO1xuICByZXR1cm4gcmVzO1xufVxuXG4vKlxuICBSZW5kZXIgYWxsIHJlc3RhdXJhbnRzIHVzaW5nIHRoZSByZXN0YXVyYW50IHRlbXBsYXRlXG4qL1xuZnVuY3Rpb24gc2hvd1Jlc3RhdXJhbnRzKHJlc3RhdXJhbnRzKSB7XG4gIFxuICB2YXIgcmVzdGF1cmFudHNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnRzLWxpc3QnKTtcbiAgcmVzdGF1cmFudHNMaXN0LmlubmVySFRNTCA9ICcnO1xuICByZXN0YXVyYW50cy5mb3JFYWNoKChyZXN0YXVyYW50KSA9PiB7XG5cbiAgICB2YXIgcmVzdGF1cmFudEVsZW0gPSBVdGlsLmh0bWxUb0VsZW1lbnQocmVzdGF1cmFudFRtcGwocmVzdGF1cmFudCkpO1xuICAgIHZhciBidXR0b24gPSByZXN0YXVyYW50RWxlbS5xdWVyeVNlbGVjdG9yKCcucmV2aWV3cy1idXR0b24nKTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gTW9kYWwub3Blbk1vZGFsKHJlc3RhdXJhbnQpO1xuICAgIH0pO1xuXG4gICAgcmVzdGF1cmFudHNMaXN0LmFwcGVuZENoaWxkKHJlc3RhdXJhbnRFbGVtKTtcblxuICB9KTtcblxufVxuXG4vLy0tLS0tLS0tLS0gVGVtcGxhdGVzIC0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gcmVzdGF1cmFudFRtcGwocmVzdGF1cmFudCkge1xuXG4gIHJldHVybiBgPGFydGljbGUgY2xhc3M9XCJyb3dcIiBhcmlhLWxhYmVsPVwiJHtyZXN0YXVyYW50Lm5hbWV9ICR7U3RhcnMuY2FsY3VsYXRlU3RhcnMocmVzdGF1cmFudC5yZXZpZXdzKX0gc3RhcnNcIj5cbiAgICAgICAgICAgIDxoMj5cbiAgICAgICAgICAgICAgJHtyZXN0YXVyYW50Lm5hbWV9XG4gICAgICAgICAgICAgICR7U3RhcnMuc3RhcnNUbXBsKFN0YXJzLmNhbGN1bGF0ZVN0YXJzKHJlc3RhdXJhbnQucmV2aWV3cykpfVxuICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aHVtYlwiPlxuICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7cmVzdGF1cmFudC5waG90b31cIiBhbHQ9XCIke3Jlc3RhdXJhbnQubmFtZX0gUGhvdG9ncmFwaFwiPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9jYXRpb25cIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+TG9jYXRpb246PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZhIGZhLW1hcC1tYXJrZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IFxuICAgICAgICAgICAgICA8c3Bhbj4ke3Jlc3RhdXJhbnQuYWRkcmVzc308L3NwYW4+XG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwibWFwc1wiIGhyZWY9XCIke21hcHNMaW5rKHJlc3RhdXJhbnQuYWRkcmVzcyl9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+T3BlbiBpbiBNYXBzPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwib3BlbmluZ1wiPlxuICAgICAgICAgICAgICBPcGVuczogJHtvcGVuaW5nVG1wbChyZXN0YXVyYW50Lm9wZW5pbmdIb3Vycyl9IFxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgJHtyZXN0YXVyYW50LmRlc2NyaXB0aW9ufVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJyZXZpZXdzLWJ1dHRvblwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjEyIHJldmlld3MgLSBBZGQgeW91ciByZXZpZXdcIi8+XG4gICAgICAgICAgPC9hcnRpY2xlPmA7XG5cbn1cblxuZnVuY3Rpb24gb3BlbmluZ1RtcGwob3BlbmluZ0hvdXJzKSB7XG5cbiAgcmV0dXJuIG9wZW5pbmdIb3Vycy5tYXAodGltZVRtcGwpLmpvaW4oJyB8ICcpO1xuXG59XG5cbmZ1bmN0aW9uIHRpbWVUbXBsKHRpbWUpIHtcblxuICByZXR1cm4gYDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JHt0aW1lLm9wZW59IC0gJHt0aW1lLmNsb3NlfTwvc3Bhbj5gO1xuXG59XG5cbmZ1bmN0aW9uIG1hcHNMaW5rKGFkZHJlc3MpIHtcblxuICByZXR1cm4gYGh0dHA6Ly9tYXBzLmdvb2dsZS5jb20vP3E9JHtlbmNvZGVVUklDb21wb25lbnQoYWRkcmVzcyl9YDtcblxufVxuIiwiaW1wb3J0ICogYXMgQXBwIGZyb20gJy4vYXBwLmpzJztcblxuKGZ1bmN0aW9uKCkge1xuXG4gIGZ1bmN0aW9uIHJlYWR5KCkge1xuICAgICAgXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgXG4gICAgICAvLyByZXNvbHZlIHRoZSBwcm9taXNlIHdoZW4gdGhlIGRvY3VtZW50IGlzIHJlYWR5XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdsb2FkaW5nJykge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9O1xuXG4gIHJlYWR5KCkudGhlbihmdW5jdGlvbigpIHtcbiAgICBBcHAuaW5pdCgpO1xuXG4gICAgLy8gYWRkIGZpbHRlcmluZyBsaXN0ZW5lcnNcbiAgICB2YXIgdHlwZUJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgndHlwZScpO1xuICAgIGZvcih2YXIgaT0wOyBpIDwgdHlwZUJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHR5cGVCdXR0b25zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgQXBwLmZpbHRlckJ5VHlwZSh0aGlzLnZhbHVlKTtcblxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIGlucHV0IGxpc3RlbmVyIGZvciB0aGUgc2VhcmNoIGJveCwgd2Ugd2FudCB0byB1cGRhdGVcbiAgICAvLyB0aGUgbGlzdCBvbiBlYWNoIGtleXN0cm9rZSAodGhlIGxpc3QgaXMgYWxyZWFkeSBjb21wbGV0ZWx5IFxuICAgIC8vIGxvYWRlZCBzbyB0aGlzIGRvZXNuJ3QgbWFrZSBtb3JlIHJlcXVlc3RzKVxuICAgIHZhciBuYW1lRmlsdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaGJveCcpO1xuICAgIG5hbWVGaWx0ZXIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgQXBwLmZpbHRlckJ5TmFtZSh0aGlzLnZhbHVlKTtcblxuICAgIH0pO1xuXG4gIH0pO1xuXG59KSgpOyIsImltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi91dGlsLmpzJztcbmltcG9ydCAqIGFzIFN0YXJzIGZyb20gJy4vc3RhcnMuanMnO1xuXG5jb25zdCBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9ICdhW2hyZWZdLCBbcm9sZT1cInNsaWRlclwiXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0nO1xuXG52YXIgd3JhcHBlciwgbW9kYWwsIG92ZXJsYXksIHN1Ym1pdEJ1dHRvbiwgY2xvc2VCdXR0b24sIGZvY3VzZWRFbGVtZW50QmVmb3JlTW9kYWw7XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuTW9kYWwocmVzdGF1cmFudCkge1xuXG4gIHdyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpO1xuICBtb2RhbCA9IFV0aWwuaHRtbFRvRWxlbWVudChtb2RhbFRtcGwocmVzdGF1cmFudCkpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsKTtcbiAgXG4gIG92ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3ZlcmxheScpO1xuICBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZS1tb2RhbCcpO1xuICBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkLXJldmlldycpO1xuICB2YXIgc3RhcnNSYXRpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnMtcmF0aW5nJyk7XG5cbiAgZm9jdXNlZEVsZW1lbnRCZWZvcmVNb2RhbCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cbiAgLy8gc2hvd3MgdGhlIG1vZGFsIGFuZCBoaWRlcyB0aGUgcmVzdCBvZiB0aGUgY29udGVudCBmb3JcbiAgLy8gc2NyZWVuIHJlYWRlcnNcbiAgbW9kYWwucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpe1xuICAgIG1vZGFsLmNsYXNzTmFtZSA9ICdzaG93JztcbiAgfSk7XG4gIHdyYXBwZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuXG4gIGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VNb2RhbCk7XG4gIG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU1vZGFsKTtcbiAgc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3VibWl0UmV2aWV3KHJlc3RhdXJhbnQpKTtcbiAgc3RhcnNSYXRpbmcuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIFN0YXJzLnN0YXJzUmF0aW5nS2V5ZG93bkhhbmRsZXIpO1xuICBzdGFyc1JhdGluZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXctbmFtZScpLmZvY3VzKCk7XG4gIH0pO1xuICBmb3IodmFyIGk9MDsgaSA8IHN0YXJzUmF0aW5nLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgc3RhcnNSYXRpbmcuY2hpbGRyZW5baV0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgU3RhcnMuc3RhcnNSYXRpbmdIb3ZlckhhbmRsZXIpO1xuICB9IFxuXG4gIC8vIEFkZCBrZXlib2FyZCBsaXN0ZW5lciB0byBjcmVhdGUgdGhlIGZvY3VzLXRyYXBcbiAgdmFyIHtmaXJzdEVsZW1lbnQsIGxhc3RFbGVtZW50fSA9IGZpbmRGb2N1c0xpbWl0RWxlbWVudHMobW9kYWwpO1xuICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZm9jdXNUcmFwQ29udHJvbGxlcihmaXJzdEVsZW1lbnQsIGxhc3RFbGVtZW50KSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XG5cbiAgd3JhcHBlci5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gIG1vZGFsLmNsYXNzTmFtZSA9ICcnO1xuICBcbiAgdmFyIHRyYW5zaXRpb25FdmVudCA9IFV0aWwud2hpY2hUcmFuc2l0aW9uRXZlbnQoKTtcbiAgdHJhbnNpdGlvbkV2ZW50ICYmIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIodHJhbnNpdGlvbkV2ZW50LCByZW1vdmVNb2RhbCk7XG5cbn1cblxuZnVuY3Rpb24gc3VibWl0UmV2aWV3KHJlc3RhdXJhbnQpIHtcblxuICByZXR1cm4gZnVuY3Rpb24oKXtcblxuICAgIHZhciBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlldy1uYW1lJyk7XG4gICAgdmFyIGNvbW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29tbWVudCcpO1xuICAgIHZhciBzdGFycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFycy1yYXRpbmcnKTtcbiAgICB2YXIgcmV2aWV3ID0ge1xuICAgICAgbmFtZTogbmFtZS52YWx1ZSxcbiAgICAgIGNvbW1lbnQ6IGNvbW1lbnQudmFsdWUsXG4gICAgICBzdGFyczogc3RhcnMuZ2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JyksXG4gICAgICBjcmVhdGVkX2F0OiBEYXRlLm5vdygpXG4gICAgfTtcblxuICAgIHJlc3RhdXJhbnQucmV2aWV3cy5wdXNoKHJldmlldyk7XG4gICAgcmVtb3ZlTW9kYWwoKTtcbiAgICBvcGVuTW9kYWwocmVzdGF1cmFudCk7XG5cbiAgfTsgIFxuXG59XG5cbmZ1bmN0aW9uIHJlbW92ZU1vZGFsKCkge1xuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKG1vZGFsKTtcbn1cblxuZnVuY3Rpb24gZmluZEZvY3VzTGltaXRFbGVtZW50cyhtb2RhbCkge1xuXG4gIC8vIEZpbmQgYWxsIGZvY3VzYWJsZSBjaGlsZHJlblxuICB2YXIgZm9jdXNhYmxlRWxlbWVudHMgPSBtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nKTtcbiAgXG4gIHJldHVybiB7XG4gICAgZmlyc3RFbGVtZW50OiBmb2N1c2FibGVFbGVtZW50c1swXSxcbiAgICBsYXN0RWxlbWVudDogZm9jdXNhYmxlRWxlbWVudHNbZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMV1cbiAgfTtcblxufVxuXG5mdW5jdGlvbiBmb2N1c1RyYXBDb250cm9sbGVyKGZpcnN0RWxlbWVudCwgbGFzdEVsZW1lbnQpIHtcblxuICBmaXJzdEVsZW1lbnQuZm9jdXMoKTtcblxuICByZXR1cm4gZnVuY3Rpb24oZXZ0KSB7XG4gICAgLy8gQ2hlY2sgZm9yIFRBQiBrZXkgcHJlc3NcbiAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDkpIHtcblxuICAgICAgLy8gU0hJRlQgKyBUQUJcbiAgICAgIGlmIChldnQuc2hpZnRLZXkpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0RWxlbWVudCkge1xuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGxhc3RFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cblxuICAgICAgLy8gVEFCXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdEVsZW1lbnQpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBmaXJzdEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEVTQ0FQRVxuICAgIGlmIChldnQua2V5Q29kZSA9PT0gMjcpIHtcbiAgICAgIGNsb3NlTW9kYWwoKTtcbiAgICB9XG4gIH07XG5cbn1cblxuZnVuY3Rpb24gbW9kYWxUbXBsKHJlc3RhdXJhbnQpIHtcbiAgcmV0dXJuIGA8ZGl2IGlkPVwibW9kYWxcIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1sYWJlbGxlZGJ5PVwibW9kYWwtdGl0bGVcIiBoaWRkZW4+XG4gICAgICAgICAgICA8ZGl2IGlkPVwib3ZlcmxheVwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cImRpYWxvZ1wiPlxuICAgICAgICAgICAgICA8aGVhZGVyPlxuICAgICAgICAgICAgICAgIDxoMyBpZD1cIm1vZGFsLXRpdGxlXCI+JHtyZXN0YXVyYW50Lm5hbWV9PC9oMz5cbiAgICAgICAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XG4gICAgICAgICAgICAgICAgJHtyZXZpZXdzVG1wbChyZXN0YXVyYW50LnJldmlld3MpfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZXctcmV2aWV3XCI+XG4gICAgICAgICAgICAgICAgICA8Zm9ybSBhcmlhLWxhYmVsbGVkYnk9XCJmb3JtLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMyBpZD1cImZvcm0tdGl0bGVcIj5BZGQgeW91ciByZXZpZXc8L2gzPlxuICAgICAgICAgICAgICAgICAgICAke1N0YXJzLnN0YXJzUmF0aW5nKCl9XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cInJldmlldy1uYW1lXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT1cIm5hbWVcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiWW91ciBuYW1lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJZb3VyIG5hbWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b2NvbXBsZXRlPVwibmFtZVwiPlxuICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJjb21tZW50XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVwiY29tbWVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiQ29tbWVudFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJUZWxsIHNvbWV0aGluZyBhYm91dCB5b3VyIGV4cGVyaWVuY2UgaW4gdGhpcyByZXN0YXVyYW50LlwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8Zm9vdGVyPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImFkZC1yZXZpZXdcIiB0eXBlPVwiYnV0dG9uXCIgbmFtZT1cImFkZFJldmlld1wiIHZhbHVlPVwiU3VibWl0XCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiY2xvc2UtbW9kYWxcIiB0eXBlPVwiYnV0dG9uXCIgbmFtZT1cImNsb3NlTW9kYWxcIiB2YWx1ZT1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgIDwvZm9vdGVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+YDtcbn1cblxuZnVuY3Rpb24gcmV2aWV3c1RtcGwocmV2aWV3cykge1xuXG4gIHJldHVybiByZXZpZXdzLm1hcChyZXZpZXdUbXBsKS5qb2luKCcnKTtcblxufVxuXG5mdW5jdGlvbiByZXZpZXdUbXBsKHJldmlldykge1xuICByZXR1cm4gYDxkaXYgY2xhc3M9XCJyZXZpZXdcIj5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwiYXV0aG9yXCI+XG4gICAgICAgICAgICAgICR7U3RhcnMuc3RhcnNUbXBsKHJldmlldy5zdGFycyl9XG4gICAgICAgICAgICAgIDxzcGFuPmJ5ICR7cmV2aWV3Lm5hbWV9IG9uICR7cmV2aWV3LmNyZWF0ZWRfYXR9PC9zcGFuPiAgICAgICAgICAgICAgXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzcz1cImNvbW1lbnRcIj5cbiAgICAgICAgICAgICAgJHtyZXZpZXcuY29tbWVudH1cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5gO1xufSIsIi8qXG4gIENhbGN1bGF0ZSB0aGUgYXZlcmFnZSBmcm9tIGFsbCBzdGFycyBpbiB0aGUgcmV2aWV3c1xuKi9cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVTdGFycyhyZXZpZXdzKSB7XG5cbiAgdmFyIHN0YXJzID0gcmV2aWV3cy5tYXAoKHJldmlldykgPT4gcmV2aWV3LnN0YXJzKTtcbiAgcmV0dXJuIGF2ZyhzdGFycykgO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFyc1RtcGwobnVtYmVyKSB7XG5cbiAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwic3RhcnNcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPiR7bnVtYmVyfSBzdGFyczwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDEsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoMiwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSgzLCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDQsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoNSwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgPC9kaXY+YDtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnNSYXRpbmcoKSB7XG5cbiAgcmV0dXJuIGA8bGFiZWwgY2xhc3M9XCJzci1vbmx5XCIgZm9yPVwic3RhcnMtcmF0aW5nXCI+XG4gICAgICAgICAgICBQbGVhc2Ugc2VsZWN0IGEgbnVtYmVyIG9mIHN0YXJzXG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8ZGl2IGlkPVwic3RhcnMtcmF0aW5nXCIgXG4gICAgICAgICAgICAgICByb2xlPVwic2xpZGVyXCJcbiAgICAgICAgICAgICAgIHRhYmluZGV4PVwiMFwiIFxuICAgICAgICAgICAgICAgYXJpYS12YWx1ZW1pbj1cIjBcIlxuICAgICAgICAgICAgICAgYXJpYS12YWx1ZW1heD1cIjVcIlxuICAgICAgICAgICAgICAgYXJpYS12YWx1ZW5vdz1cIjBcIj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBlbXB0eVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBlbXB0eVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBlbXB0eVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBlbXB0eVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBlbXB0eVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICA8L2Rpdj5gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnNSYXRpbmdLZXlkb3duSGFuZGxlcihldnQpIHtcblxuICB2YXIgZWxlbSA9IGV2dC50YXJnZXQ7XG4gIHN3aXRjaChldnQua2V5Q29kZSkge1xuXG4gICAgLy8gQXJyb3cgTEVGVC9ET1dOXG4gICAgY2FzZSAzNzpcbiAgICBjYXNlIDQwOlxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgdmFsdWUgPSAocGFyc2VJbnQoZWxlbS5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnKSktMSk7IC8vIDAtNSB2YWx1ZXNcbiAgICAgIGlmKHZhbHVlIDwgMCkge1xuICAgICAgICB2YWx1ZSA9IDU7XG4gICAgICB9IFxuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCB2YWx1ZSk7XG4gICAgICBmaWxsU3RhcnMoZWxlbSk7XG4gICAgICBicmVhaztcblxuICAgIC8vIEFycm93IFJJR0hUL1VQXG4gICAgY2FzZSAzODpcbiAgICBjYXNlIDM5OlxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgdmFsdWUgPSAocGFyc2VJbnQoZWxlbS5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnKSkrMSklNjsgXG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIHZhbHVlKTtcbiAgICAgIGZpbGxTdGFycyhlbGVtKTtcbiAgICAgIGJyZWFrO1xuXG4gIH1cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnNSYXRpbmdIb3ZlckhhbmRsZXIoZXZ0KSB7XG5cbiAgdmFyIGVsZW0gPSBldnQudGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG4gIHZhciBpID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChlbGVtLmNoaWxkcmVuLCBldnQudGFyZ2V0KTtcbiAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCBpKzEpO1xuICBmaWxsU3RhcnMoZWxlbSk7XG59XG5cbmZ1bmN0aW9uIGZpbGxTdGFycyhlbGVtKSB7XG4gIHZhciB2YWx1ZSA9IGVsZW0uZ2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93Jyk7XG4gIGZvcih2YXIgaT0wOyBpIDwgZWxlbS5jaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgIGVsZW0uY2hpbGRyZW5baV0uY2xhc3NOYW1lID0gJ2ZhIGZhLXN0YXIgJyArIHN0YXJUeXBlKGkrMSwgdmFsdWUpO1xuICB9XG59XG5cbi8qXG4gIEF2ZXJhZ2Ugb2YgYW4gYXJyYXkgb2YgbnVtYmVyc1xuKi9cbmZ1bmN0aW9uIGF2ZyhhcnJheSkge1xuICByZXR1cm4gYXJyYXkucmVkdWNlKChwcmV2LCBjdXIpID0+IHByZXYgKyBjdXIsIDApL2FycmF5Lmxlbmd0aDtcbn1cblxuLypcbiAgQ2FsY3VsYXRlIGhvdyBmdWxsIGlzIHRoZSBjdXJyZW50IHN0YXJcbiovXG5mdW5jdGlvbiBzdGFyVHlwZShvcmRlciwgbnVtYmVyKSB7XG5cbiAgaWYobnVtYmVyIC0gb3JkZXIgPT0gLTAuNSkge1xuICAgIHJldHVybiAnaGFsZic7XG4gIH0gZWxzZSBpZihudW1iZXIgLSBvcmRlciA+PSAwKSB7XG4gICAgcmV0dXJuICdmdWxsJ1xuICB9XG5cbiAgcmV0dXJuICdlbXB0eSc7XG5cbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIGh0bWxUb0VsZW1lbnQoaHRtbCkge1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkO1xufVxuXG4vKlxuICBTZWxlY3RzIHRoZSBicm93c2VyIHRyYW5zaXRpb24gZXZlbnQsIGZyb206XG4gIGh0dHBzOi8vZGF2aWR3YWxzaC5uYW1lL2Nzcy1hbmltYXRpb24tY2FsbGJhY2tcbiovXG5leHBvcnQgZnVuY3Rpb24gd2hpY2hUcmFuc2l0aW9uRXZlbnQoKXtcbiAgICB2YXIgdDtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmYWtlZWxlbWVudCcpO1xuICAgIHZhciB0cmFuc2l0aW9ucyA9IHtcbiAgICAgICd0cmFuc2l0aW9uJzondHJhbnNpdGlvbmVuZCcsXG4gICAgICAnT1RyYW5zaXRpb24nOidvVHJhbnNpdGlvbkVuZCcsXG4gICAgICAnTW96VHJhbnNpdGlvbic6J3RyYW5zaXRpb25lbmQnLFxuICAgICAgJ1dlYmtpdFRyYW5zaXRpb24nOid3ZWJraXRUcmFuc2l0aW9uRW5kJ1xuICAgIH1cblxuICAgIGZvcih0IGluIHRyYW5zaXRpb25zKXtcbiAgICAgICAgaWYoIGVsLnN0eWxlW3RdICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc2l0aW9uc1t0XTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=
