import * as App from './app.js';

(function() {

  function ready() {
      
    return new Promise(function(resolve, reject) {
      
      // resolve the promise when the document is ready
      document.addEventListener('readystatechange', function() {
        if(document.readyState !== 'loading') {
          resolve();
        }
      });

    });

  };

  ready().then(function() {
    App.init();

    // add filtering listeners
    var typeButtons = document.getElementsByClassName('type-button');
    for(var i=0; i < typeButtons.length; i++) {
      typeButtons[i].addEventListener('click', App.filterByTypeHandler);
    }

  });

})();