var express = require('express');
var massive = require('massive');
var bodyParser = require('body-parser');
var connectionString = 'postgres://yadaguru:yadaguru@localhost:15432/yadaguru'; // TODO: Move to ENV variable with file backup

var app = module.exports = express();

// connect to Massive and get DB, loading tables, functions, ect
var massiveInstance = massive.connectSync({ connectionString : connectionString });

// Set a reference to the massive instance on app
app.set('db', massiveInstance);

var router = express.Router();

router.get('/', function(req, res) {

  res.status(200).send('foobar');

});

app.use(bodyParser.json());

app.use('/', router);

// Setup routes
app.use('/api/categories', require('./controllers/categoriesController'));
app.use('/api/timeframes', require('./controllers/timeframesController'));
app.use('/api/reminders', require('./controllers/remindersController'));
app.use('/api/schools', require('./controllers/schoolsController'));
app.use('/api/base-reminders', require('./controllers/baseRemindersController'));
app.use('/api/tests', require('./controllers/testsController'));
app.use('/api/test-dates', require('./controllers/testDatesController'));

app.use('/api/users', require('./routes/usersRoute'));

app.listen(3005, function () {
  console.log('Running on PORT: ' + 3005);
});