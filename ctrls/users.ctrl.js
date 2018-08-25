//users.ctrl.js

const g=require('../config/globals.js');
const table=require(`../config/dbtable_${g.dbConfig}.js`);

exports.form=function (req, res) {
  res.render('users.ejs'); //,{username: req.session.user.name});
}

exports.new=function (req, res) {
  table.new('users', req, res);
}

exports.modify=function (req, res) {
  table.modify('users', req, res);
}

exports.delete=function (req, res) {
  table.delete('users', req, res);
}

exports.find=function (req, res) {
  table.find('users', `id, name, password, level, CASE WHEN icon LIKE '%' THEN '...' ELSE '' END icon`, req, res);
}

exports.count=function (req, res) {
  table.count('users', req, res);
}

exports.icon=function (req, res) {
  table.icon('users', req, res);
}

exports.login=function (req, res) {
  g.db.query(`SELECT name, level FROM users WHERE name=$1 AND password=$2`, [req.body.name, req.body.password], (err, result)=> {
    if (result && result.rows.length>0)
      req.session.user=result.rows[0]; //sets a cookie with the user's info
    g.echo(err, res, (!result || result.rows.length===0)?'No user match':result.rows);
  });
}

//  g.db.get(`SELECT * FROM users WHERE name=?`, req.body.name, function(err, record) {
//    if (!record) {
//      res.send('');
//    } else {
//      req.session.user=record; //sets a cookie with the user's info
//      res.render('genres.ejs',{username: req.session.user.name});
//    } 
//  });