var MD5 = require("./util/md5");
var KEY = "ckczppom";
var DESIRED = "000000";
var i = 1;

while( true ) {
  if( ("" + MD5( KEY + i )).substring( 0, 6 ) === DESIRED ) {
    break;
  }

  i++;
}

console.log( i );