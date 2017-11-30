// Tom Scallon. Advent of Code 2015, day 11.

// Read in input.
const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim();

// Part 1 code.
const range = n => n === 0 ? [] : [...range(n - 1), n - 1];

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const RE_RUN = new RegExp(
  range(24).map((i) => ALPHABET.substring(i, i + 3)).join('|')
);
const RE_BAD = /[ilo]/;
const RE_TWO_PAIRS = /([a-z])\1.*([a-z])\2/;

const isValidPassword = s =>
  RE_RUN.test(s) && !RE_BAD.test(s) && RE_TWO_PAIRS.test(s);

const encode = s => Array.prototype.map
  .call(s, c => ALPHABET.indexOf(c))
  .reverse();
const increment = ([h, ...t]) => h === 25 ? [0, ...increment(t)] : [h + 1, ...t];
const decode = a => a.reverse().map(i => ALPHABET[i]).join('');

const nextPassword = s => decode(increment(encode(s)));

const p1 = () => {
  let password = nextPassword(input);

  while (!isValidPassword(password)) password = nextPassword(password);

  return password;
};

// Part 2 code.
const p2 = () => {
  let password = nextPassword('hxbxxyzz');

  while (!isValidPassword(password)) password = nextPassword(password);

  return password;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
