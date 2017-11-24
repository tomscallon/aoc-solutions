// So I can copy this without having to change the day constantly.
const _day = process.argv[1].split('/').pop().split('.')[0];
const input = require("fs").readFileSync(`${_day}-input.txt`).toString();

const largestLast = (a, b) => a - b;
const triangles = input
  .split('\n')
  .filter(l => !!l)
  .map(l => l.trim().split(/\s+/).map(x => +x));
const sortedTriangles = triangles.map(x => [...x].sort(largestLast));

const isValid = ([ a, b, c ]) => a + b > c;

// Day 1

// Preconditions:
//   [ a, b, c ] are sides of triangle
//   a <= b <= c

const valid = sortedTriangles
  .map( isValid )
  .filter( x => x )
  .length;

console.log(`Only ${valid} of the ${triangles.length} triangles are valid.`);

// Day 2

const transpose3x3 = ([
  [ a, b, c ],
  [ d, e, f ],
  [ g, h, i ]
]) => [
  [ a, d, g ],
  [ b, e, h ],
  [ c, f, i ]
];

const htovReducer = ({ triangles, buffer }, t) => {
  let newTriangles;
  let newBuffer;

  // If we have three stored triangles, transpose them.
  if( buffer.length === 2 ) {
    let added = transpose3x3([ t, ...buffer ]).map(t => t.sort(largestLast));
    newTriangles = [ ...added, ...triangles ];
    newBuffer = [];
  } else {
    newTriangles = triangles;
    newBuffer = [ t, ...buffer ];
  }

  return {
    triangles: newTriangles,
    buffer: newBuffer,
  }
};

const { triangles: vertTriangles } = triangles.reduce( htovReducer, {
  triangles: [],
  buffer: []
});

//console.log( vertTriangles );

const vvalid = vertTriangles
  .map( isValid )
  .filter( x => x )
  .length;

console.log(`Only ${vvalid} of the ${triangles.length} vertical triangles are valid.`);
