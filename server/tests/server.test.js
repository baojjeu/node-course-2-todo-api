const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, users, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) return done(err);

        Todo.findOne({ text }).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });

  });

});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get specific todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return specific todo created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var id = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  })

  it('should return 400 if todo is invalid', (done) => {
    var id = '123';

    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done);
  })
})

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch(e => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 400 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123avc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done);
  });
})

describe('PATCH /todos/:id', () => {
  it('should update todo', (done) => {
    let hexId = todos[0]._id.toHexString();
    let text = "this is the revised version";

    request(app)
      .patch(`/todos/${ hexId }`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ text, completed: true })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('this is the revised version');
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text = "i am editing the second todo";

    request(app)
      .patch(`/todos/${ hexId }`)
      .set('x-auth', users[1].tokens[0].token)
      .send({ text, completed: false })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('i am editing the second todo');
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token) // set header
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', 'abbabba')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = 'example@gmail.com';
    let password = 'abc123';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) return done(err);

        User.findOne({ email }).then(user => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
        });

        done()
      });
  });

  it('should return validation errors if request is invalid', (done) => {
    request(app)
      .post('/users')
      .send({ email: 'abc', password: '123' })
      .expect(400)
      .end(done);
  });

  it('should not create user if email is in user', (done) => {
    request(app)
      .post('/users')
      .send({ email: users[0].email, password: 'abccc2' })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send(
        {
          email: users[1].email,
          password: users[1].password
        }
      )
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        User.findById(users[1]._id).then(user => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        });
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send(
        {
          email: users[1].email,
          password: '234234324'
        }
      )
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        User.findById(users[1]._id).then(user => {
          expect(user.tokens.length).toBe(1);
          done();
        });
      });
  });
})

describe('DELETE /users/me/token', () => {
  it('should delete token', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end((err, res) => {
        if (err) return done(err);

        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });
});
