//dbconfig_pg.js

const g=require('../config/globals.js');

module.exports.tables=[{
  name: 'users',
  stru: `CREATE TABLE IF NOT EXISTS users
         (id SERIAL PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          level TEXT,
          icon TEXT);`,
  index: [`CREATE INDEX usersName ON users (name);`]
//          `INSERT INTO users (name, password, level) VALUES ('admin', 'admin', 'admin');`]
  },{
  name: 'funds',
  stru: `CREATE TABLE IF NOT EXISTS funds
         (id SERIAL PRIMARY KEY,
          code TEXT UNIQUE NOT NULL,
          name TEXT UNIQUE NOT NULL,
          icon TEXT);`,
  index: [`CREATE INDEX fundsCode ON funds (code);`,
          `CREATE INDEX fundsName ON funds (name);`]
  },{
  name: 'genres',
  stru: `CREATE TABLE IF NOT EXISTS genres
         (id SERIAL PRIMARY KEY,
          code TEXT UNIQUE NOT NULL,
          name TEXT UNIQUE NOT NULL,
          inout INTEGER,
          fund_id INTEGER,
          icon TEXT);`,
  index: [`CREATE INDEX genresCode ON genres (code);`,
          `CREATE INDEX genresName ON genres (name);`]
  },{
  name: 'trans',
  stru: `CREATE TABLE IF NOT EXISTS trans
         (id SERIAL PRIMARY KEY,
          date TEXT NOT NULL,
          genre_id INTEGER,
          income REAL,
          outgo REAL,
          fund_id INTEGER, 
          remarks TEXT);`,
  index: [`CREATE INDEX transDate ON trans (date);`,
          `CREATE INDEX transGenre ON trans (genre_id);`,
          `CREATE INDEX transFund ON trans (fund_id);`]
  }];

module.exports.setup=async function(passTable=null) {
  const g=require('../config/globals.js');
  const {Pool}=require('pg');

  if (process.env.DATABASE_URL)
    g.db=new Pool({connectionString: process.env.DATABASE_URL, ssl: true}); //heroku pg
  else {
    const connectionString='postgresql://postgres:postgres@localhost:5432/'+g.dbName; //postgresql://username:password@host:port/database_name';
    g.db=new Pool({connectionString: connectionString}); //local pg
  }

  function createTable(table) {
    return new Promise((resolve, reject)=> {
        console.log('Checking table '+table.name+'...');
        g.db.query(`SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=$1;`,[table.name],(err,result)=>err?reject(err):resolve(result));
      })
      .then(result=> {
        if (result.rows.length===0) {
          return new Promise((resolve, reject)=> {
            g.db.query(table.stru,(err)=>err?reject(err):resolve());
          })
          .then(async result=> {
            let tmp=await createIndexes(table.index);
            console.log('Created table '+table.name+'.');
          });
        } else {
          console.log('Found table '+table.name+'.');
          console.log('------------------------ ');
        }
      })
      .catch(err=> {
        console.log(err);
      });
  }

  function createIndex(sql) {
    return new Promise((resolve, reject)=> {
        console.log(sql+'...');
        g.db.query(sql,(err)=>err?reject(err):resolve());
      })
      .catch(err=> {
        console.log(err);
      });
  }

  async function createTables(tables) {
    let tmp;
    for (let i=0; i<tables.length; i++)
      if (!passTable || passTable===tables[i].name)
        tmp=await createTable(tables[i]);
  }

  async function createIndexes(indexes) {
    let tmp;
    for (let i=0; indexes.length>0 && i<indexes.length; i++)
      tmp=await createIndex(indexes[i]);
  }

  let tmp=await createTables(module.exports.tables);
};

module.exports.dropCreate=function(req, res) {
    let table=req.body.table;
    let sql=`DROP TABLE ${table}`;
    console.log(sql);
    new Promise((resolve, reject)=> g.db.query(sql, err=> err?reject(err):resolve()))
    .then(()=> module.exports.setup(table))
    .then(()=> g.echo(null, res, {msg: `Ολοκλήρωση διαγραφής/δημιουργίας ${table}`}))
    .catch(err=> g.echo(err, res));
};

module.exports.importRec=function(res, table, fields, rows, i) {
    let sql='';
    let values=[];
    sql=`INSERT INTO ${table} VALUES (`+fields.map((x,j)=> (j===0?'':', ')+'$'+(j+1)).join('')+') RETURNING id';
    values=fields.map(x=> rows[i][x]);
    console.log(sql);
    console.log(values);
    new Promise((resolve, reject)=> g.db.query(sql, values, (err, result)=> err?reject(err):resolve(result)))
    .then(result=> {
      console.log((i+1)+'inserted');
      if (++i<rows.length)
        module.exports.importRec(res, table, fields, rows, i);
      else
        g.db.query(`
          BEGIN;
          -- protect against concurrent inserts while you update the counter
          LOCK TABLE ${table} IN EXCLUSIVE MODE;
          -- Update the sequence
          SELECT setval('${table}_id_seq', COALESCE((SELECT MAX(id) FROM ${table}), 0), false);
          COMMIT;
        `, (err,result)=> g.echo(err, res, {msg: `Ολοκλήρωση ${i} εγγραφών`}));
    })
    .catch(err=> g.echo(err, res));
};

module.exports.importData=function(req, res) {
    let table=req.body.table;
    let rows=req.body.rows;
    let fields=[];
    if (rows.length>0) {
      for (key in rows[0]) fields.push(key);
      module.exports.importRec(res, table, fields, rows, 0);
    }
};

module.exports.exportData=function(req, res) {
    let table=req.body.table;
    let sql=`SELECT * FROM ${table} ORDER BY id`;
    console.log(sql);
    new Promise((resolve, reject)=> g.db.query(sql, (err, result)=> err?reject(err):resolve(result)))
    .then(result=> g.echo(null, res, {table: table, rows: result.rows}))
    .catch(err=> g.echo(err, res));
};
