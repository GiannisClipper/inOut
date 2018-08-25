//globals.js

var globals={

  app: null,
  port: process.env.PORT || 3000,
  dbConfig: 'pg', //sqlite3 για liteSQL ή pg για postgreSQL
  dbName: 'inout',
  db: null,

  noGuest: function (req, res, next) {
    if (req.session.user.level==='guest')
      globals.echo(null, res, `Στα δικαιώματα πρόσβασης του χρήστη (επίπεδο επισκέπτη/guest)
δεν περιλαμβάνεται η καταχώριση νέων εγγραφών καθώς 
και η τροποποίηση ή διαγραφή υφιστάμενων.`);
    else 
      next();
  },

  login: function (req, res, next) {
    if (req.session && req.session.user) {
      console.log('authenticating user '+req.session.user.name);
      globals.db.query(`SELECT name, level FROM users WHERE name=$1`, [req.session.user.name], function(err, result) {
        if (result && result.rows.length>0) {
          req.user=result.rows[0]; //delete req.user.password; // delete the password from the session
          req.session.user=req.user; //refresh the session value
          res.locals.user=req.user;
          // finishing processing the middleware and run the route
          next();
        } else {
          console.log('login ');
          if (req.method==="GET") return res.redirect('/');
          else globals.echo(err, res, 'Η διάρκεια πιστοποίησης της πρόσβασής σας έληξε,\n παρακαλώ συνδεθείται ξανά.');
        }
      });
    } else {
      console.log('login ');
      if (req.method==="GET") return res.redirect('/');
      else globals.echo(null, res, 'Η διάρκεια πιστοποίησης της πρόσβασής σας έληξε,\n παρακαλώ συνδεθείται ξανά.');
    }
  },

  logout: function (req, res) {
    req.session.user=null;
  },

  echo: function (err, res, respVal=null) {
    respVal=(err)?{error: err.message}:(typeof respVal==='string')?{error: respVal}:respVal;
    console.log(respVal);
    res.json(respVal);
  }
}

module.exports=globals;