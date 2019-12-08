// Tom Scallon. Advent of Code 2019, day 8.

// Read in input.
const {input} = process.env;

// Part 1 code.
const parseImage = (input, w, h) => {
  const layers = [];

  let i = 0;
  while (i < input.length) {
    let layer = '';

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        layer += input[i++];
      }

      layer += '\n';
    }

    layers.push(layer.trim());
  }

  return layers;
};

const countDigit = i => layer => Array.prototype.filter.call(
  layer,
  c => c == i,
).length;

const p1 = () => {
  const layers = parseImage(input, 25, 6);
  const count0 = countDigit(0);

  layers.sort((l1, l2) => count0(l1) - count0(l2));

  return countDigit(1)(layers[0]) * countDigit(2)(layers[0]);
};

// Part 2 code.
const decodeImage = layers => {
  let result = '';
  const len = layers[0].length;

  for (let i = 0; i < len; i++) {
    if (layers[0][i] === '\n') {
      result += '\n';
      continue;
    }

    result += layers
      .map(l => l[i])
      .find(c => c != 2);
  }

  return result;
};

const p2 = () => {
  const res = decodeImage(parseImage(input, 25, 6));
  const mapping = {
    ['\n']: '\n',
    0: '\u25A0',
    1: '\u25A1'
  };
  console.log(res.replace(/./g, c => mapping[c]));
  return 0;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
