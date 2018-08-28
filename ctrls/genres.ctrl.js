//genres.ctrl.js

const g=require('../config/globals.js');
const table=require(`../config/${g.dbCommFile}.js`);

exports.form=function (req, res) {
  res.render('genres.ejs', {username: req.session.user.name});
}

exports.new=function (req, res) {
  table.new('genres', req, res);
}

exports.modify=function (req, res) {
  table.modify('genres', req, res);
}

exports.delete=function (req, res) {
  table.delete('genres', req, res);
}

exports.find=function (req, res) {
  table.find('genres', `genres.id, genres.code, genres.name, genres.inout, genres.fund_id, CASE WHEN genres.icon LIKE '%' THEN '...' ELSE '' END icon`, req, res);
}

exports.count=function (req, res) {
  table.count('genres', req, res);
}

exports.icon=function (req, res) {
  table.icon('genres', req, res);
}