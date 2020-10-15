const express = require('express');
const app = express();
const expbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
console.log('Enabling CORS');
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With'); // Add other headers used in your requests

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});


app.use(express.static('assets'));
app.use(express.static('node_modules'));
app.use(express.static('plugins'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.engine('handlebars', expbs());
app.set('view engine', 'handlebars');
app.use(session({
  secret: 'APP_SECRET',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/api', require('./routes/api')); // call api function
app.use('/', require('./routes/web'));// call web functions
app.listen(process.env.PORT || 9999);
