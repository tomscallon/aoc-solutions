// Tom Scallon. Advent of Code 2015, day 14.

// Read in input.
const RE = /([A-Za-z]+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds./;

const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n')
  .map(line => {
    const [, name, speed, flyTime, restTime] = RE.exec(line);

    return {
      name,
      speed: +speed,
      flyTime: +flyTime,
      restTime: +restTime,
    };
  });

// Part 1 code.
const distanceTraveled = (time, {speed, flyTime, restTime}) => {
  let flying = true;
  let traveled = 0;
  let elapsed = 0;

  while (elapsed < time) {
    if (flying) {
      // When adding distance, make sure to stop at the correct time.
      traveled += Math.min(flyTime, time - elapsed) * speed;

      // Don't need to do this for elapsed time, because the while
      // condition is < (so > or = will make us break).
      elapsed += flyTime;
    } else {
      elapsed += restTime;
    }

    flying = !flying;
  }

  return traveled;
};

const p1 = () => {
  winner = input
    .map(r => ({
      name: r.name,
      dist: distanceTraveled(2503, r)
    }))
    .sort(({dist: da}, {dist: db}) => db - da)[0];

  return `Traveling ${winner.dist}km, ${winner.name} wins!`;
}

// Part 2 code.
const simulate = time => {
  const state = input.map(r => ({
    info: r,
    flying: true,
    remaining: r.flyTime,
    traveled: 0,
    points: 0
  }));

  for (let elapsed = 0, farthest = 0; elapsed < time; elapsed++) {
    // Update distances traveled and state information.
    state.forEach(rs => {
      if (rs.flying) {
        rs.traveled += rs.info.speed;
        farthest = Math.max(farthest, rs.traveled);
      }

      if (--(rs.remaining) === 0) {
        rs.flying = !rs.flying;
        rs.remaining = rs.flying ? rs.info.flyTime : rs.info.restTime;
      }
    });

    // Award points to farthest reindeer.
    state.forEach(rs => {
      if (rs.traveled === farthest) {
        rs.points++;
      }
    });
  }

  const maxPoints = Math.max.apply(Math, state.map(({points}) => points));
  return state
    .filter(({points}) => points === maxPoints)
    .map(({info: {name}, traveled, points}) => ({
      name,
      traveled,
      points
    }));
};

const p2 = () => {
  const results = simulate(2503);
  const {points} = results[0]
  const winText = results
    .map(({name, traveled}) => `${name}, traveling ${traveled}km`)
    .join('\n');
  return `Our winner${results.length === 1 ? '' : 's'}, with ${points} points:\n${winText}`;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
