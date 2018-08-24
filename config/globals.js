//globals.js

var globals={

  app: null,
  port: process.env.PORT || 3000,
  db: null,

  login: function (req, res, next) {
    next(); //to avoid login function
/*
    if (!req.user) {
      console.log('login ');
      return res.redirect('/');
      //res.redirect('/');
    } else {
      console.log('login '+req.user.name);
      next();
    }
*/
  },

  echo: function (err, res, respVal=null) {
    respVal=(err)?{error: err.message}:(typeof respVal==='string')?{error: respVal}:respVal;
    console.log(respVal);
    res.json(respVal);
  }

}

module.exports=globals;
