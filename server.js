//server.js

var g=require('./config/globals.js');
var express=require('express');
g.app=express();

//middleware to pass data on post requests
var bodyParser=require('body-parser');
g.app.use(bodyParser.urlencoded({ extended: true })); //false?
g.app.use(bodyParser.json());

//options to enable cross origin requests
g.app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//middleware for login-authentication
var session=require('client-sessions');
g.app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here_better_use_bcrypt',
  duration: 15*60*1000,
  activeDuration: 15*60*1000,
}));

g.app.use(function(req, res, next) {
  console.log(req.url);
  next();
});

console.log("Greetings from inOut application");

g.app.engine('html', require('ejs').renderFile);
g.app.set('view engine', 'html');

var path=require("path");
g.app.use(express.static(__dirname+'/public'));

var users=require('./routes/users.routes.js');
g.app.use('/users', users);

var genres=require('./routes/genres.routes.js');
g.app.use('/genres', genres);

var funds=require('./routes/funds.routes.js');
g.app.use('/funds', funds);

var trans=require('./routes/trans.routes.js');
g.app.use('/trans', trans);

g.app.use('/', function (req, res) {g.logout(req, res); res.render('index.ejs');});

new Promise(async (resolve, reject)=>{
  console.log(`Connecting to database (${g.dbConfig})...`);
  let tmp=await require(`./config/db_${g.dbConfig}.js`).setup();
  //console.log(g.db);
  resolve();
})
.then(result=>{
  g.app.listen(g.port, function() {console.log('Listening on port '+g.port+'...');});
});
