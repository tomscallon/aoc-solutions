var input = require("fs").readFileSync("day6-input.txt").toString();

var reInstr = /^(turn on|toggle|turn off)\s(\d{1,3}),(\d{1,3})\sthrough\s(\d{1,3}),(\d{1,3})$/;

var readInstruction = function( instr ) {
  var result = reInstr.exec( instr );

  return {
    type:   result[ 1 ],
    startX: +result[ 2 ],
    startY: +result[ 3 ],
    endX:   +result[ 4 ],
    endY:   +result[ 5 ]
  };
}

var fns = {
  "turn on":  function( val ) { return val + 1; },
  "turn off": function( val ) { return val === 0 ? 0 : val - 1; },
  "toggle":   function( val ) { return val + 2; }
};

var grid;

var runInstruction = function( instr ) {
  var fn = fns[ instr.type ];

  for( var i = instr.startX; i <= instr.endX; i++ ) {
    for( var j = instr.startY; j <= instr.endY; j++ ) {
      grid[ i ][ j ] = fn( grid[ i ][ j ] );
    }
  }
};

// initialize grid
grid = [];

for( var i = 0; i < 1000; i++ ) {
  var row = [];
  for( var j = 0; j < 1000; j++ ) {
    row.push( 0 );
  }
  grid.push( row );
}

// run the instructions
input
  .split("\n")
  .map( readInstruction )
  .forEach( runInstruction );

// count grid spaces with 'true' values
var count = 0;
for( var i = 0; i < 1000; i++ ) {
  for( var j = 0; j < 1000; j++ ) {
    count += grid[ i ][ j ];
  }
}

console.log( count );