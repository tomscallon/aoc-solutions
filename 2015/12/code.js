// Tom Scallon. Advent of Code 2015, day 12.

// Read in input.
const input = JSON.parse(
  require('fs').readFileSync(__dirname + '/input.txt', 'utf8')
);

// Part 1 code.
const sum = (a, b) => a + b;
const sumAllNumbers = x => {
  if (x instanceof Array) {
    return x.map(sumAllNumbers).reduce(sum, 0);
  } else if (typeof x === "object" || x instanceof Object) {
    return Object.keys(x).map(k => sumAllNumbers(x[k])).reduce(sum, 0);
  } else if (typeof x === "number" || x instanceof Number) {
    return x;
  } else {
    return 0;
  }
};

const p1 = () => sumAllNumbers(input);

// Part 2 code.
const sumAllNumbers2 = x => {
  if (x instanceof Array) {
    return x.map(sumAllNumbers2).reduce(sum, 0);
  } else if (typeof x === "object" || x instanceof Object) {
    return Object.keys(x).map(k => x[k]).indexOf('red') > -1 ?
      0 :
      Object.keys(x).map(k => sumAllNumbers2(x[k])).reduce(sum, 0);
  } else if (typeof x === "number" || x instanceof Number) {
    return x;
  } else {
    return 0;
  }
};

const p2 = () => sumAllNumbers2(input);

// Export the functions.
exports[1] = p1;
exports[2] = p2;
