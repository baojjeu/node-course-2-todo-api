const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.', err);
  }

  console.log('Connected to MongoDB server.');

  // findOneAndUpdate
  // https://docs.mongodb.com/v3.2/reference/method/db.collection.findOneAndUpdate/
  db.collection('Todos').findOneAndUpdate(
    { _id: new ObjectID('583283acc195b4eb23702fb6') },
    { $set: { name: 'what the fuck is this' }},
    { returnOriginal: false }
  ).then((result) => {
    console.log(result);
  });

  // db.close();
});
