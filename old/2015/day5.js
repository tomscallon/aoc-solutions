var input = require("fs").readFileSync("day5-input.txt").toString();

/*var vowel  = /.*?([aeiou].*?){3}/,
    repeat = /([a-z])\1/,
    bad    = /ab|cd|pq|xy/;*/

var pair     = /([a-z]{2}).*?\1/,
    sandwich = /([a-z])[a-z]\1/;

var count = 0;

var testWord = function( word ) {
  if( pair.test( word ) && sandwich.test( word ) ) {
    count++
  }
}

input.split("\n").forEach( testWord );

console.log( count );