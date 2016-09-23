
const focusableElementsString = 'a[href], [role="slider"], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

var wrapper, modal, overlay, closeButton, focusedElementBeforeModal;

export function openModal(restaurant) {

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
  var {firstElement, lastElement} = findFocusLimitElements(modal);
  modal.addEventListener('keydown', focusTrapController(firstElement, lastElement));

}

export function closeModal() {

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