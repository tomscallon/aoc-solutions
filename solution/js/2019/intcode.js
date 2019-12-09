const getVal = (v, m, mem) => m == '0'
  ? +mem[v] || 0
  : m === '1'
  ? v
  : +mem[v + mem.rb] || 0;

const getSetAddress = (v, m, mem) =>
  m == '0' ? v : v + mem.rb;

const AWAITING_INPUT = {};

/**
 * Set of instructions understood in intcode.
 *
 * Format:
 *  {[code]: {np, run}}
 * Where:
 *   code (number): the op code
 *   np (number): the number of parameters
 *   run ((mem, params) => boolean): how to execute the instruction
 *     mem is a reference to VM memory
 *     params are the captured params
 *     return true if the program should continue execution, false otherwise
 */
const OPS = {
  1: {
    np: 3,
    run: (mem, [[o1, m1], [o2, m2], [r, mr]]) => {
      mem[getSetAddress(r, mr, mem)] = '' + (getVal(o1, m1, mem) + getVal(o2, m2, mem));
      return true;
    }
  },
  2: {
    np: 3,
    run: (mem, [[o1, m1], [o2, m2], [r, mr]]) => {
      mem[getSetAddress(r, mr, mem)] = '' + (getVal(o1, m1, mem) * getVal(o2, m2, mem));
      return true;
    }
  },
  3: {
    np: 1,
    run: (mem, [[o, m]], _, inputs) => {
      if (inputs.length === 0) {
        return AWAITING_INPUT;
      }
      mem[getSetAddress(o, m, mem)] = inputs.shift();
      return true;
    }
  },
  4: {
    np: 1,
    run: (mem, [[o, m]]) => {
      return getVal(o, m, mem);
    }
  },
  5: {
    np: 2,
    run: (mem, [[o1, m1], [o2, m2]], setip) => {
      if (getVal(o1, m1, mem)) {
        setip(getVal(o2, m2, mem));
      }
      return true;
    }
  },
  6: {
    np: 2,
    run: (mem, [[o1, m1], [o2, m2]], setip) => {
      if (!getVal(o1, m1, mem)) {
        setip(getVal(o2, m2, mem));
      }
      return true;
    }
  },
  7: {
    np: 3,
    run: (mem, [[o1, m1], [o2, m2], [r, mr]]) => {
      mem[getSetAddress(r, mr, mem)] = getVal(o1, m1, mem) < getVal(o2, m2, mem) ? 1 : 0;
      return true;
    },
  },
  8: {
    np: 3,
    run: (mem, [[o1, m1], [o2, m2], [r, mr]]) => {
      mem[getSetAddress(r, mr, mem)] = getVal(o1, m1, mem) == getVal(o2, m2, mem) ? 1 : 0;
      return true;
    },
  },
  9: {
    np: 1,
    run: (mem, [[o1, m1]], _ip, _in, adjustrb) => {
      adjustrb(getVal(o1, m1, mem));
      return true;
    },
  },
  99: {
    np: 0,
    run: () => false,
  }
};

module.exports = function*(memory, inputs) {
  let ip = 0;
  let cont = true;
  const outputs = [];

  // HACK!
  memory.rb = 0;

  while (cont) {
    const inst = memory[ip];
    const opcode = +inst.substring(inst.length - 2);
    const paramModes = inst.substring(0, inst.length - 2)
      .split('').reverse();
    const {np, run} = OPS[opcode];
    let ipset = false;
    cont = run(
      memory,
      memory
        .slice(ip + 1, ip + np + 1)
        .map((v, i) => [+v, paramModes[i] || '0']),
      newip => {
        ip = newip;
        ipset = true;
      },
      inputs,
      val => memory.rb += val,
    );

    if (cont === AWAITING_INPUT) {
      const newIn = yield outputs;
      inputs.push(newIn);
      continue;
    }

    if (!ipset) {
      ip += np + 1;
    }

    if (typeof cont !== 'boolean') {
      outputs.push(cont);
      cont = true;
    }
  }

  return [memory, outputs];
}
