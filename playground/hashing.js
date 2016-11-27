const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const text = "i am baozi wu";
// const hash = SHA256(text);
//
// console.log(`after hashed is ${hash}`);

// const data = {
//   id: 5
// }
//
// const token = jwt.sign(JSON.stringify(data), 'baozi');
// console.log(token);
//
// const decoded = jwt.verify(token, 'baozi');
// console.log(decoded);

// const password = 'abc1234';
//
// bcrypt.genSalt(5, (err, salt) => {
//   bcrypt.hash('')
// })
