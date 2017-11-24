// sum:    non-negative integer
// numEls: positive integer
// fn:     some function accepting an array argument
var forEachSummation = function( sum, numEls, fn ) {
  if( numEls === 1 ) {
    // If just one element is request, just invoke the callback
    // with an array containing the sum as its only element
    fn([ sum ]);
  } else {
    // Otherwise, iterate over the first element
    var first = 0,
        left  = sum,
        numElsMinusOne = numEls - 1;
    
    // For each possible leading value...
    while( left >= 0 ) {
      // ...iterate over possible values for the rest of the array.
      // For each possible array arrangment...
      forEachSummation( left, numElsMinusOne, function( arr ) {
        // Add the leading element to the array...
        arr.unshift( first );

        // ...and invoke the given function on that array
        fn( arr );
      });
      
      // Increment the first element, and decrement the leftovers
      first++;
      left--;
    }
  }
};

module.exports = forEachSummation;