// Tom Scallon. Advent of Code 2019, day 4.

// Read in input.
const {input} = process.env;
const [start, end] = input.split('-').map(Number);

// Part 1 code.
const twoAdjacentSame = n => {
  let s = n + '';

  for (let i = 0; i < s.length - 1; i++) {
    if (s[i] == s[i + 1]) {
      return true;
    }
  }

  return false;
};

const increasing = n => {
  let s = n + '';

  for (let i = 0; i < s.length - 1; i++) {
    if (+s[i] > +s[i + 1]) {
      return false;
    }
  }

  return true;
};

const p1 = () => {
  let total = 0;
  for (let x = start; x <= end; x++) {
    if (twoAdjacentSame(x) && increasing(x)) {
      total++;
    }
  }
  return total;
};

// Part 2 code.
const strictTwoAdjacentSame = n => {
  let s = n + '';

  for (let i = 0; i < s.length - 1; i++) {
    if (s[i] == s[i + 1] && s[i - 1] != s[i] && s[i + 2] != s[i]) {
      return true;
    }
  }

  return false;
};

const p2 = () => {
  let total = 0;
  for (let x = start; x <= end; x++) {
    if (strictTwoAdjacentSame(x) && increasing(x)) {
      total++;
    }
  }
  return total;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
