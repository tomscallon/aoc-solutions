var forEachPermutation = function forEachPermutation( arr, fn ) {
  // If the array is empty or has one element, invoke the function with just the array
  if( arr.length < 1 ) {
    fn( arr );
    return;
  }

  // Otherwise, do permutation things. For each element in the array...
  arr.forEach(function( el, index ) {
    var copy;
    
    // ...create a copy of the array without that element
    ( copy = arr.slice( 0 ) ).splice( index, 1 );

    // ...and recursively run the permutation algorithm
    // For each permutation...
    forEachPermutation( copy, function( arr ) {
      // ...add the current element (el) to the front of the permutation
      arr.unshift( el );

      // ...and invoke the given function with that array
      fn( arr );
    });
  });
};

module.exports = forEachPermutation;