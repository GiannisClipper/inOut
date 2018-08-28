//funds.ctrl.js

const g=require('../config/globals.js');
const table=require(`../config/${g.dbCommFile}.js`);

exports.form=function (req, res) {
  res.render('funds.ejs', {username: req.session.user.name});
}

exports.new=function (req, res) {
  table.new('funds', req, res);
}

exports.modify=function (req, res) {
  table.modify('funds', req, res);
}

exports.delete=function (req, res) {
  table.delete('funds', req, res);
}

exports.find=function (req, res) {
  table.find('funds', `id, code, name, CASE WHEN icon LIKE '%' THEN '...' ELSE '' END icon`, req, res);
}

exports.count=function (req, res) {
  table.count('funds', req, res);
}

exports.icon=function (req, res) {
  table.icon('funds', req, res);
}