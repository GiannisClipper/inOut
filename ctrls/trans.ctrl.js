//trans.ctrl.js

const g=require('../config/globals.js');
const table=require('../config/dbtable.js');

exports.form=function (req, res) {
  table.form('trans' ,req, res);
}

exports.new=function (req, res) {
  table.new('trans', req, res);
}

exports.modify=function (req, res) {
  table.modify('trans', req, res);
}

exports.delete=function (req, res) {
  table.delete('trans', req, res);
}

exports.find=function (req, res) {
  table.find('trans', 'trans.id, trans.date, trans.genre_id, trans.income, trans.outgo, trans.remarks, trans.fund_id', req, res);
}

exports.count=function (req, res) {
  table.count('trans', req, res);
}

