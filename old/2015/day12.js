var input = JSON.parse( require("fs").readFileSync("day12-input.txt").toString() );

var isArray = function( thing ) {
  return thing instanceof Array;
}

var isObject = function( thing ) {
  return typeof thing === "object" && thing instanceof Object;
}

var isNumber = function( thing ) {
  return typeof thing === "number";
}

var isString = function( thing ) {
  return typeof thing === "string";
}

var sumAll = function( thing ) {
  var sum = 0;

  //console.log( thing, isObject( thing ) ? "red" in thing : false );

  if( isArray( thing ) ) {
    sum = thing.reduce(function( last, curr ) {
      return last + sumAll( curr );
    }, 0);
  } else if( isObject( thing ) && !hasBadProp( "red", thing ) ) {
    for( var prop in thing ) {
      sum += sumAll( thing[ prop ] );
    }
  } else if( isNumber( thing ) ) {
    sum = thing;
  }

  return sum;
};

var hasBadProp = function( badProp, thing ) {
  if( !isString( badProp ) || !isObject( thing ) ) {
    return false;
  }

  for( var prop in thing ) {
    if( thing[ prop ] === badProp ) {
      return true;
    }
  }

  return false;
};

console.log( sumAll( input ) );