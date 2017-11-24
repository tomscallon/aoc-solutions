var input = "3113322113";

var lookSay = function( input ) {
  var result = "", char = input[ 0 ], count = 0;

  for( var i = 0, len = input.length; i < len; i++ ) {
    var c = input[ i ];

    if( c !== char ) {
      result += "" + count + char;
      char = c;
      count = 1;
    } else {
      count++;
    }
  }

  result += "" + count + char;

  return result;
};

for( var i = 0; i < 50; i++ ) { // for part one, this is 40 times
  input = lookSay( input );
}

console.log( input.length );