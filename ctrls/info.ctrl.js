//info.ctrl.js

const g=require('../config/globals.js');
const table=require(`../config/${g.dbCommFile}.js`);

exports.form=function (req, res) {
  res.render('info.ejs', {username: req.session.user.name});
}

exports.data=function (req, res) {
  res.render('infodata.ejs', req.body);
//(err,html)=> res.send(html));
//
}