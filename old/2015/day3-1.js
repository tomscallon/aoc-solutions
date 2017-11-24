var input = require("fs").readFileSync("day3-input.txt").toString();

var last = [ 0, 0 ],
    visited = [ "" + last ];

var MOVES = {
  "^": [  0,  1 ],
  "v": [  0, -1 ],
  ">": [  1,  0 ],
  "<": [ -1,  0 ]
};

var move = function( char ) {
  var change = MOVES[ char ], str;

  last = [ last[0] + change[0], last[1] + change[1] ];
  str  = "" + last;

  if( visited.indexOf( str ) === -1 ) {
    visited.push( str );
  }
};

for( var i = 0; i < input.length; i++ ) {
  move( input[ i ] );
}

console.log( visited.length );