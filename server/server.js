require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const { authenticate } = require('./middleware/authenticate');

// fetch ./db/mongoose.js's local variable by destructing
var { mongoose } = require('./db/mongoose');

// fetch Todo variable
var { Todo } = require('./models/todo');

// fetch User veriable
var { User } = require('./models/user');

var app = express();
const port = process.env.PORT;

// middleware of express
app.use(bodyParser.json());

// POST /todos
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed
  });

  todo.save().then((doc) => {
    res.send(doc);
  }).catch(e => {
    res.status(400).send(e);
  });
});

// GET /todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    // { todos: todos }
    res.send({ todos });
  }).catch(e => {
    res.status(400).send(e);
  });
})

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
  // console.log(req.params);
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
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

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(400).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({ todo });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(400).send();
  }

  // modify body object before patching
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  // console.log(body);

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({ todo });
  }).catch((e) => {
    res.status(400).send(e);
  });
})

// POST /users
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      // custom header with x prefix
      res.header('x-auth', token).send(user.toJSON());
    })
    .catch(e => {
      console.log(e);
      res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };
