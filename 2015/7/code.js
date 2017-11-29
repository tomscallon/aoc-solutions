// Tom Scallon. Advent of Code 2015, day 7.

// Read in input.
const parseInstruction = i => {
  const [,, arg1, op, arg2, wire] = /^((\d+|[a-z]+) )?(|NOT|AND|OR|LSHIFT|RSHIFT)\s*(\d+|[a-z]+) -> ([a-z]+)$/.exec(i);

  return {
    op: op === '' ? 'SET' : op,
    arg1: isNaN(arg1) ? arg1 : +arg1,
    arg2: isNaN(arg2) ? arg2 : +arg2,
    wire,
  };
};

const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n')
  .map(parseInstruction);

const OPS = {
  SET:    (_, val) => val,
  NOT:    (_, val) => ~val,
  AND:    (val1, val2) => val1 & val2,
  OR:     (val1, val2) => val1 | val2,
  LSHIFT: (val, shift) => val << shift,
  RSHIFT: (val, shift) => val >> shift,
};

const Circuit = function() {
  this._vals = {};
  this._deps = {};
};

Circuit.prototype = {
  addDependent: function(wire, ofWire) {
    if (ofWire === undefined || !isNaN(ofWire)) return;

    (this._deps[ofWire] = this._deps[ofWire] || []).push(wire);
  },

  canEvaluate: function(wire) {
    const {arg1, arg2} = this._vals[wire];

    return isNaN(this._vals[wire]) && [arg1, arg2].every(
      arg => arg === undefined || !isNaN(arg) || !isNaN(this._vals[arg])
    );
  },

  evaluate: function(wireName) {
    const {op, arg1, arg2} = this._vals[wireName];

    this._vals[wireName] = OPS[op](
      isNaN(arg1) ? this._vals[arg1] : +arg1,
      isNaN(arg2) ? this._vals[arg2] : +arg2
    );
  },

  attemptEvaluation: function(wire) {
    if (!this.canEvaluate(wire)) return;

    this.evaluate(wire);

    if (this._deps[wire]) {
      this._deps[wire].forEach(this.attemptEvaluation.bind(this));
      delete this._deps[wire];
    }
  },

  addWire: function({op, arg1, arg2, wire}) {
    this._vals[wire] = {op, arg1, arg2};

    this.addDependent(wire, arg1);
    this.addDependent(wire, arg2);

    this.attemptEvaluation(wire);
  },

  getValue: function(wire) {
    return this._vals[wire];
  }
};

const circuit = new Circuit();

// Part 1 code.
const p1 = () => {
  input.forEach(circuit.addWire.bind(circuit));

  return circuit.getValue('a');
};

// Part 2 code.
const p2 = () => {
  input.forEach(i => {
    // Override wire 'b'.
    if (i.wire === 'b') {
      i = {
        op: 'SET',
        arg1: undefined,
        arg2: 3176,
        wire: 'b'
      };
    }

    circuit.addWire(i);
  });

  return circuit.getValue('a');
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
