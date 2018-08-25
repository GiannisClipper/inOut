//db_pg.js

exports.setup=async function() {

  const g=require('../config/globals.js');
  const {Pool}=require('pg');
  const connectionString='postgresql://postgres:postgres@localhost:5432/'+g.dbName; //postgresql://username:password@host:port/database_name';
//  g.db=new Pool({connectionString: connectionString}); //local pg
  g.db=new Pool({connectionString: process.env.DATABASE_URL, ssl: true}); //heroku pg

  const tables=[{
  name: 'users',
  stru: `CREATE TABLE IF NOT EXISTS users
         (id SERIAL PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          level TEXT,
          icon TEXT);`,
  index: [`CREATE INDEX usersName ON users (name);`]
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
      tmp=await createTable(tables[i]);
  }

  async function createIndexes(indexes) {
    let tmp;
    for (let i=0; indexes.length>0 && i<indexes.length; i++)
      tmp=await createIndex(indexes[i]);
  }

  let tmp=await createTables(tables);
}