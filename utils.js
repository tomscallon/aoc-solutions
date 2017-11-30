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

exports.permutations = permutations;
