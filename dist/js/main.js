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

  return '<article class="row">\n            <h2>\n              <a href="#more">\n                ' + restaurant.name + '\n              </a>\n              ' + Stars.starsTmpl(Stars.calculateStars(restaurant.reviews)) + '\n            </h2>\n            <div class="thumb">\n              <img src="' + restaurant.photo + '" alt="' + restaurant.name + ' Photograph">\n            </div>\n            <div class="location">\n              <span class="sr-only">Location:</span>\n              <span class="fa fa-map-marker" aria-hidden="true"></span> \n              <span>' + restaurant.address + '</span>\n              <a class="maps" href="' + mapsLink(restaurant.address) + '" target="_blank">Open in Maps</a>\n            </div>\n            <div class="opening">\n              Opens: ' + openingTmpl(restaurant.openingHours) + ' \n            </div>\n            <div class="description">\n              ' + restaurant.description + '\n            </div>\n            <input class="reviews-button" type="button" value="12 reviews - Add your review"/>\n          </article>';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9tYWluLmpzIiwianMvbW9kYWwuanMiLCJqcy9zdGFycy5qcyIsImpzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ2FnQixJLEdBQUEsSTtRQVlBLFksR0FBQSxZO1FBT0EsWSxHQUFBLFk7UUFPQSxpQixHQUFBLGlCOztBQXZDaEI7O0lBQVksSzs7QUFDWjs7SUFBWSxJOztBQUNaOztJQUFZLEs7Ozs7QUFFWjtBQUNBLElBQUksV0FBSjtBQUFBLElBQ0EsZUFBZSxFQURmO0FBQUEsSUFFQSxlQUFlLEVBRmY7O0FBSUE7Ozs7QUFJTyxTQUFTLElBQVQsR0FBZ0I7O0FBRXJCLFFBQU0sdUJBQU4sRUFDRyxJQURILENBQ1E7QUFBQSxXQUFZLFNBQVMsSUFBVCxFQUFaO0FBQUEsR0FEUixFQUVHLElBRkgsQ0FFUSxnQkFGUixFQUdHLElBSEgsQ0FHUSxlQUhSLEVBSUcsS0FKSCxDQUlTLFVBQVMsS0FBVCxFQUFnQjtBQUNyQixZQUFRLEtBQVIsQ0FBYyxpQ0FBZCxFQUFpRCxLQUFqRDtBQUNELEdBTkg7QUFRRDs7QUFFTSxTQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEI7O0FBRWpDLGlCQUFlLElBQWY7QUFDQSxrQkFBZ0IsbUJBQWhCO0FBRUQ7O0FBRU0sU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCOztBQUVqQyxpQkFBZSxJQUFmO0FBQ0Esa0JBQWdCLG1CQUFoQjtBQUVEOztBQUVNLFNBQVMsaUJBQVQsR0FBNkI7O0FBRWxDLFNBQU8sWUFBWSxNQUFaLENBQW1CLFVBQUMsVUFBRCxFQUFnQjs7QUFFeEMsUUFBSSx1QkFBdUIsSUFBM0I7QUFBQSxRQUNBLGlCQUFpQixJQURqQjs7QUFHQSxRQUFHLGdCQUFnQixFQUFuQixFQUF1Qjs7QUFFckIsNkJBQXVCLFdBQVcsSUFBWCxD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QUFpQzs7QUFFL0IsTUFBRyxTQUFTLEtBQVQsSUFBa0IsQ0FBQyxHQUF0QixFQUEyQjtBQUN6QixXQUFPLE1BQVA7QUFDRCxHQUZELE1BRU8sSUFBRyxTQUFTLEtBQVQsSUFBa0IsQ0FBckIsRUFBd0I7QUFDN0IsV0FBTyxNQUFQO0FBQ0Q7O0FBRUQsU0FBTyxPQUFQO0FBRUQ7Ozs7Ozs7O1FDMUdlLGEsR0FBQSxhO1FBVUEsb0IsR0FBQSxvQjtBQVZULFNBQVMsYUFBVCxDQUF1QixJQUF2QixFQUE2QjtBQUNoQyxRQUFJLFdBQVcsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQWY7QUFDQSxhQUFTLFNBQVQsR0FBcUIsSUFBckI7QUFDQSxXQUFPLFNBQVMsT0FBVCxDQUFpQixVQUF4QjtBQUNIOztBQUVEOzs7O0FBSU8sU0FBUyxvQkFBVCxHQUErQjtBQUNsQyxRQUFJLENBQUo7QUFDQSxRQUFJLEtBQUssU0FBUyxhQUFULENBQXVCLGFBQXZCLENBQVQ7QUFDQSxRQUFJLGNBQWM7QUFDaEIsc0JBQWEsZUFERztBQUVoQix1QkFBYyxnQkFGRTtBQUdoQix5QkFBZ0IsZUFIQTtBQUloQiw0QkFBbUI7QUFKSCxLQUFsQjs7QUFPQSxTQUFJLENBQUosSUFBUyxXQUFULEVBQXFCO0FBQ2pCLFlBQUksR0FBRyxLQUFILENBQVMsQ0FBVCxNQUFnQixTQUFwQixFQUErQjtBQUMzQixtQkFBTyxZQUFZLENBQVosQ0FBUDtBQUNIO0FBQ0o7QUFDSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBNb2RhbCBmcm9tICcuL21vZGFsLmpzJztcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi91dGlsLmpzJztcbmltcG9ydCAqIGFzIFN0YXJzIGZyb20gJy4vc3RhcnMuanMnO1xuXG4vLyBtb2R1bGUgdmFyaWFibGVzLCB1c2VkIHRvIGZpbHRlciB0aGUgcmVzdGF1cmFudHMgYnkgbmFtZSBhbmQgdHlwZVxudmFyIHJlc3RhdXJhbnRzLCBcbnR5cGVTZWxlY3RlZCA9ICcnLCBcbnNlYXJjaFN0cmluZyA9ICcnO1xuXG4vKiBcbiAgSW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24gbG9hZGluZyB0aGUgcmVzdGF1cmFudHMgZGF0YSBcbiAgYW5kIGFkZGluZyB0aGUgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBpbnRlcmFjdGl2ZSBlbGVtZW50cy5cbiovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcblxuICBmZXRjaCgnZGF0YS9yZXN0YXVyYW50cy5qc29uJylcbiAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgLnRoZW4oc3RvcmVSZXN0YXVyYW50cylcbiAgICAudGhlbihzaG93UmVzdGF1cmFudHMpXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgbG9hZCB0aGUgcmVzdGF1cmFudHMuJywgZXJyb3IpO1xuICAgIH0pO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJCeVR5cGUodHlwZSkge1xuXG4gIHR5cGVTZWxlY3RlZCA9IHR5cGU7XG4gIHNob3dSZXN0YXVyYW50cyhmaWx0ZXJSZXN0YXVyYW50cygpKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQnlOYW1lKG5hbWUpIHtcbiAgXG4gIHNlYXJjaFN0cmluZyA9IG5hbWU7XG4gIHNob3dSZXN0YXVyYW50cyhmaWx0ZXJSZXN0YXVyYW50cygpKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyUmVzdGF1cmFudHMoKSB7XG5cbiAgcmV0dXJuIHJlc3RhdXJhbnRzLmZpbHRlcigocmVzdGF1cmFudCkgPT4ge1xuICAgIFxuICAgIHZhciBjb250YWluc1NlYXJjaFN0cmluZyA9IHRydWUsIFxuICAgIGlzVHlwZVNlbGVjdGVkID0gdHJ1ZTtcbiAgICBcbiAgICBpZihzZWFyY2hTdHJpbmcgIT0gJycpIHtcbiAgXG4gICAgICBjb250YWluc1NlYXJjaFN0cmluZyA9IHJlc3RhdXJhbnQubmFtZS5pbmRleE9mKHNlYXJjaFN0cmluZykgIT0gLTE7XG4gIFxuICAgIH0gXG5cbiAgICBpZih0eXBlU2VsZWN0ZWQgIT0gJycpe1xuXG4gICAgICBpc1R5cGVTZWxlY3RlZCA9IChyZXN0YXVyYW50LnR5cGUgPT09IHR5cGVTZWxlY3RlZCk7XG5cbiAgICB9IFxuXG4gICAgcmV0dXJuIGNvbnRhaW5zU2VhcmNoU3RyaW5nICYmIGlzVHlwZVNlbGVjdGVkO1xuICAgIFxuICB9KTtcblxufVxuXG4vKiBcbiAgU3RvcmVzIHRoZSByZXN0YXVyYW50cyBhcnJheSBpbiBhIHZhcmlhYmxlIGZvciBmaWx0ZXJzIFxuICBUaGV5IGNvdWxkIGJlIHN0b3JlZCB0byBsb2NhbHN0b3JhZ2Ugb3IgaW5kZXhlZERCXG4gIGJ1dCBmb3IgdGhpcyBhcHAgaXQgd2lsbCBkbyB3aXRoIGEgbW9kdWxlIHZhcmlhYmxlLlxuKi9cbmZ1bmN0aW9uIHN0b3JlUmVzdGF1cmFudHMocmVzKSB7XG4gIHJlc3RhdXJhbnRzID0gcmVzO1xuICByZXR1cm4gcmVzO1xufVxuXG4vKlxuICBSZW5kZXIgYWxsIHJlc3RhdXJhbnRzIHVzaW5nIHRoZSByZXN0YXVyYW50IHRlbXBsYXRlXG4qL1xuZnVuY3Rpb24gc2hvd1Jlc3RhdXJhbnRzKHJlc3RhdXJhbnRzKSB7XG4gIFxuICB2YXIgcmVzdGF1cmFudHNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnRzLWxpc3QnKTtcbiAgcmVzdGF1cmFudHNMaXN0LmlubmVySFRNTCA9ICcnO1xuICByZXN0YXVyYW50cy5mb3JFYWNoKChyZXN0YXVyYW50KSA9PiB7XG5cbiAgICB2YXIgcmVzdGF1cmFudEVsZW0gPSBVdGlsLmh0bWxUb0VsZW1lbnQocmVzdGF1cmFudFRtcGwocmVzdGF1cmFudCkpO1xuICAgIHZhciBidXR0b24gPSByZXN0YXVyYW50RWxlbS5xdWVyeVNlbGVjdG9yKCcucmV2aWV3cy1idXR0b24nKTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gTW9kYWwub3Blbk1vZGFsKHJlc3RhdXJhbnQpO1xuICAgIH0pO1xuXG4gICAgcmVzdGF1cmFudHNMaXN0LmFwcGVuZENoaWxkKHJlc3RhdXJhbnRFbGVtKTtcblxuICB9KTtcblxufVxuXG4vLy0tLS0tLS0tLS0gVGVtcGxhdGVzIC0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gcmVzdGF1cmFudFRtcGwocmVzdGF1cmFudCkge1xuXG4gIHJldHVybiBgPGFydGljbGUgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgIDxoMj5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cIiNtb3JlXCI+XG4gICAgICAgICAgICAgICAgJHtyZXN0YXVyYW50Lm5hbWV9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgJHtTdGFycy5zdGFyc1RtcGwoU3RhcnMuY2FsY3VsYXRlU3RhcnMocmVzdGF1cmFudC5yZXZpZXdzKSl9XG4gICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRodW1iXCI+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtyZXN0YXVyYW50LnBob3RvfVwiIGFsdD1cIiR7cmVzdGF1cmFudC5uYW1lfSBQaG90b2dyYXBoXCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2NhdGlvblwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Mb2NhdGlvbjo8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmEgZmEtbWFwLW1hcmtlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gXG4gICAgICAgICAgICAgIDxzcGFuPiR7cmVzdGF1cmFudC5hZGRyZXNzfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtYXBzXCIgaHJlZj1cIiR7bWFwc0xpbmsocmVzdGF1cmFudC5hZGRyZXNzKX1cIiB0YXJnZXQ9XCJfYmxhbmtcIj5PcGVuIGluIE1hcHM8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvcGVuaW5nXCI+XG4gICAgICAgICAgICAgIE9wZW5zOiAke29wZW5pbmdUbXBsKHJlc3RhdXJhbnQub3BlbmluZ0hvdXJzKX0gXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAke3Jlc3RhdXJhbnQuZGVzY3JpcHRpb259XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cInJldmlld3MtYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiMTIgcmV2aWV3cyAtIEFkZCB5b3VyIHJldmlld1wiLz5cbiAgICAgICAgICA8L2FydGljbGU+YDtcblxufVxuXG5mdW5jdGlvbiBvcGVuaW5nVG1wbChvcGVuaW5nSG91cnMpIHtcblxuICByZXR1cm4gb3BlbmluZ0hvdXJzLm1hcCh0aW1lVG1wbCkuam9pbignIHwgJyk7XG5cbn1cblxuZnVuY3Rpb24gdGltZVRtcGwodGltZSkge1xuXG4gIHJldHVybiBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj4ke3RpbWUub3Blbn0gLSAke3RpbWUuY2xvc2V9PC9zcGFuPmA7XG5cbn1cblxuZnVuY3Rpb24gbWFwc0xpbmsoYWRkcmVzcykge1xuXG4gIHJldHVybiBgaHR0cDovL21hcHMuZ29vZ2xlLmNvbS8/cT0ke2VuY29kZVVSSUNvbXBvbmVudChhZGRyZXNzKX1gO1xuXG59XG4iLCJpbXBvcnQgKiBhcyBBcHAgZnJvbSAnLi9hcHAuanMnO1xuXG4oZnVuY3Rpb24oKSB7XG5cbiAgZnVuY3Rpb24gcmVhZHkoKSB7XG4gICAgICBcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBcbiAgICAgIC8vIHJlc29sdmUgdGhlIHByb21pc2Ugd2hlbiB0aGUgZG9jdW1lbnQgaXMgcmVhZHlcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnKSB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gIH07XG5cbiAgcmVhZHkoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIEFwcC5pbml0KCk7XG5cbiAgICAvLyBhZGQgZmlsdGVyaW5nIGxpc3RlbmVyc1xuICAgIHZhciB0eXBlQnV0dG9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCd0eXBlJyk7XG4gICAgZm9yKHZhciBpPTA7IGkgPCB0eXBlQnV0dG9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdHlwZUJ1dHRvbnNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKXtcblxuICAgICAgICBBcHAuZmlsdGVyQnlUeXBlKHRoaXMudmFsdWUpO1xuXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgaW5wdXQgbGlzdGVuZXIgZm9yIHRoZSBzZWFyY2ggYm94LCB3ZSB3YW50IHRvIHVwZGF0ZVxuICAgIC8vIHRoZSBsaXN0IG9uIGVhY2gga2V5c3Ryb2tlICh0aGUgbGlzdCBpcyBhbHJlYWR5IGNvbXBsZXRlbHkgXG4gICAgLy8gbG9hZGVkIHNvIHRoaXMgZG9lc24ndCBtYWtlIG1vcmUgcmVxdWVzdHMpXG4gICAgdmFyIG5hbWVGaWx0ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoYm94Jyk7XG4gICAgbmFtZUZpbHRlci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICBBcHAuZmlsdGVyQnlOYW1lKHRoaXMudmFsdWUpO1xuXG4gICAgfSk7XG5cbiAgfSk7XG5cbn0pKCk7IiwiaW1wb3J0ICogYXMgVXRpbCBmcm9tICcuL3V0aWwuanMnO1xuaW1wb3J0ICogYXMgU3RhcnMgZnJvbSAnLi9zdGFycy5qcyc7XG5cbmNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nID0gJ2FbaHJlZl0sIFtyb2xlPVwic2xpZGVyXCJdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSc7XG5cbnZhciB3cmFwcGVyLCBtb2RhbCwgb3ZlcmxheSwgc3VibWl0QnV0dG9uLCBjbG9zZUJ1dHRvbiwgZm9jdXNlZEVsZW1lbnRCZWZvcmVNb2RhbDtcblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5Nb2RhbChyZXN0YXVyYW50KSB7XG5cbiAgd3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyJyk7XG4gIG1vZGFsID0gVXRpbC5odG1sVG9FbGVtZW50KG1vZGFsVG1wbChyZXN0YXVyYW50KSk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobW9kYWwpO1xuICBcbiAgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdmVybGF5Jyk7XG4gIGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlLW1vZGFsJyk7XG4gIHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGQtcmV2aWV3Jyk7XG4gIHZhciBzdGFyc1JhdGluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFycy1yYXRpbmcnKTtcblxuICBmb2N1c2VkRWxlbWVudEJlZm9yZU1vZGFsID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblxuICAvLyBzaG93cyB0aGUgbW9kYWwgYW5kIGhpZGVzIHRoZSByZXN0IG9mIHRoZSBjb250ZW50IGZvclxuICAvLyBzY3JlZW4gcmVhZGVyc1xuICBtb2RhbC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCl7XG4gICAgbW9kYWwuY2xhc3NOYW1lID0gJ3Nob3cnO1xuICB9KTtcbiAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU1vZGFsKTtcbiAgb3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTW9kYWwpO1xuICBzdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdWJtaXRSZXZpZXcocmVzdGF1cmFudCkpO1xuICBzdGFyc1JhdGluZy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgU3RhcnMuc3RhcnNSYXRpbmdLZXlkb3duSGFuZGxlcik7XG4gIHN0YXJzUmF0aW5nLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlldy1uYW1lJykuZm9jdXMoKTtcbiAgfSk7XG4gIGZvcih2YXIgaT0wOyBpIDwgc3RhcnNSYXRpbmcuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBzdGFyc1JhdGluZy5jaGlsZHJlbltpXS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBTdGFycy5zdGFyc1JhdGluZ0hvdmVySGFuZGxlcik7XG4gIH0gXG5cbiAgLy8gQWRkIGtleWJvYXJkIGxpc3RlbmVyIHRvIGNyZWF0ZSB0aGUgZm9jdXMtdHJhcFxuICB2YXIge2ZpcnN0RWxlbWVudCwgbGFzdEVsZW1lbnR9ID0gZmluZEZvY3VzTGltaXRFbGVtZW50cyhtb2RhbCk7XG4gIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmb2N1c1RyYXBDb250cm9sbGVyKGZpcnN0RWxlbWVudCwgbGFzdEVsZW1lbnQpKTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcblxuICB3cmFwcGVyLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgbW9kYWwuY2xhc3NOYW1lID0gJyc7XG4gIFxuICB2YXIgdHJhbnNpdGlvbkV2ZW50ID0gVXRpbC53aGljaFRyYW5zaXRpb25FdmVudCgpO1xuICB0cmFuc2l0aW9uRXZlbnQgJiYgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcih0cmFuc2l0aW9uRXZlbnQsIHJlbW92ZU1vZGFsKTtcblxufVxuXG5mdW5jdGlvbiBzdWJtaXRSZXZpZXcocmVzdGF1cmFudCkge1xuXG4gIHJldHVybiBmdW5jdGlvbigpe1xuXG4gICAgdmFyIG5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3LW5hbWUnKTtcbiAgICB2YXIgY29tbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb21tZW50Jyk7XG4gICAgdmFyIHN0YXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJzLXJhdGluZycpO1xuICAgIHZhciByZXZpZXcgPSB7XG4gICAgICBuYW1lOiBuYW1lLnZhbHVlLFxuICAgICAgY29tbWVudDogY29tbWVudC52YWx1ZSxcbiAgICAgIHN0YXJzOiBzdGFycy5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnKSxcbiAgICAgIGNyZWF0ZWRfYXQ6IERhdGUubm93KClcbiAgICB9O1xuXG4gICAgcmVzdGF1cmFudC5yZXZpZXdzLnB1c2gocmV2aWV3KTtcbiAgICByZW1vdmVNb2RhbCgpO1xuICAgIG9wZW5Nb2RhbChyZXN0YXVyYW50KTtcblxuICB9OyAgXG5cbn1cblxuZnVuY3Rpb24gcmVtb3ZlTW9kYWwoKSB7XG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobW9kYWwpO1xufVxuXG5mdW5jdGlvbiBmaW5kRm9jdXNMaW1pdEVsZW1lbnRzKG1vZGFsKSB7XG5cbiAgLy8gRmluZCBhbGwgZm9jdXNhYmxlIGNoaWxkcmVuXG4gIHZhciBmb2N1c2FibGVFbGVtZW50cyA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcpO1xuICBcbiAgcmV0dXJuIHtcbiAgICBmaXJzdEVsZW1lbnQ6IGZvY3VzYWJsZUVsZW1lbnRzWzBdLFxuICAgIGxhc3RFbGVtZW50OiBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxXVxuICB9O1xuXG59XG5cbmZ1bmN0aW9uIGZvY3VzVHJhcENvbnRyb2xsZXIoZmlyc3RFbGVtZW50LCBsYXN0RWxlbWVudCkge1xuXG4gIGZpcnN0RWxlbWVudC5mb2N1cygpO1xuXG4gIHJldHVybiBmdW5jdGlvbihldnQpIHtcbiAgICAvLyBDaGVjayBmb3IgVEFCIGtleSBwcmVzc1xuICAgIGlmIChldnQua2V5Q29kZSA9PT0gOSkge1xuXG4gICAgICAvLyBTSElGVCArIFRBQlxuICAgICAgaWYgKGV2dC5zaGlmdEtleSkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RFbGVtZW50KSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgbGFzdEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAvLyBUQUJcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0RWxlbWVudCkge1xuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGZpcnN0RWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRVNDQVBFXG4gICAgaWYgKGV2dC5rZXlDb2RlID09PSAyNykge1xuICAgICAgY2xvc2VNb2RhbCgpO1xuICAgIH1cbiAgfTtcblxufVxuXG5mdW5jdGlvbiBtb2RhbFRtcGwocmVzdGF1cmFudCkge1xuICByZXR1cm4gYDxkaXYgaWQ9XCJtb2RhbFwiIHJvbGU9XCJkaWFsb2dcIiBhcmlhLWxhYmVsbGVkYnk9XCJtb2RhbC10aXRsZVwiIGhpZGRlbj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJvdmVybGF5XCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiZGlhbG9nXCI+XG4gICAgICAgICAgICAgIDxoZWFkZXI+XG4gICAgICAgICAgICAgICAgPGgzIGlkPVwibW9kYWwtdGl0bGVcIj4ke3Jlc3RhdXJhbnQubmFtZX08L2gzPlxuICAgICAgICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAke3Jldmlld3NUbXBsKHJlc3RhdXJhbnQucmV2aWV3cyl9XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5ldy1yZXZpZXdcIj5cbiAgICAgICAgICAgICAgICAgIDxmb3JtIGFyaWEtbGFiZWxsZWRieT1cImZvcm0tdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgzIGlkPVwiZm9ybS10aXRsZVwiPkFkZCB5b3VyIHJldmlldzwvaDM+XG4gICAgICAgICAgICAgICAgICAgICR7U3RhcnMuc3RhcnNSYXRpbmcoKX1cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwicmV2aWV3LW5hbWVcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVwibmFtZVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJZb3VyIG5hbWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIllvdXIgbmFtZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRvY29tcGxldGU9XCJuYW1lXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cImNvbW1lbnRcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJjb21tZW50XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJDb21tZW50XCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlRlbGwgc29tZXRoaW5nIGFib3V0IHlvdXIgZXhwZXJpZW5jZSBpbiB0aGlzIHJlc3RhdXJhbnQuXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxmb290ZXI+XG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiYWRkLXJldmlld1wiIHR5cGU9XCJidXR0b25cIiBuYW1lPVwiYWRkUmV2aWV3XCIgdmFsdWU9XCJTdWJtaXRcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjbG9zZS1tb2RhbFwiIHR5cGU9XCJidXR0b25cIiBuYW1lPVwiY2xvc2VNb2RhbFwiIHZhbHVlPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPC9mb290ZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5gO1xufVxuXG5mdW5jdGlvbiByZXZpZXdzVG1wbChyZXZpZXdzKSB7XG5cbiAgcmV0dXJuIHJldmlld3MubWFwKHJldmlld1RtcGwpLmpvaW4oJycpO1xuXG59XG5cbmZ1bmN0aW9uIHJldmlld1RtcGwocmV2aWV3KSB7XG4gIHJldHVybiBgPGRpdiBjbGFzcz1cInJldmlld1wiPlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJhdXRob3JcIj5cbiAgICAgICAgICAgICAgJHtTdGFycy5zdGFyc1RtcGwocmV2aWV3LnN0YXJzKX1cbiAgICAgICAgICAgICAgPHNwYW4+YnkgJHtyZXZpZXcubmFtZX0gb24gJHtyZXZpZXcuY3JlYXRlZF9hdH08L3NwYW4+ICAgICAgICAgICAgICBcbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwiY29tbWVudFwiPlxuICAgICAgICAgICAgICAke3Jldmlldy5jb21tZW50fVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PmA7XG59IiwiLypcbiAgQ2FsY3VsYXRlIHRoZSBhdmVyYWdlIGZyb20gYWxsIHN0YXJzIGluIHRoZSByZXZpZXdzXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZVN0YXJzKHJldmlld3MpIHtcblxuICB2YXIgc3RhcnMgPSByZXZpZXdzLm1hcCgocmV2aWV3KSA9PiByZXZpZXcuc3RhcnMpO1xuICByZXR1cm4gYXZnKHN0YXJzKSA7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJzVG1wbChudW1iZXIpIHtcblxuICByZXR1cm4gYDxkaXYgY2xhc3M9XCJzdGFyc1wiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+JHtudW1iZXJ9IHN0YXJzPC9zcGFuPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoMSwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSgyLCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDMsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoNCwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSg1LCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICA8L2Rpdj5gO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFyc1JhdGluZygpIHtcblxuICByZXR1cm4gYDxsYWJlbCBjbGFzcz1cInNyLW9ubHlcIiBmb3I9XCJzdGFycy1yYXRpbmdcIj5cbiAgICAgICAgICAgIFBsZWFzZSBzZWxlY3QgYSBudW1iZXIgb2Ygc3RhcnNcbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxkaXYgaWQ9XCJzdGFycy1yYXRpbmdcIiBcbiAgICAgICAgICAgICAgIHJvbGU9XCJzbGlkZXJcIlxuICAgICAgICAgICAgICAgdGFiaW5kZXg9XCIwXCIgXG4gICAgICAgICAgICAgICBhcmlhLXZhbHVlbWluPVwiMFwiXG4gICAgICAgICAgICAgICBhcmlhLXZhbHVlbWF4PVwiNVwiXG4gICAgICAgICAgICAgICBhcmlhLXZhbHVlbm93PVwiMFwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyIGVtcHR5XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyIGVtcHR5XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyIGVtcHR5XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyIGVtcHR5XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyIGVtcHR5XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgIDwvZGl2PmA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFyc1JhdGluZ0tleWRvd25IYW5kbGVyKGV2dCkge1xuXG4gIHZhciBlbGVtID0gZXZ0LnRhcmdldDtcbiAgc3dpdGNoKGV2dC5rZXlDb2RlKSB7XG5cbiAgICAvLyBBcnJvdyBMRUZUL0RPV05cbiAgICBjYXNlIDM3OlxuICAgIGNhc2UgNDA6XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciB2YWx1ZSA9IChwYXJzZUludChlbGVtLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycpKS0xKTsgLy8gMC01IHZhbHVlc1xuICAgICAgaWYodmFsdWUgPCAwKSB7XG4gICAgICAgIHZhbHVlID0gNTtcbiAgICAgIH0gXG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIHZhbHVlKTtcbiAgICAgIGZpbGxTdGFycyhlbGVtKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgLy8gQXJyb3cgUklHSFQvVVBcbiAgICBjYXNlIDM4OlxuICAgIGNhc2UgMzk6XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciB2YWx1ZSA9IChwYXJzZUludChlbGVtLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycpKSsxKSU2OyBcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgdmFsdWUpO1xuICAgICAgZmlsbFN0YXJzKGVsZW0pO1xuICAgICAgYnJlYWs7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFyc1JhdGluZ0hvdmVySGFuZGxlcihldnQpIHtcblxuICB2YXIgZWxlbSA9IGV2dC50YXJnZXQucGFyZW50RWxlbWVudDtcbiAgdmFyIGkgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGVsZW0uY2hpbGRyZW4sIGV2dC50YXJnZXQpO1xuICBlbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIGkrMSk7XG4gIGZpbGxTdGFycyhlbGVtKTtcbn1cblxuZnVuY3Rpb24gZmlsbFN0YXJzKGVsZW0pIHtcbiAgdmFyIHZhbHVlID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnKTtcbiAgZm9yKHZhciBpPTA7IGkgPCBlbGVtLmNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgZWxlbS5jaGlsZHJlbltpXS5jbGFzc05hbWUgPSAnZmEgZmEtc3RhciAnICsgc3RhclR5cGUoaSsxLCB2YWx1ZSk7XG4gIH1cbn1cblxuLypcbiAgQXZlcmFnZSBvZiBhbiBhcnJheSBvZiBudW1iZXJzXG4qL1xuZnVuY3Rpb24gYXZnKGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5yZWR1Y2UoKHByZXYsIGN1cikgPT4gcHJldiArIGN1ciwgMCkvYXJyYXkubGVuZ3RoO1xufVxuXG4vKlxuICBDYWxjdWxhdGUgaG93IGZ1bGwgaXMgdGhlIGN1cnJlbnQgc3RhclxuKi9cbmZ1bmN0aW9uIHN0YXJUeXBlKG9yZGVyLCBudW1iZXIpIHtcblxuICBpZihudW1iZXIgLSBvcmRlciA9PSAtMC41KSB7XG4gICAgcmV0dXJuICdoYWxmJztcbiAgfSBlbHNlIGlmKG51bWJlciAtIG9yZGVyID49IDApIHtcbiAgICByZXR1cm4gJ2Z1bGwnXG4gIH1cblxuICByZXR1cm4gJ2VtcHR5JztcblxufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gaHRtbFRvRWxlbWVudChodG1sKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sO1xuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQ7XG59XG5cbi8qXG4gIFNlbGVjdHMgdGhlIGJyb3dzZXIgdHJhbnNpdGlvbiBldmVudCwgZnJvbTpcbiAgaHR0cHM6Ly9kYXZpZHdhbHNoLm5hbWUvY3NzLWFuaW1hdGlvbi1jYWxsYmFja1xuKi9cbmV4cG9ydCBmdW5jdGlvbiB3aGljaFRyYW5zaXRpb25FdmVudCgpe1xuICAgIHZhciB0O1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zha2VlbGVtZW50Jyk7XG4gICAgdmFyIHRyYW5zaXRpb25zID0ge1xuICAgICAgJ3RyYW5zaXRpb24nOid0cmFuc2l0aW9uZW5kJyxcbiAgICAgICdPVHJhbnNpdGlvbic6J29UcmFuc2l0aW9uRW5kJyxcbiAgICAgICdNb3pUcmFuc2l0aW9uJzondHJhbnNpdGlvbmVuZCcsXG4gICAgICAnV2Via2l0VHJhbnNpdGlvbic6J3dlYmtpdFRyYW5zaXRpb25FbmQnXG4gICAgfVxuXG4gICAgZm9yKHQgaW4gdHJhbnNpdGlvbnMpe1xuICAgICAgICBpZiggZWwuc3R5bGVbdF0gIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25zW3RdO1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==
