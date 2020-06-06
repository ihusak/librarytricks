const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const db = require('./src/backend/config/db');
const dbName = 'librarytricks_db';

app.use(bodyParser.urlencoded({ extended: true }));

const port = 8000;
MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  console.log(database.db(dbName));
  require('./src/backend/routes')(app, database.db(dbName));
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})