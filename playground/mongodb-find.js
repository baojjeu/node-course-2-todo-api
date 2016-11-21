const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.', err);
  }

  console.log('Connected to MongoDB server.');

  db.collection('Users').find({ name: 'Baozi Wu' }).toArray().then((docs) => {
    // console.log(`Todos count: ${count}`);
    console.log('Users');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch users', err);
  });

  db.close();
});
