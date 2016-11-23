var express = require('express');
var bodyParser = require('body-parser');
var { ObjectId } = require('mongodb');

// fetch ./db/mongoose.js's local variable by destructing
var { mongoose } = require('./db/mongoose');

// fetch Todo variable
var { Todo } = require('./models/todo');

// fetch User veriable
var { User } = require('./models/user');

var app = express();

// middleware of express
app.use(bodyParser.json());

// Create
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

// GET /todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    // { todos: todos }
    res.send({ todos });
  }, (err) => {
    res.status(400).send(e);
  })
})

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
  // console.log(req.params);
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send();
  }

  Todo.findById(id).then((todo) => {

    if (!todo) {
      res.status(404).send();
    }

    res.send({ todo });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = { app };
