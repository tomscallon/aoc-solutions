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

exports.permutations = permutations;
exports.summations = summations;
