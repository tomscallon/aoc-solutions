// Tom Scallon. Advent of Code 2015, day 20.

// Read in input.
const input = +require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8').trim();

// Part 1 code.
const unique = (x, i, a) => a.indexOf(x) === i;

const factorsOf = n => {
  let factors = [1];

  for (let f = 2, stop = Math.sqrt(n); f <= stop; f++) {
    if (n % f === 0) {
      factors.push(f);
      factors.push(n / f);
    }
  }

  // console.log(n, factors);
  factors.push(n);
  return factors.filter(unique);
};

const sum = (a, b) => a + b;

const p1 = () => {
  let i = 1, s;

  while ((s = factorsOf(i).reduce(sum) * 10) < input) {
    i++;
  }

  return i;
};

// Part 2 code.
const fiftySteps = x => i => x / i - 1 <= 50;

const p2 = () => {
  let i = 1, s;

  while ((s = factorsOf(i).filter(fiftySteps(i)).reduce(sum) * 11) < input) {
    i++;
  }

  return i;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
