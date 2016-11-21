const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.', err);
  }

  console.log('Connected to MongoDB server.');

  // deleteMany
  // db.collection('Todos').deleteMany({ text: 'Eat lunch' }).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({ text: 'Eat lunch' }).then((result) => {
  //   console.log(result);
  // })

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({ text: 'Something to do' }).then((result) => {
  //   console.log(result)
  // });

  // db.collection('Users').deleteMany({ name: 'Chaeeun' }).then((result) => {
  //   console.log(result);
  // })

  db.collection('Users').findOneAndDelete({ _id: new ObjectID('5831b54bc45ff846f5d2bd89') }).then((result => {
    console.log(result);
  }));

  db.close();
});
