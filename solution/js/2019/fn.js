const F = {
  /// Array.
  sortBy: (a, f) => [...a].sort((x, y) => f(x) - f(y)),

  iterator: function*(i) {
    yield *i;
  },

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

  // Powerful function for iterating the cross product
  // of multiple provided generators. Understands both
  // arrays and objects; the yielded result will match
  // the structure of the input.
  // IMPORTANTLY, each location which should contain
  // generated values must be a function that returns
  // a generator. Note this means if you want a value
  // to be a function, you must instead put a function
  // that returns that function.
  enumerate: function*(gens) {
    if (gens == null) {
      // If it's undefined or null, just yield it.
      yield gens;
    } else if (Array.isArray(gens)) {
      // If it's an array...
      if (gens.length === 0) {
        // ...and is empty, just yield that array.
        yield [];
      } else {
        // Otherwise...
        const [head, ...tail] = gens;

        // For every element yielded by the head...
        for (const h of F.enumerate(head)) {
          // For every array yielded by the tail...
          for (const t of F.enumerate(tail)) {
            // Yield an array combining the head and tail.
            yield [h, ...t];
          }
        }
      }
    } else if (typeof gens[Symbol.iterator] === 'function') {
      // If it's iterable, just yield everything it yields.
      // It's important we check for this AFTER checking
      // for an array (as arrays are iterable).
      yield* gens;
    } else if (typeof gens === 'function') {
      // If it's a function, enumerate it.
      const res = gens();

      // If the result is iterable and not an array...
      if (
        res != null &&
        typeof res[Symbol.iterator] === 'function' &&
        !Array.isArray(res)
      ) {
        // ...yield all the elements it produces.
        yield* res;
      } else {
        // Otherwise, just yield the result itself.
        yield res;
      }
    } else if (typeof gens === 'object') {
      // If it's an object, grab its keys.
      const keys = Object.keys(gens);

      // If it's empty...
      if (keys.length === 0) {
        // ...just yield an empty object.
        yield {};
      } else {
        // Otherwise, grab the first property.
        const first = keys[0];
        const rest = {...gens};
        delete rest[first];

        // For every element yielded by the first property...
        for (const h of F.enumerate(gens[first])) {
          // For every object yielded by the remaining
          // object without the first property...
          for (const t of F.enumerate(rest)) {
            // Yield the object formed by combining the
            // remaining object with the first element.
            yield {[first]: h, ...t};
          }
        }
      }
    } else {
      // For any other type of value, just yield it.
      yield gens;
    }
  },

  // Utility.
  genFilter: pred => {
    return function*(gen) {
      for (let x of gen) {
        if (pred(x)) {
          yield x;
        }
      }
    }
  },

  genMap: mapper => {
    return function*(gen) {
      for (let x of gen) {
        yield mapper(x);
      }
    }
  },

  collect: generator => {
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
