module.exports = {
  /// Regex.
  allMatches: (s, r) => {
    const a = [];
    let m;

    while (m = r.exec(s)) a.push(m);

    return a;
  },

  /// Composition.
  compose: (...fns) => {
    return x => fns.reduce((x, f) => f(x), x);
  },

  /// Predicates.
  // Composers.
  all: (...preds) => {
    return x => preds.every(p => p(x));
  },

  any: (...preds) => {
    return x => preds.some(p => p(x));
  },

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
}
