//server.js

var g=require('./config/globals.js');
var express=require('express');
g.app=express();

//middleware to pass data on post requests
var bodyParser=require('body-parser');
g.app.use(bodyParser.urlencoded({ extended: true })); //false?
g.app.use(bodyParser.json());

//options to enable cross origin requests
//g.app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
//});

//middleware for login-authentication
var session=require('client-sessions');
g.app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here_and_is_better_to_use_bcrypt',
  duration: 15*60*1000,
  activeDuration: 15*60*1000,
}));

g.app.engine('html', require('ejs').renderFile);
g.app.set('view engine', 'html');

var path=require("path");
g.app.use(express.static(__dirname+'/public'));


console.log("Greetings from inOut application");
g.app.use((req, res, next)=> {console.log(req.url); next();});

var info=require('./routes/info.routes.js');
g.app.use('/info', info);

var trans=require('./routes/trans.routes.js');
g.app.use('/trans', trans);

var genres=require('./routes/genres.routes.js');
g.app.use('/genres', genres);

var funds=require('./routes/funds.routes.js');
g.app.use('/funds', funds);

var users=require('./routes/users.routes.js');
g.app.use('/users', users);

var etc=require('./routes/etc.routes.js');
g.app.use('/', etc);


new Promise(async (resolve, reject)=>{
  console.log(`Connecting to database...`);
  let tmp=await require(`./config/${g.dbConfigFile}.js`).setup();
  //console.log(g.db);
  resolve();
})
.then(result=>{
  g.app.listen(g.port, function() {console.log('Listening on port '+g.port+'...');});
});
