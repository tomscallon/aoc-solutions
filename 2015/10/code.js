// Tom Scallon. Advent of Code 2015, day 10.

// Read in input.
const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim();

/*const nextChunk = s => {
  //console.log(s, /^((\d)\2*)(\d*)/.exec(s))
  const [, chunk, num, rest] = /^((\d)\2*)(\d*)/.exec(s);

  return {num, count: chunk.length, rest};
};

const nextLookSay = s => {
  let next = '';
  let remaining = s;

  while (remaining.length > 0) {
    const {num, count, rest} = nextChunk(remaining);

    next += count;
    next += num;
    remaining = rest;
  }

  return next;
};*/

const nextLookSay = s => {
  let next = '';
  let match;
  let re = /((\d)\2*)/g;

  while (true) {
    match = re.exec(s);

    if (match) {
      next += match[1].length + match[2];
    } else break;
  }

  return next;
};

// Part 1 code.
const p1 = () => {
  let current = input;

  for (let i = 0; i < 40; i++) {
    current = nextLookSay(current);
  }

  return current.length;
};

// Part 2 code.
const p2 = () => {
  let current = input;

  for (let i = 0; i < 50; i++) {
    current = nextLookSay(current);
  }

  return current.length;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
