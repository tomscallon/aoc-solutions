// Tom Scallon. Advent of Code 2018, day 1.

// Read in input.
const input = require('fs').readFileSync(__dirname + '/input.txt', 'utf8').trim();
const lines = input.split('\n');

// Part 1 code.
const p1 = () => {
  return lines.reduce((sum, el) => sum + +el, 0);
};

// Part 2 code.
const p2 = () => {
  const visited = [0];
  let current = 0;

  while (true) {
    for (let el of lines.map(x => +x)) {
      current += el;

      if (visited.includes(current)) return current;

      visited.push(current);
    }
  }
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
