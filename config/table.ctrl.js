//funds.ctrl.js

var g=require('../config/globals.js');

exports.form=function (table, req, res) {
  res.render(table+'.ejs'); //,{username: req.session.user.name});
}

exports.new=function (req, res) {
  let sql=`INSERT INTO funds`;
  sql+=(req.body.rawData.map((x,i)=> `${(i===0?' (':', ')}${x.name}`).join(''));
  sql+=`) VALUES (`+(req.body.rawData.map((x,i)=> `${(i===0?'':', ')}?`).join(''))+`)`
  let values=req.body.rawData.map(x=> x.value);
  console.log(sql);
  console.log(values);
  new Promise((resolve, reject)=> g.db.run(sql, values, err=> err?reject(err):resolve()))
  .then(()=> g.db.get(`SELECT id FROM funds ORDER BY id DESC`, (err, row)=> g.echo(err, res, row)))
  .catch(err=> g.echo(err, res));
}

exports.modify=function (req, res) {
  let sql=`UPDATE funds`+(req.body.rawData.map((x,i)=> `${(i===0?' SET ':', ')}${x.name}=?`).join(''))+` WHERE id=?`;
  let values=req.body.rawData.map(x=> x.value);
  values.push(req.body.id);
  console.log(sql);
  console.log(values);
  g.db.run(sql, values, err=> g.echo(err, res, {id: req.body.id}));
}

exports.delete=function (req, res) {
  let sql=`DELETE FROM funds WHERE id=?`;
  console.log(sql);
  console.log(req.body.id);
  g.db.run(sql, parseInt(req.body.id), err=> g.echo(err, res, {id: req.body.id}));
}

exports.find=function (req, res) {
  let sql=`SELECT id, code, name, CASE WHEN icon LIKE "%" THEN "..." ELSE "" END icon FROM funds`; //0=false, 1=true
  sql+=req.body.find.map((x,i)=> `${(i===0?' WHERE ':' AND ')}${x.name}${x.value.indexOf('%')>=0?' LIKE ':'='}"${x.value}"`).join('');
  sql+=req.body.order?` ORDER BY ${req.body.order}`:'';
  sql+=req.body.limit?` LIMIT ${req.body.limit}`:'';
  sql+=req.body.offset?` OFFSET ${req.body.offset}`:'';
  console.log(sql);
  g.db.all(sql, (err, rows)=> g.echo(err, res, (rows.length===0)?'Not found':rows));
}

exports.count=function (req, res) {
  let sql=`SELECT count(id) as count FROM funds`;
  sql+=req.body.find.map((x,i)=> `${(i===0?' WHERE ':' AND ')}${x.name}${x.value.indexOf('%')>=0?' LIKE ':'='}"${x.value}"`).join('');
  sql+=req.body.order?` ORDER BY ${req.body.order}`:'';
  console.log(sql);
  g.db.get(sql, (err, result)=> g.echo(err, res, result));
}

exports.icon=function (req, res) {
  let sql=`SELECT icon FROM funds WHERE id=?`;
  console.log(sql);
  console.log(req.body.id);
  g.db.get(sql, parseInt(req.body.id), (err, row)=> g.echo(err, res, row));
}