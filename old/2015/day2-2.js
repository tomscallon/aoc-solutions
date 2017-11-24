var input = require("fs").readFileSync("day2-input.txt").toString();

function lengthNeeded( l, w, h ) {
  var dims = [ +l, +w, +h ].sort(function( a, b ) {
    return a > b;
  });

  return l * w * h + 2 * dims[ 0 ] + 2 * dims[ 1 ];
}

var totalLength = input
  .split("\n")
  .map(function( line ) {
    return line.split("x");
  })
  .map(function( sizes ) {
    return lengthNeeded.apply( null, sizes );
  })
  .reduce(function( sum, area ) {
    return sum + area;
  }, 0);

console.log( totalLength );