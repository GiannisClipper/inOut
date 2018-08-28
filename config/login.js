//login.js

const g=require('../config/globals.js');

module.exports={

  login: function (req, res) { //login > login1 >login>2
    new Promise((resolve, reject)=> module.exports.login1(req, res, result=> resolve(result)))
    .then(result=> result===null?new Promise((resolve, reject)=> module.exports.login2(req, res, result=> resolve(result))):result)
    .then(result=> g.echo(null, res, result===null?'Τα στοιχεία χρήστη δεν είναι έγκυρα':result))
    .catch(err=> g.echo(err, res));
  },

  authent: function (req, res, next) { //authent > authent1 >login>2
    if (req.session && req.session.user) {
      console.log('authent user '+req.session.user.name);
      req.body.name=req.session.user.name;
      new Promise((resolve, reject)=> module.exports.authent1(req, res, result=> resolve(result)))
      .then(result=> result===null?new Promise((resolve, reject)=> module.exports.login2(req, res, result=> resolve(result))):result)
      .then(result=> result===null?module.exports.loginExpired(req, res):next())
      .catch(err=> g.echo(err, res));
    } else
      module.exports.loginExpired(req, res);
  },

  login1: function (req, res, callback) {
    g.db.query(`SELECT name, level FROM users WHERE name=$1 AND password=$2`, [req.body.name, req.body.password], (err, result)=> {
      if (result && result.rows.length>0) {
        module.exports.updateUser(req, res, result.rows[0]);
        callback(result.rows);
      } else
        callback(null);
    });
  },

  login2: function (req, res, callback) {
    g.db.query(`SELECT name, level FROM users`, (err, result)=> {
      let pseudoUser={name:req.body.name, level:'admin'};
      if (!result || result.rows.length===0) {
        module.exports.updateUser(req, res, pseudoUser);
        callback(pseudoUser);
      } else
        callback(null);
    });
  },

  authent1: function (req, res, callback) {
    g.db.query(`SELECT name, level FROM users WHERE name=$1`, [req.session.user.name], (err, result)=> {
      if (result && result.rows.length>0) {
        module.exports.updateUser(req, res, result.rows[0]);
        callback(result.rows);
      } else
        callback(null);
    });
  },

  updateUser: function (req, res, user) {
    req.user=user;
    req.session.user=user; //sets a cookie with the user's info
    res.locals.user=user;
  },

  loginExpired: function (req, res) {
    console.log(req.session);
    console.log(req.session?req.session.user:'');
    console.log('login expired');
//    if (req.method==="GET") return res.redirect('/'); else 
    g.echo(null, res, 'Λήξη πιστοποιημένης διάρκειας, παρακαλώ συνδεθείται ξανά.');
  },

  logout: function (req, res) {
    req.session.user=null;
  },

  noGuest: function (req, res, next) {
    if (req.session.user.level==='guest')
      g.echo(null, res, `Στις δυνατότητες πρόσβασης σε επίπεδο επισκέπτη/guest
δεν περιλαμβάνεται η καταχώριση νέων εγγραφών καθώς 
και η τροποποίηση ή διαγραφή υφιστάμενων.`);
    else 
      next();
  }

}