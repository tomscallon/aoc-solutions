// Tom Scallon. Advent of Code 2019, day 11.
const F = require('./fn');
const intcode = require('./intcode');

// Read in input.
const {input} = process.env;
const insts = input.split(',');

const U = 0;
const R = 1;
const D = 2;
const L = 3;
const DELTAS = {
  [U]: {x:  0, y: -1},
  [R]: {x:  1, y:  0},
  [D]: {x:  0, y:  1},
  [L]: {x: -1, y:  0},
};

const makeKey = ({x, y}) => `${x},${y}`;
const parseKey = k => k.split(',').map(Number);
const nextDir = (dir, turn) => (dir + turn * 2 + 3) % 4;
const nextPos = ({x, y}, dir) => ({
  x: x + DELTAS[dir].x,
  y: y + DELTAS[dir].y,
});
const runRobot = ({initialPanels = {}} = {}) => {
  // Representation of current panel states.
  // Only has a key for a panel if it has been
  // explictly painted by the robot. Any missing
  // panel is black.
  const panels = {...initialPanels};

  // For convenience. We know we'll never overwrite
  // this key because it doesn't match the x,y format.
  // But, make it non-enumerable so attempts to count
  // painted panels by counting keys aren't broken.
  Object.defineProperty(
    panels,
    'at',
    {
      enumerable: false,
      value: p => panels[makeKey(p)] || 0,
    },
  );

  // A record of all the paint operations occurring
  // throughout the robot's execution.
  const paints = [];

  // Tracking robot state.
  let pos = {x: 0, y: 0};
  let dir = U;

  // Intcode program running the robot.
  const robot = intcode([...insts], []);

  // Initialize the robot.
  robot.next();

  // Iterate forever. We break out explicitly when
  // the robot's program ends.
  while (true) {
    const currentColor = panels.at(pos);
    const robotState = robot.next(currentColor);

    const outs = robotState.done
      // The final return gives back [memory, outputs].
      ? robotState.value[1]
      // Intermediate returns yield outputs.
      : robotState.value;

    // Grab outputs. We read from the back, so grab
    // them in opposite order.
    const turn = outs.pop();
    const color = outs.pop();

    // Paint the current panel, and record the action.
    panels[makeKey(pos)] = color;
    paints.push({pos, color});

    // Turn and move.
    dir = nextDir(dir, turn);
    pos = nextPos(pos, dir);

    // Return if done.
    if (robotState.done) {
      return {
        paints,
        panels,
        finalPos: pos,
        finalDir: dir,
      };
    }
  }
};

// Part 1 code.
const p1 = () => {
  const {panels} = runRobot();
  return Object.keys(panels).length;
};

// Part 2 code.
const p2 = () => {
  const {panels} = runRobot({
    initialPanels: {
      [makeKey({x: 0, y: 0})]: 1,
    },
  });

  // Determine the program bounds.
  let xs = Infinity;
  let xe = -Infinity;
  let ys = Infinity;
  let ye = -Infinity;
  for (const pos in panels) {
    const [x, y] = parseKey(pos);
    xs = Math.min(xs, x);
    xe = Math.max(xe, x);
    ys = Math.min(ys, y);
    ye = Math.max(ye, y);
  }

  // Print the output!
  let out = '';
  let lasty = ys;
  const mapping = {
    0: '\u25A1',
    1: '\u25A0'
  };
  const eSpec = {
    y: () => F.range(ye + 1, ys),
    x: () => F.range(xe + 1, xs),
  };
  for (let {x, y} of F.enumerate(eSpec)) {
    if (y !== lasty) {
      out += '\n';
      lasty = y;
    }

    out += mapping[panels.at({x, y})];
  }

  // KEEP
  console.log(out);

  return 'See console output.';
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
