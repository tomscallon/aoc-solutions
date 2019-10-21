// Tom Scallon. Advent of Code 2015, day 15.
const utils = require('../../utils');

// Read in input.
const RE = /([A-Za-z])+: capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)/;
const parseLine = line => {
  const [
    ,
    name,
    capacity,
    durability,
    flavor,
    texture,
    calories
  ] = RE.exec(line);

  return {
    name,
    capacity: +capacity,
    durability: +durability,
    flavor: +flavor,
    texture: +texture,
    calories: +calories,
  };
};

const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n')
  .map(parseLine);

// Part 1 code.
const product = (a, b) => a * b;
const getTotals = (ingredients, amounts) => {
  const totals = [
    'capacity',
    'durability',
    'flavor',
    'texture',
    'calories'
  ].reduce((o, x) => (o[x] = 0, o), {});

  ingredients.forEach((ing, i) => {
    Object.keys(totals).forEach(
      prop => totals[prop] += ing[prop] * amounts[i]
    );
  });

  return totals;
};

const computeScore = (ingredients, amounts) => {
  const totals = getTotals(ingredients, amounts);

  return Object.keys(totals)
    .map(k => k === 'calories' ? 1 : Math.max(totals[k], 0))
    .reduce(product);
};

const findBest = (ingredients, tablespoons, scorer) => {
  let maxScore = -1;
  let maxAmounts = null;

  for (let amounts of utils.summations(ingredients.length, tablespoons)) {
    const score = scorer(ingredients, amounts);

    if (score > maxScore) {
      maxScore = score;
      maxAmounts = amounts;
    }
  }

  return {amounts: maxAmounts, score: maxScore};
};

const p1 = () => {
  const {score, amounts} = findBest(input, 100, computeScore);
  const totals = getTotals(input, amounts);

  return `The best cookie has score ${score}.\n` +
    'The ingredients are:\n' +
    amounts.map((a, i) => `  ${input[i].name}: ${a}`).join('\n') +
    '\nThe properties are:\n' +
    Object.keys(totals).map(k => `  ${k}: ${totals[k]}`).join('\n');
};

const computeScore2 = (ingredients, amounts) => {
  const totals = getTotals(ingredients, amounts);

  return totals['calories'] !== 500 ?
    0 : // must have 500 calories!
    Object.keys(totals)
      .map(k => k === 'calories' ? 1 : Math.max(totals[k], 0))
      .reduce(product);
};

// Part 2 code.
const p2 = () => {
  const {score, amounts} = findBest(input, 100, computeScore2);
  const totals = getTotals(input, amounts);

  return `The best cookie has score ${score}.\n` +
    'The ingredients are:\n' +
    amounts.map((a, i) => `  ${input[i].name}: ${a}`).join('\n') +
    '\nThe properties are:\n' +
    Object.keys(totals).map(k => `  ${k}: ${totals[k]}`).join('\n');
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
