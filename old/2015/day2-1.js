var input = require("fs").readFileSync("day2-input.txt").toString();

function squareFeetNeeded( l, w, h ) {
  var sides = [ l * w, l * h, w * h ].sort(function( a, b ) {
    return a > b;
  });

  return sides.reduce(function( sum, side ) {
    return sum + 2 * side;
  }, sides[ 0 ] );
}

var totalArea = input
  .split("\n")
  .map(function( line ) {
    return line.split("x");
  })
  .map(function( sizes ) {
    return squareFeetNeeded.apply( null, sizes );
  })
  .reduce(function( sum, area ) {
    return sum + area;
  }, 0);

console.log( totalArea );