var forEachPermutation = require("./util/forEachPermutation.js");

var input = require("fs").readFileSync("day9-input.txt").toString();

var distRe = /([A-Z][A-Za-z]*)\sto\s([A-Z][A-Za-z]*)\s=\s(\d+)/;

var atlas = {
  _cities: [],
  _dists: {},

  _createIfNeeded: function(/* arg0, ..., argN */) {
    Array.prototype.forEach.call( arguments, function( place ) {
      if( !this._dists[ place ] ) {
        this._cities.push( place );
        this._dists[ place ] = {};
      }
    }, atlas );
  },

  getCities: function() {
    return this._cities;
  },

  addDist: function( start, end, dist ) {
    this._createIfNeeded( start, end );

    this._dists[ start ][ end ] = this._dists[ end ][ start ] = dist;
  },

  getDist: function( start, end ) {
    return this._dists[ start ][ end ];
  },

  calculateDist: function( path ) {
    var dist = 0;

    for( var i = 0, last = path.length - 1; i < last; i++ ) {
      dist += this.getDist( path[ i ], path[ i + 1 ] );
    }

    return dist;
  }
};

var parseDistance = function( inputLine ) {
  var result = distRe.exec( inputLine );

  atlas.addDist( result[ 1 ], result[ 2 ], +result[ 3 ] );
};

// Read in the distances
input.split("\n").forEach( parseDistance );

// For each permutation, calculate the distance
var shortest = {
  path: atlas.getCities(),
  dist: atlas.calculateDist( atlas.getCities() )
};

var longest = {
  path: null,
  dist: 0
};

forEachPermutation( atlas.getCities(), function( path ) {
  var dist = atlas.calculateDist( path );

  // If this distance is shorter, save it
  if( dist < shortest.dist ) {
    shortest = {
      path: path,
      dist: dist
    }
  }

  // If this distance is longer, save it
  if( dist > longest.dist ) {
    longest = {
      path: path,
      dist: dist
    }
  }
});

// Done -- print the results!
console.log( longest );