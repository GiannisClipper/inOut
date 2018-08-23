//users.ctrl.js

var path=require("path");
var g=require('../config/globals.js');

exports.form=function (req, res) {
  res.render('users.ejs',{username: req.session.user.name});
}

exports.create=function (req, res) {
  g.db.run(`INSERT INTO users (name, password) VALUES (?,?)`, req.body.name, req.body.password, function(err) {
    if (err) return (g.echo(res, err.message),false);
    g.echo(res, "Insert operation completed "+req.body.name);
  });
}

exports.modify=function (req, res) {
  g.db.run(`UPDATE users SET name=?, password=? WHERE name=?`, req.body.name, req.body.password, req.params.id, function(err) {
    if (err) return (g.echo(res, err.message),false);
    g.echo(res, "Update operation completed "+req.params.id);
  });
}

exports.delete=function (req, res) {
  g.db.run(`DELETE FROM users WHERE name=?`, req.params.id, function(err) {
    if (err) return (g.echo(res, err.message),false);
    g.echo(res, "Delete operation completed "+req.params.id);
  });
}

exports.view=function (req, res) {
  g.db.get(`SELECT * FROM users WHERE name=?`, req.body.name, function(err, row) {
    if (err) return (g.echo(res, err.message),false);
    g.echo(res,(!row)?"Record not found":row);
  });
}

exports.list=function (req, res) {
  g.db.all(`SELECT * FROM users`, function(err, rows) {
    if (err) return (g.echo(res, err.message),false);
    g.echo(res,(rows.length==0)?"No records found":rows);
  });
}

exports.signin=function (req, res) {
  g.db.get(`SELECT * FROM users WHERE name=?`, req.body.name, function(err, record) {
    if (!record) {
      res.send('');
    } else {
      req.session.user=record; //sets a cookie with the user's info
      res.render('genres.ejs',{username: req.session.user.name});

    } 
  });

}