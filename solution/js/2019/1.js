// Tom Scallon. Advent of Code 2019, day 1.

// Read in input.
const {input} = process.env;
const lines = input.trim().split('\n');

// Part 1 code.
const p1 = () => {
  return lines
    .map(l => Math.floor(+l/3) - 2)
    .reduce((s, l) => s + l, 0);
};

// Part 2 code.
const fuel2 = x => {
  if (x > 0) {
    let xp = Math.max(0, Math.floor(x / 3) - 2);
    return xp + fuel2(xp);
  } else {
    return 0;
  }
}

const p2 = () => {
  return lines
    .map(Number)
    .map(fuel2)
    .reduce((x, y) => x + y, 0);
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
