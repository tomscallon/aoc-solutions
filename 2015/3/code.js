// Tom Scallon. Advent of Code 2015, day 3.

// Read in input.
const input = require('fs').readFileSync(__dirname + '/input.txt', 'utf8');

// Part 1 code.
const OFFSETS = {
  '^': {
    x: 0,
    y: 1
  },
  'v': {
    x:  0,
    y: -1
  },
  '>': {
    x: 1,
    y: 0,
  },
  '<': {
    x: -1,
    y:  0
  }
};
const updatePosition = ({x, y}, d) => ({
  x: x + OFFSETS[d].x,
  y: y + OFFSETS[d].y
});
const findPosition = ({x, y}) => ({x: ix, y: iy}) => x === ix && y === iy;

const p1 = () => {
  const visited = [{x: 0, y: 0}];
  let pos = {x: 0, y: 0};

  Array.prototype.forEach.call(input, c => {
    pos = updatePosition(pos, c);
    if (!visited.find(findPosition(pos))) {
      visited.push(pos);
    }
  });

  return visited.length;
};

// Part 2 code.
const p2 = () => {
  const visited = [{x: 0, y: 0}];
  let santaPos = {x: 0, y: 0};
  let robotPos = {x: 0, y: 0};

  Array.prototype.forEach.call(input, (c, i) => {
    let newPos = i % 2 === 0 ?
      santaPos = updatePosition(santaPos, c) :
      robotPos = updatePosition(robotPos, c);

    if (!visited.find(findPosition(newPos))) {
      visited.push(newPos);
    }
  });

  return visited.length;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
