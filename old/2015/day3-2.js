var input = require("fs").readFileSync("day3-input.txt").toString();

var santa = [ 0, 0 ],
    robot = [ 0, 0 ]
    visited = [ "" + santa ];

var MOVES = {
  "^": [  0,  1 ],
  "v": [  0, -1 ],
  ">": [  1,  0 ],
  "<": [ -1,  0 ]
};

var move = function( char, robo ) {
  var change = MOVES[ char ],
      str,
      last = robo ? robot : santa;

  last = [ last[0] + change[0], last[1] + change[1] ];
  str  = "" + last;

  if( visited.indexOf( str ) === -1 ) {
    visited.push( str );
  }

  robo ?
    robot = last :
    santa = last;
};

for( var i = 0; i < input.length; i++ ) {
  move( input[ i ], i % 2 === 0 );
}

console.log( visited.length );