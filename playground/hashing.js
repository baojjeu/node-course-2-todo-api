const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
// const text = "i am baozi wu";
// const hash = SHA256(text);
//
// console.log(`after hashed is ${hash}`);

const data = {
  id: 5
}

const token = jwt.sign(JSON.stringify(data), 'baozi');
console.log(token);

const decoded = jwt.verify(token, 'baozi');
console.log(decoded);
