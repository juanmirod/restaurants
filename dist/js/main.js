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

  return '<article class="row" aria-label="' + restaurant.name + ' ' + Stars.calculateStars(restaurant.reviews) + ' stars">\n            <h2>\n              ' + restaurant.name + '\n              ' + Stars.starsTmpl(Stars.calculateStars(restaurant.reviews)) + '\n            </h2>\n            <div class="thumb">\n              <img src="' + restaurant.photo + '" alt="' + restaurant.name + ' Photograph">\n            </div>\n            <div class="location">\n              <span class="sr-only">Location:</span>\n              <span class="fa fa-map-marker" aria-hidden="true"></span> \n              <span>' + restaurant.address + '</span>\n              <a class="maps" href="' + mapsLink(restaurant.address) + '" target="_blank">Open in Maps</a>\n            </div>\n            <div class="opening">\n              Opens: ' + openingTmpl(restaurant.openingHours) + ' \n            </div>\n            <div class="description">\n              ' + restaurant.description + '\n            </div>\n            <input class="reviews-button" type="button" value="' + restaurant.reviews.length + ' reviews - Add your review"/>\n          </article>';
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

  return '<div id="stars-rating" \n               role="slider"\n               tabindex="0"\n               aria-label="Please select a number of stars" \n               aria-live="polite"\n               aria-valuemin="0"\n               aria-valuemax="5"\n               aria-valuenow="0"\n               aria-valuetext="zero">\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n          </div>';
}

