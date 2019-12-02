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
    run: (mem, [o1, o2, r]) => {
      mem[r] = mem[o1] + mem[o2];
      return true;
    }
  },
  2: {
    np: 3,
    run: (mem, [o1, o2, r]) => {
      mem[r] = mem[o1] * mem[o2];
      return true;
    }
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
    const {np, run} = OPS[memory[ip]];
    cont = run(memory, memory.slice(ip + 1, ip + np + 1));
    ip += np + 1;
  }

  return memory;
}
