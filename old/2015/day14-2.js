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

var awardPointToFirstPlace = function( data ) {
  // Sort the data by distance travelled
  var sorted = data.sort(function( dataA, dataB ) {
    var dA = dataA.dist,
        dB = dataB.dist;

    return dA > dB ? -1 
         : dA < dB ? 1
         : 0;
  });

  // Find the farthest distance
  var max = sorted[0].dist;

  // Give all reindeer at that distance a point
  for( var i = 0; i < data.length; i++ ) {
    if( data[i].dist === max ) {
      data[i].score++;
    }
  }
};

var simulateSecond = function( data ) {
  data.forEach(function( data ) {
    // If the time for the current action has expired...
    if( data.time === 0 ) {
      // ...switch actions
      data.moving = !data.moving;
      data.time   = data.info[ data.moving ? "stamina" : "rest" ];
    }

    // Update position if moving
    if( data.moving ) {
      data.dist += data.info.speed;
    }
    
    // Subtract a second from the time
    data.time--;
  });
  
  // Give first place a point
  awardPointToFirstPlace( data );
};

var simulate = function( time ) {
  var data = reindeer.map(function( deerInfo ) {
    return {
      dist:   0,
      score:  0,
      moving: true,
      time:   deerInfo.stamina,
      info:   deerInfo
    };
  });

  for( var i = 0; i < time; i++ ) {
    simulateSecond( data );
  }

  console.log( data );

  return data.map(function( data ) {
    return {
      name:  data.info.name,
      score: data.score
    };
  });
};

console.log( simulate( 2503 ) );