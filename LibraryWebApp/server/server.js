// Get dependencies
let express = require('express');
var cookieParser = require('cookie-parser');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let path = require('path');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let helmet = require('helmet');
let mongo=require("mongodb").MongoClient;
let cors = require("cors");

let config = require('./config');

let init = async () => {

  try {
    let client = await mongo.connect(config.pool);
    let database = client.db('LibraryDB');
    initServer(database);
  } catch (e) {
    console.error('Problem connecting to database');
  }


};

let initServer = (database) => {

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(express.json());

  app.use(express.static(path.join(__dirname+ '/public/app/')));
  app.use(helmet());
  app.use(function(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
    next();
  });

  app.use(morgan('dev'));
  app.use(cookieParser());

  let authRouter = require('./app/routes/authenticate')(app,express,database,jwt,config.secret, bcrypt);
  app.use('/authenticate', authRouter);

  let usersRouter = require('./app/routes/users')(app,express,database, jwt, config.secret);
  app.use('/users', usersRouter);
  let booksRouter = require('./app/routes/books')(app,express,database, jwt, config.secret);
  app.use('/books', booksRouter);
  let borrowedRouter = require('./app/routes/borrowed')(app,express,database, jwt, config.secret);
  app.use('/borrowed', borrowedRouter);
  let classificationRouter = require('./app/routes/classification')(app,express,database, jwt, config.secret);
  app.use('/classification', classificationRouter);


  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/'));
  });


  app.listen(config.port);

  console.log('Running on port ' + config.port);
};

init();