function starsRatingKeydownHandler(evt) {

  var valueTexts = ['zero stars', 'one star', 'two stars', 'three stars', 'four stars', 'five stars'];
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
      elem.setAttribute('aria-valuetext', valueTexts[value]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9tYWluLmpzIiwianMvbW9kYWwuanMiLCJqcy9zdGFycy5qcyIsImpzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ2FnQixJLEdBQUEsSTtRQVlBLFksR0FBQSxZO1FBT0EsWSxHQUFBLFk7UUFPQSxpQixHQUFBLGlCOztBQXZDaEI7O0lBQVksSzs7QUFDWjs7SUFBWSxJOztBQUNaOztJQUFZLEs7Ozs7QUFFWjtBQUNBLElBQUksV0FBSjtBQUFBLElBQ0EsZUFBZSxFQURmO0FBQUEsSUFFQSxlQUFlLEVBRmY7O0FBSUE7Ozs7QUFJTyxTQUFTLElBQVQsR0FBZ0I7O0FBRXJCLFFBQU0sdUJBQU4sRUFDRyxJQURILENBQ1E7QUFBQSxXQUFZLFNBQVMsSUFBVCxFQUFaO0FBQUEsR0FEUixFQUVHLElBRkgsQ0FFUSxnQkFGUixFQUdHLElBSEgsQ0FHUSxlQUhSLEVBSUcsS0FKSCxDQUlTLFVBQVMsS0FBVCxFQUFnQjtBQUNyQixZQUFRLEtBQVIsQ0FBYyxpQ0FBZCxFQUFpRCxLQUFqRDtBQUNELEdBTkg7QUFRRDs7QUFFTSxTQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEI7O0FBRWpDLGlCQUFlLElBQWY7QUFDQSxrQkFBZ0IsbUJBQWhCO0FBRUQ7O0FBRU0sU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCOztBQUVqQyxpQkFBZSxJQUFmO0FBQ0Esa0JBQWdCLG1CQUFoQjtBQUVEOztBQUVNLFNBQVMsaUJBQVQsR0FBNkI7O0FBRWxDLFNBQU8sWUFBWSxNQUFaLENBQW1CLFVBQUMsVUFBRCxFQUFnQjs7QUFFeEMsUUFBSSx1QkFBdUIsSUFBM0I7QUFBQSxRQUNBLGlCQUFpQixJQURqQjs7QUFHQSxRQUFHLGdCQUFnQixFQUFuQixFQUF1Qjs7QUFFckIsNkJBQXVCLFdBQVcsSUFBWCxD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LCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIE1vZGFsIGZyb20gJy4vbW9kYWwuanMnO1xuaW1wb3J0ICogYXMgVXRpbCBmcm9tICcuL3V0aWwuanMnO1xuaW1wb3J0ICogYXMgU3RhcnMgZnJvbSAnLi9zdGFycy5qcyc7XG5cbi8vIG1vZHVsZSB2YXJpYWJsZXMsIHVzZWQgdG8gZmlsdGVyIHRoZSByZXN0YXVyYW50cyBieSBuYW1lIGFuZCB0eXBlXG52YXIgcmVzdGF1cmFudHMsIFxudHlwZVNlbGVjdGVkID0gJycsIFxuc2VhcmNoU3RyaW5nID0gJyc7XG5cbi8qIFxuICBJbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvbiBsb2FkaW5nIHRoZSByZXN0YXVyYW50cyBkYXRhIFxuICBhbmQgYWRkaW5nIHRoZSBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIGludGVyYWN0aXZlIGVsZW1lbnRzLlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuXG4gIGZldGNoKCdkYXRhL3Jlc3RhdXJhbnRzLmpzb24nKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAudGhlbihzdG9yZVJlc3RhdXJhbnRzKVxuICAgIC50aGVuKHNob3dSZXN0YXVyYW50cylcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBsb2FkIHRoZSByZXN0YXVyYW50cy4nLCBlcnJvcik7XG4gICAgfSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckJ5VHlwZSh0eXBlKSB7XG5cbiAgdHlwZVNlbGVjdGVkID0gdHlwZTtcbiAgc2hvd1Jlc3RhdXJhbnRzKGZpbHRlclJlc3RhdXJhbnRzKCkpO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJCeU5hbWUobmFtZSkge1xuICBcbiAgc2VhcmNoU3RyaW5nID0gbmFtZTtcbiAgc2hvd1Jlc3RhdXJhbnRzKGZpbHRlclJlc3RhdXJhbnRzKCkpO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJSZXN0YXVyYW50cygpIHtcblxuICByZXR1cm4gcmVzdGF1cmFudHMuZmlsdGVyKChyZXN0YXVyYW50KSA9PiB7XG4gICAgXG4gICAgdmFyIGNvbnRhaW5zU2VhcmNoU3RyaW5nID0gdHJ1ZSwgXG4gICAgaXNUeXBlU2VsZWN0ZWQgPSB0cnVlO1xuICAgIFxuICAgIGlmKHNlYXJjaFN0cmluZyAhPSAnJykge1xuICBcbiAgICAgIGNvbnRhaW5zU2VhcmNoU3RyaW5nID0gcmVzdGF1cmFudC5uYW1lLmluZGV4T2Yoc2VhcmNoU3RyaW5nKSAhPSAtMTtcbiAgXG4gICAgfSBcblxuICAgIGlmKHR5cGVTZWxlY3RlZCAhPSAnJyl7XG5cbiAgICAgIGlzVHlwZVNlbGVjdGVkID0gKHJlc3RhdXJhbnQudHlwZSA9PT0gdHlwZVNlbGVjdGVkKTtcblxuICAgIH0gXG5cbiAgICByZXR1cm4gY29udGFpbnNTZWFyY2hTdHJpbmcgJiYgaXNUeXBlU2VsZWN0ZWQ7XG4gICAgXG4gIH0pO1xuXG59XG5cbi8qIFxuICBTdG9yZXMgdGhlIHJlc3RhdXJhbnRzIGFycmF5IGluIGEgdmFyaWFibGUgZm9yIGZpbHRlcnMgXG4gIFRoZXkgY291bGQgYmUgc3RvcmVkIHRvIGxvY2Fsc3RvcmFnZSBvciBpbmRleGVkREJcbiAgYnV0IGZvciB0aGlzIGFwcCBpdCB3aWxsIGRvIHdpdGggYSBtb2R1bGUgdmFyaWFibGUuXG4qL1xuZnVuY3Rpb24gc3RvcmVSZXN0YXVyYW50cyhyZXMpIHtcbiAgcmVzdGF1cmFudHMgPSByZXM7XG4gIHJldHVybiByZXM7XG59XG5cbi8qXG4gIFJlbmRlciBhbGwgcmVzdGF1cmFudHMgdXNpbmcgdGhlIHJlc3RhdXJhbnQgdGVtcGxhdGVcbiovXG5mdW5jdGlvbiBzaG93UmVzdGF1cmFudHMocmVzdGF1cmFudHMpIHtcbiAgXG4gIHZhciByZXN0YXVyYW50c0xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudHMtbGlzdCcpO1xuICByZXN0YXVyYW50c0xpc3QuaW5uZXJIVE1MID0gJyc7XG4gIHJlc3RhdXJhbnRzLmZvckVhY2goKHJlc3RhdXJhbnQpID0+IHtcblxuICAgIHZhciByZXN0YXVyYW50RWxlbSA9IFV0aWwuaHRtbFRvRWxlbWVudChyZXN0YXVyYW50VG1wbChyZXN0YXVyYW50KSk7XG4gICAgdmFyIGJ1dHRvbiA9IHJlc3RhdXJhbnRFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzLWJ1dHRvbicpO1xuXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBNb2RhbC5vcGVuTW9kYWwocmVzdGF1cmFudCk7XG4gICAgfSk7XG5cbiAgICByZXN0YXVyYW50c0xpc3QuYXBwZW5kQ2hpbGQocmVzdGF1cmFudEVsZW0pO1xuXG4gIH0pO1xuXG59XG5cbi8vLS0tLS0tLS0tLSBUZW1wbGF0ZXMgLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiByZXN0YXVyYW50VG1wbChyZXN0YXVyYW50KSB7XG5cbiAgcmV0dXJuIGA8YXJ0aWNsZSBjbGFzcz1cInJvd1wiIGFyaWEtbGFiZWw9XCIke3Jlc3RhdXJhbnQubmFtZX0gJHtTdGFycy5jYWxjdWxhdGVTdGFycyhyZXN0YXVyYW50LnJldmlld3MpfSBzdGFyc1wiPlxuICAgICAgICAgICAgPGgyPlxuICAgICAgICAgICAgICAke3Jlc3RhdXJhbnQubmFtZX1cbiAgICAgICAgICAgICAgJHtTdGFycy5zdGFyc1RtcGwoU3RhcnMuY2FsY3VsYXRlU3RhcnMocmVzdGF1cmFudC5yZXZpZXdzKSl9XG4gICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRodW1iXCI+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtyZXN0YXVyYW50LnBob3RvfVwiIGFsdD1cIiR7cmVzdGF1cmFudC5uYW1lfSBQaG90b2dyYXBoXCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2NhdGlvblwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Mb2NhdGlvbjo8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmEgZmEtbWFwLW1hcmtlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gXG4gICAgICAgICAgICAgIDxzcGFuPiR7cmVzdGF1cmFudC5hZGRyZXNzfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtYXBzXCIgaHJlZj1cIiR7bWFwc0xpbmsocmVzdGF1cmFudC5hZGRyZXNzKX1cIiB0YXJnZXQ9XCJfYmxhbmtcIj5PcGVuIGluIE1hcHM8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvcGVuaW5nXCI+XG4gICAgICAgICAgICAgIE9wZW5zOiAke29wZW5pbmdUbXBsKHJlc3RhdXJhbnQub3BlbmluZ0hvdXJzKX0gXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAke3Jlc3RhdXJhbnQuZGVzY3JpcHRpb259XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cInJldmlld3MtYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiJHtyZXN0YXVyYW50LnJldmlld3MubGVuZ3RofSByZXZpZXdzIC0gQWRkIHlvdXIgcmV2aWV3XCIvPlxuICAgICAgICAgIDwvYXJ0aWNsZT5gO1xuXG59XG5cbmZ1bmN0aW9uIG9wZW5pbmdUbXBsKG9wZW5pbmdIb3Vycykge1xuXG4gIHJldHVybiBvcGVuaW5nSG91cnMubWFwKHRpbWVUbXBsKS5qb2luKCcgfCAnKTtcblxufVxuXG5mdW5jdGlvbiB0aW1lVG1wbCh0aW1lKSB7XG5cbiAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInRleHQtc3VjY2Vzc1wiPiR7dGltZS5vcGVufSAtICR7dGltZS5jbG9zZX08L3NwYW4+YDtcblxufVxuXG5mdW5jdGlvbiBtYXBzTGluayhhZGRyZXNzKSB7XG5cbiAgcmV0dXJuIGBodHRwOi8vbWFwcy5nb29nbGUuY29tLz9xPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGFkZHJlc3MpfWA7XG5cbn1cbiIsImltcG9ydCAqIGFzIEFwcCBmcm9tICcuL2FwcC5qcyc7XG5cbihmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiByZWFkeSgpIHtcbiAgICAgIFxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIFxuICAgICAgLy8gcmVzb2x2ZSB0aGUgcHJvbWlzZSB3aGVuIHRoZSBkb2N1bWVudCBpcyByZWFkeVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnbG9hZGluZycpIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfTtcblxuICByZWFkeSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgQXBwLmluaXQoKTtcblxuICAgIC8vIGFkZCBmaWx0ZXJpbmcgbGlzdGVuZXJzXG4gICAgdmFyIHR5cGVCdXR0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3R5cGUnKTtcbiAgICBmb3IodmFyIGk9MDsgaSA8IHR5cGVCdXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0eXBlQnV0dG9uc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuXG4gICAgICAgIEFwcC5maWx0ZXJCeVR5cGUodGhpcy52YWx1ZSk7XG5cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCBpbnB1dCBsaXN0ZW5lciBmb3IgdGhlIHNlYXJjaCBib3gsIHdlIHdhbnQgdG8gdXBkYXRlXG4gICAgLy8gdGhlIGxpc3Qgb24gZWFjaCBrZXlzdHJva2UgKHRoZSBsaXN0IGlzIGFscmVhZHkgY29tcGxldGVseSBcbiAgICAvLyBsb2FkZWQgc28gdGhpcyBkb2Vzbid0IG1ha2UgbW9yZSByZXF1ZXN0cylcbiAgICB2YXIgbmFtZUZpbHRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2hib3gnKTtcbiAgICBuYW1lRmlsdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIEFwcC5maWx0ZXJCeU5hbWUodGhpcy52YWx1ZSk7XG5cbiAgICB9KTtcblxuICB9KTtcblxufSkoKTsiLCJpbXBvcnQgKiBhcyBVdGlsIGZyb20gJy4vdXRpbC5qcyc7XG5pbXBvcnQgKiBhcyBTdGFycyBmcm9tICcuL3N0YXJzLmpzJztcblxuY29uc3QgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnYVtocmVmXSwgW3JvbGU9XCJzbGlkZXJcIl0sIGFyZWFbaHJlZl0sIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCBpZnJhbWUsIG9iamVjdCwgZW1iZWQsIFt0YWJpbmRleD1cIjBcIl0sIFtjb250ZW50ZWRpdGFibGVdJztcblxudmFyIHdyYXBwZXIsIG1vZGFsLCBvdmVybGF5LCBzdWJtaXRCdXR0b24sIGNsb3NlQnV0dG9uLCBmb2N1c2VkRWxlbWVudEJlZm9yZU1vZGFsO1xuXG5leHBvcnQgZnVuY3Rpb24gb3Blbk1vZGFsKHJlc3RhdXJhbnQpIHtcblxuICB3cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyYXBwZXInKTtcbiAgbW9kYWwgPSBVdGlsLmh0bWxUb0VsZW1lbnQobW9kYWxUbXBsKHJlc3RhdXJhbnQpKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbCk7XG4gIFxuICBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXknKTtcbiAgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2UtbW9kYWwnKTtcbiAgc3VibWl0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZC1yZXZpZXcnKTtcbiAgdmFyIHN0YXJzUmF0aW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJzLXJhdGluZycpO1xuXG4gIGZvY3VzZWRFbGVtZW50QmVmb3JlTW9kYWwgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gIC8vIHNob3dzIHRoZSBtb2RhbCBhbmQgaGlkZXMgdGhlIHJlc3Qgb2YgdGhlIGNvbnRlbnQgZm9yXG4gIC8vIHNjcmVlbiByZWFkZXJzXG4gIG1vZGFsLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXtcbiAgICBtb2RhbC5jbGFzc05hbWUgPSAnc2hvdyc7XG4gIH0pO1xuICB3cmFwcGVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblxuICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTW9kYWwpO1xuICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VNb2RhbCk7XG4gIHN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN1Ym1pdFJldmlldyhyZXN0YXVyYW50KSk7XG4gIHN0YXJzUmF0aW5nLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBTdGFycy5zdGFyc1JhdGluZ0tleWRvd25IYW5kbGVyKTtcbiAgc3RhcnNSYXRpbmcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3LW5hbWUnKS5mb2N1cygpO1xuICB9KTtcbiAgZm9yKHZhciBpPTA7IGkgPCBzdGFyc1JhdGluZy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIHN0YXJzUmF0aW5nLmNoaWxkcmVuW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIFN0YXJzLnN0YXJzUmF0aW5nSG92ZXJIYW5kbGVyKTtcbiAgfSBcblxuICAvLyBBZGQga2V5Ym9hcmQgbGlzdGVuZXIgdG8gY3JlYXRlIHRoZSBmb2N1cy10cmFwXG4gIHZhciB7Zmlyc3RFbGVtZW50LCBsYXN0RWxlbWVudH0gPSBmaW5kRm9jdXNMaW1pdEVsZW1lbnRzKG1vZGFsKTtcbiAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZvY3VzVHJhcENvbnRyb2xsZXIoZmlyc3RFbGVtZW50LCBsYXN0RWxlbWVudCkpO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuXG4gIHdyYXBwZXIucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICBtb2RhbC5jbGFzc05hbWUgPSAnJztcbiAgXG4gIHZhciB0cmFuc2l0aW9uRXZlbnQgPSBVdGlsLndoaWNoVHJhbnNpdGlvbkV2ZW50KCk7XG4gIHRyYW5zaXRpb25FdmVudCAmJiBtb2RhbC5hZGRFdmVudExpc3RlbmVyKHRyYW5zaXRpb25FdmVudCwgcmVtb3ZlTW9kYWwpO1xuXG59XG5cbmZ1bmN0aW9uIHN1Ym1pdFJldmlldyhyZXN0YXVyYW50KSB7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXctbmFtZScpO1xuICAgIHZhciBjb21tZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbW1lbnQnKTtcbiAgICB2YXIgc3RhcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnMtcmF0aW5nJyk7XG4gICAgdmFyIHJldmlldyA9IHtcbiAgICAgIG5hbWU6IG5hbWUudmFsdWUsXG4gICAgICBjb21tZW50OiBjb21tZW50LnZhbHVlLFxuICAgICAgc3RhcnM6IHN0YXJzLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycpLFxuICAgICAgY3JlYXRlZF9hdDogRGF0ZS5ub3coKVxuICAgIH07XG5cbiAgICByZXN0YXVyYW50LnJldmlld3MucHVzaChyZXZpZXcpO1xuICAgIHJlbW92ZU1vZGFsKCk7XG4gICAgb3Blbk1vZGFsKHJlc3RhdXJhbnQpO1xuXG4gIH07ICBcblxufVxuXG5mdW5jdGlvbiByZW1vdmVNb2RhbCgpIHtcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChtb2RhbCk7XG59XG5cbmZ1bmN0aW9uIGZpbmRGb2N1c0xpbWl0RWxlbWVudHMobW9kYWwpIHtcblxuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cbiAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XG4gIFxuICByZXR1cm4ge1xuICAgIGZpcnN0RWxlbWVudDogZm9jdXNhYmxlRWxlbWVudHNbMF0sXG4gICAgbGFzdEVsZW1lbnQ6IGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdXG4gIH07XG5cbn1cblxuZnVuY3Rpb24gZm9jdXNUcmFwQ29udHJvbGxlcihmaXJzdEVsZW1lbnQsIGxhc3RFbGVtZW50KSB7XG5cbiAgZmlyc3RFbGVtZW50LmZvY3VzKCk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGV2dCkge1xuICAgIC8vIENoZWNrIGZvciBUQUIga2V5IHByZXNzXG4gICAgaWYgKGV2dC5rZXlDb2RlID09PSA5KSB7XG5cbiAgICAgIC8vIFNISUZUICsgVEFCXG4gICAgICBpZiAoZXZ0LnNoaWZ0S2V5KSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdEVsZW1lbnQpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBsYXN0RWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgIC8vIFRBQlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3RFbGVtZW50KSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZmlyc3RFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFU0NBUEVcbiAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDI3KSB7XG4gICAgICBjbG9zZU1vZGFsKCk7XG4gICAgfVxuICB9O1xuXG59XG5cbmZ1bmN0aW9uIG1vZGFsVG1wbChyZXN0YXVyYW50KSB7XG4gIHJldHVybiBgPGRpdiBpZD1cIm1vZGFsXCIgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbGFiZWxsZWRieT1cIm1vZGFsLXRpdGxlXCIgaGlkZGVuPlxuICAgICAgICAgICAgPGRpdiBpZD1cIm92ZXJsYXlcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJkaWFsb2dcIj5cbiAgICAgICAgICAgICAgPGhlYWRlcj5cbiAgICAgICAgICAgICAgICA8aDMgaWQ9XCJtb2RhbC10aXRsZVwiPiR7cmVzdGF1cmFudC5uYW1lfTwvaDM+XG4gICAgICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxuICAgICAgICAgICAgICAgICR7cmV2aWV3c1RtcGwocmVzdGF1cmFudC5yZXZpZXdzKX1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmV3LXJldmlld1wiPlxuICAgICAgICAgICAgICAgICAgPGZvcm0gYXJpYS1sYWJlbGxlZGJ5PVwiZm9ybS10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aDMgaWQ9XCJmb3JtLXRpdGxlXCI+QWRkIHlvdXIgcmV2aWV3PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgJHtTdGFycy5zdGFyc1JhdGluZygpfVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJyZXZpZXctbmFtZVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJuYW1lXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIllvdXIgbmFtZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiWW91ciBuYW1lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9jb21wbGV0ZT1cIm5hbWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiY29tbWVudFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT1cImNvbW1lbnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkNvbW1lbnRcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVGVsbCBzb21ldGhpbmcgYWJvdXQgeW91ciBleHBlcmllbmNlIGluIHRoaXMgcmVzdGF1cmFudC5cIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGZvb3Rlcj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJhZGQtcmV2aWV3XCIgdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJhZGRSZXZpZXdcIiB2YWx1ZT1cIlN1Ym1pdFwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNsb3NlLW1vZGFsXCIgdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJjbG9zZU1vZGFsXCIgdmFsdWU9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8L2Zvb3Rlcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PmA7XG59XG5cbmZ1bmN0aW9uIHJldmlld3NUbXBsKHJldmlld3MpIHtcblxuICByZXR1cm4gcmV2aWV3cy5tYXAocmV2aWV3VG1wbCkuam9pbignJyk7XG5cbn1cblxuZnVuY3Rpb24gcmV2aWV3VG1wbChyZXZpZXcpIHtcbiAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwicmV2aWV3XCI+XG4gICAgICAgICAgICA8cCBjbGFzcz1cImF1dGhvclwiPlxuICAgICAgICAgICAgICAke1N0YXJzLnN0YXJzVG1wbChyZXZpZXcuc3RhcnMpfVxuICAgICAgICAgICAgICA8c3Bhbj5ieSAke3Jldmlldy5uYW1lfSBvbiAke3Jldmlldy5jcmVhdGVkX2F0fTwvc3Bhbj4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJjb21tZW50XCI+XG4gICAgICAgICAgICAgICR7cmV2aWV3LmNvbW1lbnR9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+YDtcbn0iLCIvKlxuICBDYWxjdWxhdGUgdGhlIGF2ZXJhZ2UgZnJvbSBhbGwgc3RhcnMgaW4gdGhlIHJldmlld3NcbiovXG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlU3RhcnMocmV2aWV3cykge1xuXG4gIHZhciBzdGFycyA9IHJldmlld3MubWFwKChyZXZpZXcpID0+IHJldmlldy5zdGFycyk7XG4gIHJldHVybiBhdmcoc3RhcnMpIDtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnNUbXBsKG51bWJlcikge1xuXG4gIHJldHVybiBgPGRpdiBjbGFzcz1cInN0YXJzXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj4ke251bWJlcn0gc3RhcnM8L3NwYW4+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSgxLCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDIsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoMywgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSg0LCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDUsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgIDwvZGl2PmA7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJzUmF0aW5nKCkge1xuXG4gIHJldHVybiBgPGRpdiBpZD1cInN0YXJzLXJhdGluZ1wiIFxuICAgICAgICAgICAgICAgcm9sZT1cInNsaWRlclwiXG4gICAgICAgICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlBsZWFzZSBzZWxlY3QgYSBudW1iZXIgb2Ygc3RhcnNcIiBcbiAgICAgICAgICAgICAgIGFyaWEtbGl2ZT1cInBvbGl0ZVwiXG4gICAgICAgICAgICAgICBhcmlhLXZhbHVlbWluPVwiMFwiXG4gICAgICAgICAgICAgICBhcmlhLXZhbHVlbWF4PVwiNVwiXG4gICAgICAgICAgICAgICBhcmlhLXZhbHVlbm93PVwiMFwiXG4gICAgICAgICAgICAgICBhcmlhLXZhbHVldGV4dD1cInplcm9cIj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBlbXB0eVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBlbXB0eVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBlbXB0eVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBlbXB0eVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciBlbXB0eVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICA8L2Rpdj5gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnNSYXRpbmdLZXlkb3duSGFuZGxlcihldnQpIHtcblxuICB2YXIgdmFsdWVUZXh0cyA9IFsnemVybyBzdGFycycsICdvbmUgc3RhcicsICd0d28gc3RhcnMnLCAndGhyZWUgc3RhcnMnLCAnZm91ciBzdGFycycsICdmaXZlIHN0YXJzJ107XG4gIHZhciBlbGVtID0gZXZ0LnRhcmdldDtcbiAgc3dpdGNoKGV2dC5rZXlDb2RlKSB7XG5cbiAgICAvLyBBcnJvdyBMRUZUL0RPV05cbiAgICBjYXNlIDM3OlxuICAgIGNhc2UgNDA6XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciB2YWx1ZSA9IChwYXJzZUludChlbGVtLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycpKS0xKTsgLy8gMC01IHZhbHVlc1xuICAgICAgaWYodmFsdWUgPCAwKSB7XG4gICAgICAgIHZhbHVlID0gNTtcbiAgICAgIH0gXG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIHZhbHVlKTtcbiAgICAgIGZpbGxTdGFycyhlbGVtKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgLy8gQXJyb3cgUklHSFQvVVBcbiAgICBjYXNlIDM4OlxuICAgIGNhc2UgMzk6XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciB2YWx1ZSA9IChwYXJzZUludChlbGVtLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycpKSsxKSU2OyBcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgdmFsdWUpO1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWV0ZXh0JywgdmFsdWVUZXh0c1t2YWx1ZV0pO1xuICAgICAgZmlsbFN0YXJzKGVsZW0pO1xuICAgICAgYnJlYWs7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFyc1JhdGluZ0hvdmVySGFuZGxlcihldnQpIHtcblxuICB2YXIgZWxlbSA9IGV2dC50YXJnZXQucGFyZW50RWxlbWVudDtcbiAgdmFyIGkgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGVsZW0uY2hpbGRyZW4sIGV2dC50YXJnZXQpO1xuICBlbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIGkrMSk7XG4gIGZpbGxTdGFycyhlbGVtKTtcbn1cblxuZnVuY3Rpb24gZmlsbFN0YXJzKGVsZW0pIHtcbiAgdmFyIHZhbHVlID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnKTtcbiAgZm9yKHZhciBpPTA7IGkgPCBlbGVtLmNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgZWxlbS5jaGlsZHJlbltpXS5jbGFzc05hbWUgPSAnZmEgZmEtc3RhciAnICsgc3RhclR5cGUoaSsxLCB2YWx1ZSk7XG4gIH1cbn1cblxuLypcbiAgQXZlcmFnZSBvZiBhbiBhcnJheSBvZiBudW1iZXJzXG4qL1xuZnVuY3Rpb24gYXZnKGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5yZWR1Y2UoKHByZXYsIGN1cikgPT4gcHJldiArIGN1ciwgMCkvYXJyYXkubGVuZ3RoO1xufVxuXG4vKlxuICBDYWxjdWxhdGUgaG93IGZ1bGwgaXMgdGhlIGN1cnJlbnQgc3RhclxuKi9cbmZ1bmN0aW9uIHN0YXJUeXBlKG9yZGVyLCBudW1iZXIpIHtcblxuICBpZihudW1iZXIgLSBvcmRlciA9PSAtMC41KSB7XG4gICAgcmV0dXJuICdoYWxmJztcbiAgfSBlbHNlIGlmKG51bWJlciAtIG9yZGVyID49IDApIHtcbiAgICByZXR1cm4gJ2Z1bGwnXG4gIH1cblxuICByZXR1cm4gJ2VtcHR5JztcblxufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gaHRtbFRvRWxlbWVudChodG1sKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sO1xuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQ7XG59XG5cbi8qXG4gIFNlbGVjdHMgdGhlIGJyb3dzZXIgdHJhbnNpdGlvbiBldmVudCwgZnJvbTpcbiAgaHR0cHM6Ly9kYXZpZHdhbHNoLm5hbWUvY3NzLWFuaW1hdGlvbi1jYWxsYmFja1xuKi9cbmV4cG9ydCBmdW5jdGlvbiB3aGljaFRyYW5zaXRpb25FdmVudCgpe1xuICAgIHZhciB0O1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zha2VlbGVtZW50Jyk7XG4gICAgdmFyIHRyYW5zaXRpb25zID0ge1xuICAgICAgJ3RyYW5zaXRpb24nOid0cmFuc2l0aW9uZW5kJyxcbiAgICAgICdPVHJhbnNpdGlvbic6J29UcmFuc2l0aW9uRW5kJyxcbiAgICAgICdNb3pUcmFuc2l0aW9uJzondHJhbnNpdGlvbmVuZCcsXG4gICAgICAnV2Via2l0VHJhbnNpdGlvbic6J3dlYmtpdFRyYW5zaXRpb25FbmQnXG4gICAgfVxuXG4gICAgZm9yKHQgaW4gdHJhbnNpdGlvbnMpe1xuICAgICAgICBpZiggZWwuc3R5bGVbdF0gIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25zW3RdO1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==
