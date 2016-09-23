/*
  Calculate the average from all stars in the reviews
*/
export function calculateStars(reviews) {

  var stars = reviews.map((review) => review.stars);
  return avg(stars) ;

}

export function starsTmpl(number) {

  return `<div class="stars">
            <span class="sr-only">${number} stars</span>
            <i class="fa fa-star ${starType(1, number)}" aria-hidden="true"></i>
            <i class="fa fa-star ${starType(2, number)}" aria-hidden="true"></i>
            <i class="fa fa-star ${starType(3, number)}" aria-hidden="true"></i>
            <i class="fa fa-star ${starType(4, number)}" aria-hidden="true"></i>
            <i class="fa fa-star ${starType(5, number)}" aria-hidden="true"></i>
          </div>`;

}

/*
  Average of an array of numbers
*/
function avg(array) {
  return array.reduce((prev, cur) => prev + cur, 0)/array.length;
}

/*
  Calculate how full is the current star
*/
function starType(order, number) {

  if(number - order == -0.5) {
    return 'half';
  } else if(number - order >= 0) {
    return 'full'
  }

  return 'empty';

}
