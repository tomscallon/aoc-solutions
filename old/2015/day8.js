var input = require("fs").readFileSync("day8-input.txt").toString();

var lengthenRe = /([\\"])/g;

var extendLen = function( str ) {
  console.log( str, "\n", str.replace( lengthenRe, "\\$1" ), "\n\n");
  return str.replace( lengthenRe, "\\$1" ).length + 2;
};

var codeLen = function( str ) {
  return str.length;
};

var memLen = function( str ) {
  return eval( str ).length;
};

var diffA = input.split("\n")
  .map(function( str ) {
    return codeLen( str ) - memLen( str );
  })
  .reduce(function( sum, curr ) {
    return sum + curr;
  }, 0);

var diffB = input.split("\n")
  .map(function( str ) {
    return extendLen( str ) - codeLen( str );
  })
  .reduce(function( sum, curr ) {
    return sum + curr;
  }, 0);

console.log( diffA, diffB );