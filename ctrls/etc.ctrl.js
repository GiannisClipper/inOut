//etc.ctrl.js

const g=require('../config/globals.js');
const l=require('../config/login.js');
const table=require(`../config/${g.dbConfigFile}.js`);

exports.index=function (req, res) {
  l.logout(req, res); 
  res.render('index.ejs', {username: (req && req.session && req.session.user)?req.session.user.name:''});
}

exports.about=function (req, res) {
  res.render('about.ejs', {username: req.session.user.name});
}

exports.admin=function (req, res) {
  res.render('admin.ejs', {username: req.session.user.name});
}

exports.dropCreate=function (req, res) {
  table.dropCreate(req, res);
}

exports.importData=function (req, res) {
  table.importData(req, res);
}

exports.exportData=function (req, res) {
  table.exportData(req, res);
}