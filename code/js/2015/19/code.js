// Tom Scallon. Advent of Code 2015, day 19.

// Read in input.
let input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  // Double newline to split replacements from molecule.
  .trim().split('\n\n');

const RE = /([A-Za-z]+)\s=>\s([A-Za-z]+)/;
const parseLine = line => {
  const [, find, replace] = RE.exec(line);

  return {find, replace};
};

const groupReplacements = (grouped, {find, replace}) => {
  if (grouped[find]) {
    grouped[find].push(replace);
  } else {
    grouped[find] = [replace];
  }

  return grouped;
};

input = {
  replacements: input[0]
    .split('\n')
    .map(parseLine)
    .reduce(groupReplacements, {}),
  molecule: input[1]
};

// Part 1 code.
const allPossibleMolecules = (molecule, replacements) => {
  const possibilities = [];

  Object.keys(replacements).forEach(find => {
    const reps = replacements[find];

    for (
      let i = molecule.indexOf(find);
      i !== -1;
      i = molecule.indexOf(find, i + 1)
    ) {
      // For each of the possible replacements, perform it.
      reps.forEach(rep => {
        const result =
          molecule.substring(0, i) +
          rep +
          molecule.substring(i + find.length);

        if (possibilities.indexOf(result) === -1) {
          possibilities.push(result);
        }
      });
    }
  });

  return possibilities;
}

const p1 = () => {
  const possibilities = allPossibleMolecules(
    input.molecule,
    input.replacements
  );

  return possibilities.length;
};

// Part 2 code.
const invertReplacements = reps => Object.keys(reps)
  .reduce((o, k) => reps[k].reduce((o, v) => {
    if (o[v]) {
      o[v].push(k);
    } else {
      o[v] = [k];
    }

    return o;
  }, o), {});

const concat = (a, b) => a.concat(b);
const unique = (x, i, a) => a.indexOf(x) === i;

const p2 = () => {
  const replacements = invertReplacements(input.replacements);
  let molecules = [{m: input.molecule, s: 0}];
  let min = Number.MAX_SAFE_INTEGER;

  while (molecules.length) {
    let {m, s} = molecules.shift();

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Evaluating length ${m.length} / step ${s}\t\t${molecules.length} remaining`);

    if (m === 'e') {
      if (s < min) {
        min = s;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Min is now ${min}\n`);
      }
    } else if (m.length <= input.molecule.length) {
      s++;
      molecules = allPossibleMolecules(m, replacements)
        .map(m => ({m, s}))
        .concat(molecules);
    }
  }

  return step;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
