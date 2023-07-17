const createError = require('http-errors');
const express = require('express');
const {sequelize} = require("./db/models");
const logger = require('morgan');

const photoRouter = require('./routes/photos');
const captionRouter = require('./routes/captions');
const userRouter = require('./routes/users');
const makeSwaggerDocs = require('./utils/swagger');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/photos', photoRouter);
app.use('/captions', captionRouter);
app.use('/users', userRouter);

// Create /doc route for api documentation
makeSwaggerDocs(app)

app.use('/', function (req, res) {
  res.status(200).send("The Application is running. Please go to /docs to see what operation you can perform")
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // send the error message as JSON
  res.status(err.status || 500);
  res.json({
    error: err.message
  });
});

const port = process.env.PORT || 5000;
app.listen({port: port}, async () => {
    console.log(`Server up on http://localhost:${port}`)
    await sequelize.authenticate()
    console.log("Database Connected!")
})


