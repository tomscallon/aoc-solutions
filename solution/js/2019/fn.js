const F = {
  /// Array.
  sortBy: (a, f) => [...a].sort((x, y) => f(x) - f(y)),

  /// Object.
  objMap: (o, f) => {
    const r = {};
    for (const k in o) {
      r[k] = f(k, o[k], o);
    }
    return r;
  },

  objReduce: (o, f, i) => {
    let a = i;

    for (const k in o) {
      a = f(a, k, o[k], o);
    }

    return a;
  },

  objKeyMaxBy: (o, f) => {
    let m = -Infinity;
    let mk = null;

    for (const k in o) {
      let v = f(k, o[k], o);

      if (v > m) {
        m = v;
        mk = k;
      }
    }

    return mk;
  },

  /// Regex.
  allMatches: (s, r) => {
    const a = [];
    let m;

    while (m = r.exec(s)) a.push(m);

    return a;
  },

  /// Functions.
  compose: (...fns) => x => fns.reduce((x, f) => f(x), x),

  collectAnd: f => (...xs) => f(xs),

  arg: i => (...args) => args[i],

  pick: (...p) => F.compose(...p.map(p => o => o[p])),

  max: (a, b) => Math.max(a, b),

  /// Predicates.
  // Composers.
  all: (...preds) => x => preds.every(p => p(x)),

  any: (...preds) => x => preds.some(p => p(x)),

  not: (pred) => {
    return x => !pred(x);
  },

  // Simple.
  odd: (x) => {
    return x % 2 === 1;
  },

  even: (x) => {
    return x % 2 === 0;
  },

  /// Generators.
  // Provided.
  range: function*(eMax, iMin = 0) {
    let current = iMin;

    while (current < eMax) yield current++;
  },

  pairs: function*(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        yield [arr[i], arr[j]];
      }
    }
  },

  // Utility.
  genFilter: (pred) => {
    return function*(gen) {
      for (let x of gen) {
        if (pred(x)) {
          yield x;
        }
      }
    }
  },

  genMap: (mapper) => {
    return function*(gen) {
      for (let x of gen) {
        yield mapper(x);
      }
    }
  },

  collect: (generator) => {
    const res = [];

    for (let x of generator) {
      res.push(x);
    }

    return res;
  },

  /// Miscellaneous.
  polarAngleFrom: (
    [x, y],
    {anchor = 0, clockwise = false} = {},
  ) => ([tx, ty]) => {
    const dx = tx - x;
    const dy = ty - y;

    const angleDeg = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
    const adjustedDeg = (angleDeg - anchor + 360) % 360;

    return clockwise ? adjustedDeg === 0 ? 0 : 360 - adjustedDeg : adjustedDeg;
  },
};

module.exports = F;
