var input = require("fs").readFileSync("day13-input.txt").toString();

var forEachPermutation = require("./util/forEachPermutation.js");

//ie, "Alice would lose 57 happiness units by sitting next to Bob."
var inputRe = /([A-Za-z]+) would (gain|lose) (\d+) happiness units by sitting next to ([A-Za-z]+)\./;

// happiness["Alice"]["Bob"] = change in Alice's happiness by sitting next to Bob
var happiness = {};

var addHappiness = function( hapData ) {
  var hapMap = happiness[ hapData.receiver ] || ( happiness[ hapData.receiver ] = {} );

  hapMap[ hapData.giver ] = hapData.amount;
}

var parseLine = function( line ) {
  var result = inputRe.exec( line );
  
  return {
    receiver: result[1],
    giver:    result[4],
    amount:   result[2] === "gain" ? +result[3] : -result[3]
  };
};

var happinessPair = function( a, b ) {
  return happiness[ a ][ b ] + happiness[ b ][ a ];
};

var computeHappiness = function( seating ) {
  var l = seating.length,
      h = happinessPair( seating[ 0 ], seating[ l - 1 ] );

  for( var i = 0; i < l - 1; i++ ) {
    h += happinessPair( seating[ i ], seating[ i + 1 ] );
  }

  return h;
};

// Read in the input
input.split("\n")
  .map( parseLine )
  .forEach( addHappiness );

// PART 2 ONLY
// Add myself to the happiness map
var me = happiness["me"] = {};
for( var name in happiness ) {
  me[ name ] = happiness[ name ].me = 0;
}

// END PART 2 ONLY

// For each permutation of arrangements, compute the total happiness
var max = 0;
var arr = null;

forEachPermutation( Object.keys( happiness ), function( seating ) {
  var hap = computeHappiness( seating );

  if( hap > max ) {
    max = hap;
    arr = seating;
  }
});

console.log( max, arr );