var input = "cqjxxyzz";//"cqjxjnds"; <-- original input

var chars = "abcdefghjkmnpqrstuvwxyz";
var allChars = "abcdefghijklmnopqrstuvwxyz";

var nextWord = function( word ) {
  var str = "",
      i   = word.length - 1;

  for( var i = word.length - 1; i >= 0; i-- ) {
    str = chars[ (chars.indexOf( word[ i ] ) + 1) % chars.length ] + str;
    if( str[ 0 ] !== "a" ) break;
  }
  
  str = word.substring( 0, i ) + str;

  //console.log( word, "=>", str );

  return str;
};

var containsRun = function( word ) {
  for( var i = 0; i < word.length - 2; i++ ) {
    var index = allChars.indexOf( word[ i ] );

    if( index >= allChars.length - 2 ) continue;

    if( word[ i + 1 ] === allChars[ index + 1 ]
     && word[ i + 2 ] === allChars[ index + 2 ] ) {
      return true;
    }
  }

  return false;
};

var doubleLetterRe = /([a-z])\1.*?([a-z])\2/;

var nextPassword = function( word ) {
  var word = nextWord( word );

  while( !containsRun( word ) || !doubleLetterRe.test( word ) ) {
    word = nextWord( word );
  }

  return word;
};

console.log( nextPassword( input ) );