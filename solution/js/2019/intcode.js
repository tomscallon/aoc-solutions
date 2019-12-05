const getVal = (v, m, mem) => m == '0' ? +mem[v] : v;

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
      //console.error(r, [o1, m1], getVal(o1, m1, mem), [o2, m2], getVal(o2, m2, mem));
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
    run: (mem, [[o]]) => {
      mem[o] = '5';
      return true;
    }
  },
  4: {
    np: 1,
    run: (mem, [[o]]) => {
      console.error(mem[o]);
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

module.exports = function(memory) {
  let ip = 0;
  let cont = true;

  while (cont) {
    const inst = memory[ip];
    const opcode = +inst.substring(inst.length - 2);
    const paramModes = inst.substring(0, inst.length - 2)
      .split('').reverse().join('');
    //console.log(ip, inst, opcode, paramModes, memory.slice(0, 10));
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
    );

    if (!ipset) {
      ip += np + 1;
    }

    if (typeof cont !== 'boolean') {
      console.log(cont);
      cont = true;
    }
  }

  return memory;
}
