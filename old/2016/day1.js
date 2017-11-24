const input = require("fs").readFileSync("day1-input.txt").toString();

const instructions = input
  .split(', ')
  .map(s => ({
    turn: s[0],
    count: +s.substring(1),
  }));

let info = {
  x: 0,
  y: 0,
  dir: 0
};

const nextDir = (dir, turn) => (4 + dir + (turn === 'L' ? -1 : 1)) % 4;

const xyForDir = (dir) => ({
  x: dir % 2 === 1 ? -dir + 2 : 0,
  y: dir % 2 === 0 ? -dir + 1 : 0,
});

const applyInstruction = ({ x, y, dir }, { turn, count }) => {
  let newDir = nextDir(dir, turn);
  let { x: dx, y: dy } = xyForDir(newDir);

  return {
    x: x + dx * count,
    y: y + dy * count,
    dir: newDir
  };
};

// Day 1, part 1

const start = {
  x: 0,
  y: 0,
  dir: 0
};

const final = instructions
  .reduce((pos, ins) => applyInstruction(pos, ins), start);

console.log(final);
console.log('Total distance is', Math.abs(final.x) + Math.abs(final.y));

// Day 1, part 2

const findCoord = ({ x, y }) => ({ x: ex, y: ey }) =>
  x === ex && y === ey;

const markVisited = ({ current, visited, repeated }, { turn, count }) => {
  let nDir = nextDir(current.dir, turn);
  let { x, y } = current;
  let { x: dx, y: dy } = xyForDir(nDir);

  // For each point along the way, add it to visited
  for( let i = 0; i < count; i++ ) {
    x += dx;
    y += dy;
    let point = { x, y };

    // If the point has already been visited, add it to repeated
    if( visited.find( findCoord( point ))) {
      repeated.push(point);
    }

    // Then add it to visited
    visited.push(point);
  }

  // Finally, return the new info
  return {
    current: {
      dir: nDir,
      x, y
    },
    visited,
    repeated
  };
}

const { visited, repeated } = instructions
  .reduce( markVisited, {
    current: start,
    visited: [{
      x: 0,
      y: 0
    }],
    repeated: []
  });

let p = repeated[0];
console.log(`The first repeated point is (${p.x}, ${p.y}), `
          + `distance = ${Math.abs(p.x) + Math.abs(p.y)}.`);
