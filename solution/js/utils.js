const range = (max, min = 0) =>
  max === min ?
    [min] :
    [...range(max - 1, min), max];

const repeat = (x, n) => n === 0 ? [] : [x].concat(repeat(x, n - 1));

const permutations = (arr) => {
  if (arr.length === 0) {
    return [];
  } else if (arr.length === 1) {
    return [[arr[0]]];
  }

  let perms = [];

  for (let i = 0; i < arr.length; i++) {
    const tail = arr[i];
    const headPerms = permutations(arr.slice(0, i).concat(arr.slice(i + 1)));

    perms = perms.concat(headPerms.map(arr => arr.concat(tail)));
  }

  return perms;
};

/**
 * Returns all summations of n natural numbers that sum to x, along with
 * their permutations. (For example, [1, 2] and [2, 1] are both returned for
 * summations(2, 3)).
 *
 * To avoid this functionality, set `unique` option to `true` -- then, only
 * unique combinations are returned.
 *
 * There are also `min` and `max` options, which default to `0` and `n`,
 * respectively. Use these to control the allowable range of numbers
 * included in the sum.
 */
function* summations(n, x, {unique = false, min = 0, max = x} = {}) {
  if (n === 0) {
    // No way to sum 0 numbers.
    return;
  } else if (n === 1) {
    // If x is an allowable number, then our only option is [x].
    // Otherwise, there's no way to sum 1 number to x.
    if (x >= min && x <= max) {
      yield [x];
    }
    return;
  }

  // Otherwise, run recursively. For each allowable first number...
  for (let head = max; head >= min; head--) {
    // Get all summations, assuming `head` is the first number.
    const tailSums = summations(
      n - 1,    // one fewer numbers
      x - head, // remove the head
      {
        unique, // preserve the unique option
        min,    // preserve the min option
        max: unique ?
          // This is how we enforce uniqueness: each number can be no
          // larger than the number occurring before it.
          head :
          min >= 0 ?
            // This is an optimization. If `min` is nonnegative, then we can
            // never pass the requested total (`x`). Furthermore, if `min` is
            // positive, we must have space for the remaining `n - 1` numbers
            // for a summation to have a chance of being valid.
            x - head - (n - 1) * min :
            max
      }
    )

    // For each calculated valid sum...
    for (let sum of tailSums) {
      // Prepend the head and yield the resulting summation!
      yield [head, ...sum];
    }
  }
};

/**
 * Enumerates all summations to `x` involving only the numbers in `a`. For
 * example, summationsUsing([4, 3], 16) would yield [3, 3, 3, 3, 4] and
 * [4, 4, 4, 4], along with permutations of those options. We assume `x` and
 * every element of `a` to be positive.
 *
 * This function is a generator, and should be iterated using `for..of`.
 *
 * The options available are:
 *   `unique` -- if set to `true`, then permutations of options will not be
 *     returned. (Combinations are yielded rather than permutations.) Defaults
 *     to `false`.
 *   `repeat` -- if set to `false`, then numbers provided in `a` cannot be
 *     reused. For example, summationsUsing([4, 3], 16, {repeat = false}) would
 *     yield nothing, as 3 + 4 is 7 (not 16). When `repeat` is `true`, the
 *     elements of `a` are assumed to be unique. Defaults to `true`.
 *   `sorted` -- helper flag used when `unique` is `true`. You can also supply
 *     `true` here to indicate `a` is already sorted DESCENDING. Defaults to
 *     `false`.
 */
function* summationsUsing(a, x, {unique = false, repeat: _repeat = true, sorted = false} = {}) {
  if (x === 0) {
    // We met the required sum. Yield an empty array and exit.
    yield [];
    return;
  } else if (a.length === 0) {
    // If we have no options to add with, there
    // are no possible results.

    return;
  } else if (a.length === 1) {
    // If we have only one option, then the only way we have a
    // solution is if x is divisible by that option.
    if (_repeat && x % a[0] === 0 || x === a[0]) {
      yield repeat(a[0], x / a[0]);
    }

    return;
  }

  // Otherwise, we need to do this recursively.
  if (!sorted && unique) {
    // As in `summations`, if uniqueness is requested, we'll do
    // this by making any solution appear in descending order.
    // To achieve this, we must first sort the list of options.
    a = a.slice(0).sort((a, b) => b - a);
  }

  // For each option...
  for (let i = 0; i < a.length; i++) {
    const e = a[i];

    if (e > x) {
      // This option is too large. Skip it.
      continue;
    }

    const restSums = summationsUsing(
      unique ?
        // Enforcing unique results. This is done by only yielding solutions
        // whose elements are ordered descendingly. Thus, we slice the array
        // to only return elements to the right of the current one (since we
        // have sorted `a`). If we're not allowing repeats, we also exclude
        // the current element (hence the + 1 if `repeat` = `false`).
        a.slice(i + (_repeat ? 0 : 1)) :

        // Not enforcing uniqueness.
        _repeat ?
          // If we allow repeats, then we just submit the array of options as is.
          a :
          // If not, remove the used element before submitting the options.
          a.slice(0, i).concat(a.slice(i + 1)),
      x - e,

      // Preserve all options, except set `sorted` to `true`
      // to accelerate subsequent calls.
      {unique, repeat: _repeat, sorted: true}
    );

    // For each determined summation of x - e...
    for (let sum of restSums) {
      yield [e, ...sum];
    }
  }
}

function forEachPair(a, f) {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length; j++) {
      if (i !== j) {
        if (f([a[i], a[j]], [i, j], a) === false) {
          return;
        }
      }
    }
  }
}

// Provides all possibilities of picking `m` to `n` elements from the given list
// `a`, without repeating elements. TODO
function* mToNOf(a, m, n) {
  if (n < 0 || n < m || a.length < m) {
    return;
  }

  m = Math.max(m, 0);
  n = Math.min(n, a.length);

  // Decide: is a[0] included?
  // Yes:
  for (let rest of mToNof(a.slice(1), m - 1, n - 1)) {}

  // No:
}

const id = x => x;

function* yieldIterable(i, f = id) {
  for (let x of i) {
    yield f(x);
  }
}

function* crossProduct(h, ...t) {
  if (t.length === 0) {
    if (typeof h[Symbol.iterator] === 'function') {
      yield* yieldIterable(h, x => [x]);
    } else {
      yield [h];
    }
    return;
  }

  // Otherwise, perform cross product recursiely.
  const tailProduct = crossProduct(...t);
  const headItems = typeof h[Symbol.iterator] === 'function' ? h : [h];

  for (let tail of tailProduct) {
    for (let head of headItems) {
      yield [head, ...tail];
    }
  }
}

exports.range = range;
exports.repeat = repeat;
exports.permutations = permutations;
exports.summations = summations;
exports.summationsUsing = summationsUsing;
exports.forEachPair = forEachPair;
exports.crossProduct = crossProduct;
