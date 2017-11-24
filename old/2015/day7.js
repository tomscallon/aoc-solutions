var input = require("fs").readFileSync("day7-2-input.txt").toString();

var reInstr = /([a-z0-9]*?)\s?(|AND|OR|NOT|LSHIFT|RSHIFT)\s?([a-z0-9]+)\s->\s([a-z]+)/;

var processInstruction = function( text ) {
  var result = reInstr.exec( text ),
      op   = result[ 2 ],
      arg1 = result[ 1 ];

  return {
    op:   op   === "" ? "SET" : op,
    arg1: arg1 === '' ? undefined : isNaN( arg1 ) ? arg1 : +arg1,
    arg2: result[ 3 ],
    dest: result[ 4 ]
  };
};

var ops = {
  "SET": function( undef, val ) {
    return val;
  },

  "AND": function( val1, val2 ) {
    return val1 & val2;
  },

  "OR": function( val1, val2 ) {
    return val1 | val2;
  },

  "NOT": function( undef, val ) {
    return ~val;
  },

  "LSHIFT": function( val, shift ) {
    return val << shift;
  },

  "RSHIFT": function( val, shift ) {
    return val >> shift;
  }
};

var circuit = {
  deps: {},
  vals: {},

  addDep: function( wire, depWire ) {
    if( !isNaN( depWire ) || depWire === undefined ) return;

    ( circuit.deps[ depWire ] || ( circuit.deps[ depWire ] = [] ) ).push( wire );
  },
  
  isComputable: function( wire ) {
    var info = circuit.vals[ wire ];
    
    return ( info.arg1 === undefined || !isNaN( info.arg1 ) || !isNaN( circuit.vals[ info.arg1 ] ) )
        && ( !isNaN( info.arg2 ) || !isNaN( circuit.vals[ info.arg2 ] ) );
  },

  compute: function( wire ) {
    var info = circuit.vals[ wire ],
        arg1 = isNaN( info.arg1 ) ? circuit.vals[ info.arg1 ] : +(info.arg1),
        arg2 = isNaN( info.arg2 ) ? circuit.vals[ info.arg2 ] : +(info.arg2);
    console.log("Computing %s as %s( %s, %s )", wire, info.op, arg1, arg2);
    circuit.vals[ wire ] = ops[ info.op ]( arg1, arg2 );
  },

  check: function( wire ) {
    if( !circuit.isComputable( wire ) ) return;

    circuit.compute( wire );

    (circuit.deps[ wire ] || []).forEach( circuit.check );

    delete circuit.deps[ wire ];
  },

  wire: function( instr ) {
    circuit.vals[ instr.dest ] = {
      op:   instr.op,
      arg1: instr.arg1,
      arg2: instr.arg2
    };

    circuit.addDep( instr.dest, instr.arg1 );
    circuit.addDep( instr.dest, instr.arg2 );

    circuit.check( instr.dest );
  }
};

input.split("\n")
  .map( processInstruction )
  .forEach( circuit.wire );

console.log( circuit.vals.a );