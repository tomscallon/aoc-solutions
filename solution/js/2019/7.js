// Tom Scallon. Advent of Code 2019, day 7.
const intcode = require('./intcode');

// Read in input.
const {input} = process.env;
const insts = input.split(',');

// Part 1 code.
function* permutations(a) {
  if (a.length === 0) {
    yield [];
    return;
  }

  for (let i = 0; i < a.length; i++) {
    const first = a[i];
    const rest = a.slice(0, i).concat(a.slice(i + 1));

    for (let p of permutations(rest)) {
      yield [first].concat(p);
    }
  }
}

const tryAmplifier = args => {
  let res = 0;

  while (args.length) {
    const [mem, out] = intcode(
      [...insts],
      [args.shift(), res],
    );

    res = out.pop();
  }

  return res;
};

const p1 = () => {
  let res = 0;

  for (let p of permutations([0, 1, 2, 3, 4])) {
    const attempt = +tryAmplifier(p);
    res = Math.max(res, attempt);
  }

  return res;
};

// Part 2 code.
const tryCircularAmplifier = args => {
  let res = 0;
  let amps = args.map(a => {
    const res = intcode([...insts], [a]);
    res.next();
    return res;
  });

  while (true) {
    for (let i = 0; i < amps.length; i++) {
      //console.error('Passing input', res, i, amps[i]);
      const state = amps[i].next(res);
      //console.error('Got state', state);
      res = state.value.pop();

      if (Array.isArray(res)) {
        if (i === 4) {
          return +res[1];
        } else {
          res = +res[1];
        }
      }
    }
  }
};

const p2 = () => {
  let res = 0;

  for (let p of permutations([5, 6, 7, 8, 9])) {
    const attempt = +tryCircularAmplifier(p);
    res = Math.max(res, attempt);
  }

  return res;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
