//info.ctrl.js

const g=require('../config/globals.js');
const table=require(`../config/${g.dbCommFile}.js`);

exports.form=function (req, res) {
  res.render('info.ejs', {username: req.session.user.name});
}

exports.data=function (req, res) {
  const styleDate=function(rawDate) {return rawDate.substr(6,2)+'/'+rawDate.substr(4,2)+'/'+rawDate.substr(0,4)};
  let from=req.body.from.substr(6,4)+req.body.from.substr(3,2)+req.body.from.substr(0,2);
  let till=req.body.till.substr(6,4)+req.body.till.substr(3,2)+req.body.till.substr(0,2);
  let funds=[];
  let genres=[];
  let dates=[];

  let sql='';
  new Promise((resolve, reject)=> g.db.query('SELECT date, income, outgo, genre_id, fund_id, remarks FROM trans WHERE date>=$1 AND date<=$2 ORDER BY date', [from, till], (err, result)=> (err)?reject(err):resolve(result)))
  .then(result=> {
    let i=0;
    for (row of result.rows) {
      for (i=0; i<funds.length; i++)
        if (funds[i].id===row.fund_id) break;
      if (i===funds.length)
        funds.push({id:row.fund_id, name:null, icon:null, income:0, outgo:0});
      funds[i].income+=!parseFloat(row.income)?0:parseFloat(row.income);
      funds[i].outgo+=!parseFloat(row.outgo)?0:parseFloat(row.outgo);

      for (i=0; i<genres.length; i++)
        if (genres[i].id===row.genre_id) break;
      if (i===genres.length)
        genres.push({id:row.genre_id, name: null, icon:null, inout:null, amount:0, more:[]});
      genres[i].amount+=(row.income?parseFloat(row.income):0)+(row.outgo?parseFloat(row.outgo):0);
      genres[i].more.push({remarks:row.remarks, date:styleDate(row.date), amount:(row.income?parseFloat(row.income):0)+(row.outgo?parseFloat(row.outgo):0)});

      if (dates.length===0 || dates[dates.length-1].date!==row.date)
        dates.push({date:row.date, amount:0});
      dates[dates.length-1].amount+=(row.income?parseFloat(row.income):0)-(row.outgo?parseFloat(row.outgo):0);
    }

    funds=funds.sort((x1,x2)=> (x2.income-x2.outgo)-(x1.income-x1.outgo));
    genres=genres.sort((x1,x2)=> x2.amount-x1.amount);
    sql='SELECT id, name, icon FROM funds WHERE id IN ('+funds.map(x=> x.id).join(',')+')';
  })
  .then(result=> g.db.query(sql))
  .then(result=> {
    for (fund of funds)
      for (row of result.rows)
        if (fund.id===row.id) {
          fund.name=row.name;
          fund.icon=row.icon;
          break;
        }
    sql='SELECT id, name, icon, inout FROM genres WHERE id IN ('+genres.map(x=> x.id).join(',')+')';
  })
  .then(result=> g.db.query(sql))
  .then(result=> {
    for (genre of genres)
      for (row of result.rows)
        if (genre.id===row.id) {
          genre.name=row.name;
          genre.icon=row.icon;
          genre.inout=row.inout;
          break;
        }
    res.render('infodata.ejs', {HDate:require('../public/js/hdate.js'), GraphModule:require('../public/js/graph.js'), username:req.body.username, from:req.body.from, till:req.body.till, funds:funds, genres:genres, dates:dates});
  })
  .catch(err=> g.echo(err, res));
}