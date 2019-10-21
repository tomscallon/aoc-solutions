// Tom Scallon. Advent of Code 2015, day 16.

// Read in input.
const RE = /Sue (\d+): (.+)/;
const addProp = (r, p) => {
  const [prop, count] = p.split(': ');

  r[prop] = +count;

  return r;
};
const parseLine = line => {
  const [ , n, rest] = RE.exec(line);

  return {
    n,
    facts: rest.split(', ').reduce(addProp, {})
  };
};
const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n')
  .map(parseLine);

const expected =
`children: 3
cats: 7
samoyeds: 2
pomeranians: 3
akitas: 0
vizslas: 0
goldfish: 5
trees: 3
cars: 2
perfumes: 1`.split('\n').reduce(addProp, {});

// Part 1 code.
const matches = ({facts}, expected) =>
  Object.keys(facts).every(k => facts[k] === expected[k]);

const p1 = () => input.filter(sue => matches(sue, expected))[0].n;

// Part 2 code.
const gt = (a, e) => a > e;
const lt = (a, e) => a < e;
const eq = (a, e) => a === e ;
const tests = {
  cats: gt,
  trees: gt,
  pomeranians: lt,
  goldfish: lt,
};

const matches2 = ({facts}, expected) =>
  Object.keys(facts).every(k => (tests[k] || eq)(facts[k], expected[k]))

const p2 = () => input.filter(sue => matches2(sue, expected))[0].n;

// Export the functions.
exports[1] = p1;
exports[2] = p2;
