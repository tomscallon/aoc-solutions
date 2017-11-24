const input = require("fs").readFileSync("day2-input.txt").toString();

const lines = input.split('\n').filter(x => !!x);

const instructions = {
  U: {x:0, y:-1},
  D: {x:0, y:1},
  L: {x:-1, y:0},
  R: {x:1, y: 0}
};
const insToDelta = i => instructions[i];

const map = [].map;
const deltas = lines.map(line => map.call(line, insToDelta));

const bound = (min, max) => x =>
  min !== undefined && x < min ?
    min :
    max !== undefined && x > max ?
     max :
     x;

const codeFor = (pad, { x, y }) => pad[y][x];

// bound: (next, currOther) => boundedNext
// boundX: (nextX, currY) => boundedNextX
// boundY: (nextY, currX) => boundedNextY
const nextPos = ({ bound, boundX = bound, boundY = bound }) =>
  ({ x, y }, { x: dx, y: dy }) =>
  ({
    x: boundX( x + dx, y ),
    y: boundY( y + dy, x )
  })

const getCode = ({
  pad,
  start,
  bound,
  boundX = bound,
  boundY = bound
}) => deltas.reduce(({ code, start }, line) => {
  const end = line
    .reduce(nextPos({ boundX, boundY }), start);

    return {
      code: code + codeFor(pad, end),
      start: end,
    };
}, {
  code: '',
  start
}).code;

// Part 1

const bound02 = bound(0, 2);

const pad = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

const code = getCode({
  pad,
  start: {
    x: 1,
    y: 1,
  },
  bound: bound02,
});

console.log(`The first code is ${code}.`);

// Part 2
const bounders = [0, 1, 2].map(n => bound(2 - n, 2 + n));
const boundDiamond = (n, o) => {
  const diff = 2 - Math.abs(2 - o);
  return bounders[ diff ]( n );
}

const _ = undefined;

const newPad = [
  [_,  _,   1,   _,  _],
  [_,  2,   3,   4,  _],
  [5,  6,   7,   8,  9],
  [_, 'A', 'B', 'C', _],
  [_,  _,  'D',  _,  _]
];

const newCode = getCode({
  pad: newPad,
  start: {
    x: 0,
    y: 2,
  },
  bound: boundDiamond,
});

console.log(`The second code is ${newCode}.`);
