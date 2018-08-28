//users.ctrl.js

const g=require('../config/globals.js');
const table=require(`../config/${g.dbCommFile}.js`);
const l=require('../config/login.js');

exports.form=function (req, res) {
  res.render('users.ejs', {username: req.session.user.name});
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
  l.login(req ,res);
}