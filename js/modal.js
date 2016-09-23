import * as Util from './util.js';
import * as Stars from './stars.js';

const focusableElementsString = 'a[href], [role="slider"], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

var wrapper, modal, overlay, closeButton, focusedElementBeforeModal;

export function openModal(restaurant) {

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
  var {firstElement, lastElement} = findFocusLimitElements(modal);
  modal.addEventListener('keydown', focusTrapController(firstElement, lastElement));

}

export function closeModal() {

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

  return function(evt) {
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
  return `<div id="modal" role="dialog" aria-labelledby="modal-title" hidden>
            <div id="overlay"></div>
            <div class="dialog">
              <header>
                <h3 id="modal-title">${restaurant.name}</h3>
              </header>
              <div class="content">
                ${reviewsTmpl(restaurant.reviews)}
                <div class="new-review">
                  <form aria-labelledby="form-title">
                    <h3 id="form-title">Add your review</h3>
                    <label class="sr-only" for="stars-rating">
                      Please select a number of stars
                    </label>
                    <div id="stars-rating" 
                         role="slider"
                         tabindex="0" 
                         aria-valuemin="0"
                         aria-valuemax="5"
                         aria-valuenow="0">
                      <i class="fa fa-star empty" aria-hidden="true"></i>
                      <i class="fa fa-star empty" aria-hidden="true"></i>
                      <i class="fa fa-star empty" aria-hidden="true"></i>
                      <i class="fa fa-star empty" aria-hidden="true"></i>
                      <i class="fa fa-star empty" aria-hidden="true"></i>
                    </div>
                    <input id="review-name" 
                           type="text" 
                           name="name" 
                           placeholder="Your name"
                           aria-label="Your name"
                           autocomplete="name">
                    <textarea id="comment" 
                              name="comment"
                              aria-label="Comment" 
                              placeholder="Tell something about your experience in this restaurant.">
                    </textarea>
                  </form>
                </div>
              </div>
              <footer>
                <input id="close-modal" type="button" name="closeModal" value="Close">
              </footer>
            </div>
          </div>`;
}

function reviewsTmpl(reviews) {

  return reviews.map(reviewTmpl).join();

}

function reviewTmpl(review) {
  return `<div class="review">
            <p class="author">
              ${Stars.starsTmpl(review.stars)}
              <span>by ${review.name} on ${review.created_at}</span>              
            </p>
            <p class="comment">
              ${review.comment}
            </p>
          </div>`;
}