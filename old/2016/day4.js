// So I can copy this without having to change the day constantly.
const _day = process.argv[1].split('/').pop().split('.')[0];
const input = require("fs").readFileSync(`${_day}-input.txt`).toString();
const lines = input.split('\n').filter(x => !!x);

const regex = /^([a-z-]+)-(\d+)\[([a-z]{5})\]$/;
const parse = str => {
  let [, name, sector, checksum] = regex.exec( str );
  return { name, sector, checksum };
};

const parsedLines = lines.map( parse );

const reduce = [].reduce;
const letterCountReducer = (obj, char) => {
  obj[ char ] = ( obj[ char ] || 0 ) + 1;
  return obj;
};
const letterCount = str => {
  let counts = reduce.call( str, letterCountReducer, {} );
  return Object.keys( counts )
    .map(letter => ({
      letter,
      count: counts[ letter ]
    }));
}
const firstSortedN = (sorter, n) => arr =>
  [...arr].sort( sorter ).slice(0, n);

// Day 1

const byCountThenByLetter = (
  { letter: letterA, count: countA }, { letter: letterB, count: countB }) =>
  countA === countB ?
    letterA.charCodeAt(0) - letterB.charCodeAt(0) :
    countA - countB;

const first5 = firstSortedN( byCountThenByLetter, 5 );

const isValid = ({ name, checksum }) =>
  first5( letterCount( name ) )
    .map(({ letter }) => letter)
    .join('') === checksum;

const sectorSum = parsedLines
  .filter( isValid )
  .reduce((sum, { sector: s }) => sum + s, 0);

console.log( sectorSum );
