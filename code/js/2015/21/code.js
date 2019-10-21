// Tom Scallon. Advent of Code 2015, day 21.

// Read in input.
const RE = /Hit Points: \d+\nDamage: \d+\nArmor: \d+/;

let [_, hp, dmg, arm] = RE.exec(
  require('fs').readFileSync(__dirname + '/input.txt', 'utf8').trim()
);

[hp, dmg, arm] = [+hp, +dmg, +arm];

const RE_CATEGORY_HEAD = /^([A-Za-z]+):\s+([A-Za-z]+)\s+([A-Za-z]+)\s+([A-Za-z]+)$/;
const RE_CATEGORY_ITEM = /^([A-Za-z]+(\s\+\d)?)\s\s+(\d+)\s+(\d+)\s+(\d+)$/;
const parseCategory = str => {
  let [head, ...items] = str.split('\n');
  console.log(head, items);
  const [_, name, p1, p2, p3] = RE_CATEGORY_HEAD.exec(head);
  items = items
    .map(i => RE_CATEGORY_ITEM.exec(i))
    .map(([, name,, a, b, c]) => ({
      name,
      [p1]: +a,
      [p2]: +b,
      [p3]: +c,
    }));

  return {name, items};
};

const id = x => x;
const collapse = (p, f = id) => (g, o) => ((g[o[p]] = f(o)), g);
const pick = p => o => o[p];

const shop =
`Weapons:    Cost  Damage  Armor
Dagger        8     4       0
Shortsword   10     5       0
Warhammer    25     6       0
Longsword    40     7       0
Greataxe     74     8       0

Armor:      Cost  Damage  Armor
Leather      13     0       1
Chainmail    31     0       2
Splintmail   53     0       3
Bandedmail   75     0       4
Platemail   102     0       5

Rings:      Cost  Damage  Armor
Damage +1    25     1       0
Damage +2    50     2       0
Damage +3   100     3       0
Defense +1   20     0       1
Defense +2   40     0       2
Defense +3   80     0       3`.split('\n\n')
  .map(parseCategory)
  .reduce(collapse('name', pick('items')), {});

// Part 1 code.
const p1 = () => {
  throw 'Not yet implemented';
};

// Part 2 code.
const p2 = () => {
  throw 'Not yet implemented';
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
