var input = require("fs").readFileSync("day15-input.txt").toString();

var forEachSummation = require("./util/forEachSummation");

// ie, "Sprinkles: capacity 2, durability 0, flavor -2, texture 0, calories 3"
var inputRe = /([A-Z][a-z]+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)/;

var PROPERTIES = ["capacity", "durability", "flavor", "texture"/*, "calories"*/];

var parseLine = function( line ) {
  var result = inputRe.exec( line );

  return {
    name:       result[1],
    capacity:   result[2],
    durability: result[3],
    flavor:     result[4],
    texture:    result[5],
    calories:   result[6]
  };
}

var ingredients = input.split("\n")
  .map( parseLine );

// assumption: weights.length === ingredients.length
var calculateScore = function( weights ) {
  return PROPERTIES.map(function( prop ) {
    var val = ingredients.reduce(function( sum, ing, index ) {
      return sum + ing[ prop ] * weights[ index ];
    }, 0);

    return val < 0 ? 0 : val;
  }).reduce(function( prod, curr ) {
    return prod * curr;
  }, 1);
};

var calculateCalories = function( weights ) {
  return ingredients.reduce(function( sum, ing, index ) {
    return sum + ing.calories * weights[ index ];
  }, 0);
};

var bestScore = -1,
    bestCombo = null;

forEachSummation( 100, 4, function( arr ) {
  if( calculateCalories( arr ) !== 500 ) return;

  var score = calculateScore( arr );

  if( score > bestScore ) {
    bestScore = score;
    bestCombo = arr;
  }
});

console.log( bestScore, bestCombo, ingredients );