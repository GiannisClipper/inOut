//dbtable.js

const g=require('../config/globals.js');

module.exports={
  form: function (name, req, res) {
    res.render(name+'.ejs'); //,{username: req.session.user.name});
  },

  new: function (name, req, res) {
    let sql=`INSERT INTO ${name}`;
    sql+=(req.body.rawData.map((x,i)=> `${(i===0?' (':', ')}${x.name}`).join(''));
    sql+=`) VALUES (`+(req.body.rawData.map((x,i)=> `${(i===0?'':', ')}?`).join(''))+`)`
    let values=req.body.rawData.map(x=> x.value);
    console.log(sql);
    console.log(values);
    new Promise((resolve, reject)=> g.db.run(sql, values, err=> err?reject(err):resolve()))
    .then(()=> g.db.get(`SELECT id FROM ${name} ORDER BY id DESC`, (err, row)=> g.echo(err, res, row)))
    .catch(err=> g.echo(err, res));
  },

  modify: function (name, req, res) {
    let sql=`UPDATE ${name}`+(req.body.rawData.map((x,i)=> `${(i===0?' SET ':', ')}${x.name}=?`).join(''))+` WHERE id=?`;
    let values=req.body.rawData.map(x=> x.value);
    values.push(req.body.id);
    console.log(sql);
    console.log(values);
    g.db.run(sql, values, err=> g.echo(err, res, {id: req.body.id}));
  },

  delete: function (name, req, res) {
    let sql=`DELETE FROM ${name} WHERE id=?`;
    console.log(sql);
    console.log(req.body.id);
    g.db.run(sql, parseInt(req.body.id), err=> g.echo(err, res, {id: req.body.id}));
  },

  find: function (name, fields, req, res) {
    let sql=`SELECT ${fields}`;
    req.body.join.forEach(y=> sql+=y.fields.map((x,i)=> `, ${y.table}.${x.name}${(x.alias?' AS ':'')}${x.alias}`).join(''));
    sql+=` FROM ${name}`;
    sql+=req.body.join.map((x,i)=> ` LEFT JOIN ${x.table} ON ${x.relation}`).join('');
    sql+=req.body.find.map((x,i)=> `${(i===0?' WHERE ':' AND ')}${this.condition(name, x)}`).join('');
    sql+=req.body.order?` ORDER BY ${name}.${req.body.order}`:'';
    sql+=req.body.limit?` LIMIT ${req.body.limit}`:'';
    sql+=req.body.offset?` OFFSET ${req.body.offset}`:'';
    console.log(sql);
    g.db.all(sql, (err, rows)=> g.echo(err, res, (rows.length===0)?'No records found':rows));
  },

  count: function (name, req, res) {
    let sql=`SELECT count(id) as count FROM ${name}`;
    sql+=req.body.find.map((x,i)=> `${(i===0?' WHERE ':' AND ')}${this.condition(name, x)}`).join('');
    sql+=req.body.order?` ORDER BY ${req.body.order}`:'';
    console.log(sql);
    g.db.get(sql, (err, result)=> g.echo(err, res, result));
  },

  condition: function(name, x) {
    if (!x.range || x.value.split(x.range).length===1)
      return `${name}.${x.name}${x.value.indexOf('%')>=0?' LIKE ':'='}"${x.value}"`;
    else {
      let _=x.value.split(x.range);
      return `(${name}.${x.name}>="${_[0]}" AND trans.${x.name}<="${_[1]}")`;
    }
  },

  icon: function (name, req, res) {
    let sql=`SELECT icon FROM ${name} WHERE id=?`;
    console.log(sql);
    console.log(req.body.id);
    g.db.get(sql, parseInt(req.body.id), (err, row)=> g.echo(err, res, row));
  }
}
