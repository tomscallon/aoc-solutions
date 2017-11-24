var input = require("fs").readFileSync("day14-input.txt").toString();

// ie, "Vixen can fly 8 km/s for 8 seconds, but then must rest for 53 seconds."
var inputRe = /([A-Z][a-z]*) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds./;

var parseLine = function( line ) {
  var result = inputRe.exec( line );

  return {
    name:    result[1],
    speed:   +result[2],
    stamina: +result[3],
    rest:    +result[4]
  };
};

var reindeer = input.split("\n")
  .map( parseLine );

var simulateOne = function( deer, time ) {
  var dist = 0;

  while( time > 0 ) {
    var progress = Math.min( deer.stamina, time );

    dist += progress * deer.speed;

    time = time - progress - deer.rest;
  }

  return dist;
};

var simulate = function( time ) {
  return reindeer.map(function( deerInfo ) {
    return {
      "name": deerInfo.name,
      "dist": simulateOne( deerInfo, time )
    };
  }).sort(function( a, b ) {
    return a > b ? 1 : a < b ? -1 : 0;
  });
};

console.log( simulate( 2503 ) );