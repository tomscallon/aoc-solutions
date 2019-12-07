const getVal = (v, m, mem) => m == '0' ? +mem[v] : v;

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
    run: (mem, [[o1, m1], [o2, m2], [r]]) => {
      mem[r] = '' + (getVal(o1, m1, mem) + getVal(o2, m2, mem));
      return true;
    }
  },
  2: {
    np: 3,
    run: (mem, [[o1, m1], [o2, m2], [r]]) => {
      mem[r] = '' + (getVal(o1, m1, mem) * getVal(o2, m2, mem));
      return true;
    }
  },
  3: {
    np: 1,
    run: (mem, [[o]], _, inputs) => {
      if (inputs.length === 0) {
        return AWAITING_INPUT;
      }
      mem[o] = inputs.shift();
      return true;
    }
  },
  4: {
    np: 1,
    run: (mem, [[o]]) => {
      return mem[o];
    }
  },
  5: {
    np: 2,
    run: (mem, [[o1, m1], [o2, m2]], setip) => {
      if (getVal(o1, m1, mem)) {
        setip(getVal(o2, m2, mem));
      }
    }
  },
  6: {
    np: 2,
    run: (mem, [[o1, m1], [o2, m2]], setip) => {
      if (!getVal(o1, m1, mem)) {
        setip(getVal(o2, m2, mem));
      }
    }
  },
  7: {
    np: 3,
    run: (mem, [[o1, m1], [o2, m2], [r]]) => {
      mem[r] = getVal(o1, m1, mem) < getVal(o2, m2, mem) ? 1 : 0;
    },
  },
  8: {
    np: 3,
    run: (mem, [[o1, m1], [o2, m2], [r]]) => {
      mem[r] = getVal(o1, m1, mem) == getVal(o2, m2, mem) ? 1 : 0;
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

  while (cont) {
    const inst = memory[ip];
    const opcode = +inst.substring(inst.length - 2);
    const paramModes = inst.substring(0, inst.length - 2)
      .split('').reverse().join('');
    //console.log(ip, inst, opcode, paramModes, memory.slice(0, 10));
    const {np, run} = OPS[opcode];
    let ipset = false;
    //console.error('Inputs are', inputs);
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
