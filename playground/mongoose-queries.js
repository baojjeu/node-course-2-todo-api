const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

// var id = '5832ce808207386e39188bc9';

// if (!ObjectID.isValid(id)) {
//   console.log('ID is not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos:', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo:', todo)
// });
//

// Todo.findById(id).then((todo) => {
//   console.log('Todo By Id', todo)
// }).catch((e) => console.log(e));

// User.findById(id).then((user) => {
//   console.log('User: ', user.email);
// });
