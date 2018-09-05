//dbcomm_pg.js

const g=require('../config/globals.js');

module.exports={
  new: function (name, req, res) {
    let sql=`INSERT INTO ${name}`;
    sql+=(req.body.rawData.map((x,i)=> `${(i===0?' (':', ')}${x.name}`).join(''));
    sql+=`) VALUES (`+(req.body.rawData.map((x,i)=> `${(i===0?'':', ')}$${i+1}`).join(''))+`)`
    let values=req.body.rawData.map(x=> x.value);
    console.log(sql);
    console.log(values);
    new Promise((resolve, reject)=> g.db.query(sql, values, err=> err?reject(err):resolve()))
    .then(()=> g.db.query(`SELECT id FROM ${name} ORDER BY id DESC LIMIT 1`, (err, result)=> g.echo(err, res, result.rows[0])))
    .catch(err=> g.echo(err, res));
  },

  modify: function (name, req, res) {
    let sql=`UPDATE ${name}`+(req.body.rawData.map((x,i)=> `${(i===0?' SET ':', ')}${x.name}=$${i+1}`).join(''))+` WHERE id=$${req.body.rawData.length+1}`;
    let values=req.body.rawData.map(x=> x.value);
    values.push(req.body.id);
    console.log(sql);
    console.log(values);
    g.db.query(sql, values, err=> g.echo(err, res, {id: req.body.id}));
  },

  delete: function (name, req, res) {
    let sql=`DELETE FROM ${name} WHERE id=$1`;
    console.log(sql);
    console.log(req.body.id);
    g.db.query(sql, [parseInt(req.body.id)], err=> g.echo(err, res, {id: req.body.id}));
  },

  find: function (name, fields, req, res) {
    let sql=`SELECT ${fields}`;
    if (req.body.join) req.body.join.forEach(y=> sql+=y.fields.map((x,i)=> `, ${y.table}.${x.name}${(x.alias?' AS ':'')}${x.alias}`).join(''));
    sql+=` FROM ${name}`;
    if (req.body.join) sql+=req.body.join.map((x,i)=> ` LEFT JOIN ${x.table} ON ${x.relation}`).join('');
    sql+=req.body.find.map((x,i)=> `${(i===0?' WHERE ':' AND ')}${this.condition(name, x)}`).join('');
    sql+=req.body.order?` ORDER BY ${name}.${req.body.order}`:'';
    sql+=req.body.limit?` LIMIT ${req.body.limit}`:'';
    sql+=req.body.offset?` OFFSET ${req.body.offset}`:'';
    console.log(sql);
    g.db.query(sql, (err, result)=> g.echo(err, res, (!result || result.rows.length===0)?'Δεν βρέθηκαν σχετικές εγγραφές':result.rows));
  },

  count: function (name, req, res) {
    let sql=`SELECT count(id) as count FROM ${name}`;
    sql+=req.body.find.map((x,i)=> `${(i===0?' WHERE ':' AND ')}${this.condition(name, x)}`).join('');
//    sql+=req.body.order?` ORDER BY ${req.body.order}`:'';
    console.log(sql);
    g.db.query(sql, (err, result)=> g.echo(err, res, result));
  },

  condition: function(name, x) {
    if (!x.range || x.value.split(x.range).length===1)
      return `${name}.${x.name}${x.value.indexOf('%')>=0?' LIKE ':'='}'${x.value}'`;
    else {
      let _=x.value.split(x.range);
      return `(${name}.${x.name}>='${_[0]}' AND trans.${x.name}<='${_[1]}')`;
    }
  },

  icon: function (name, req, res) {
    let sql=`SELECT icon FROM ${name} WHERE id=$1`;
    console.log(sql);
    console.log([req.body.id]);
    g.db.query(sql, [parseInt(req.body.id)], (err, result)=> g.echo(err, res, result.rows[0]));
  }
}