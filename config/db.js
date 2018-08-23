//db.js

exports.setup=async function() {

  const g=require('../config/globals.js');
  const sqlite3=require('sqlite3');
  g.db=new sqlite3.Database('tam.db');

  const tables=[{
  name: 'users',
  stru: `CREATE TABLE IF NOT EXISTS users
         (id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          password TEXT,
          icon BLOB);`,
  index: [`CREATE INDEX usersName ON users (name);`]

  },{
  name: 'funds',
  stru: `CREATE TABLE IF NOT EXISTS funds
         (id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          name TEXT UNIQUE NOT NULL,
          icon BLOB);`,
  index: [`CREATE INDEX fundsCode ON funds (code);`,
          `CREATE INDEX fundsName ON funds (name);`]
  },{
  name: 'genres',
  stru: `CREATE TABLE IF NOT EXISTS genres
         (id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          name TEXT UNIQUE NOT NULL,
          inout INTEGER,
          fund_id INTEGER,
          icon BLOB);`,
  index: [`CREATE INDEX genresCode ON genres (code);`,
          `CREATE INDEX genresName ON genres (name);`]
  },{
  name: 'trans',
  stru: `CREATE TABLE IF NOT EXISTS trans
         (id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          genre_id TEXT,
          income REAL,
          outgo REAL,
          fund_id TEXT, 
          remarks TEXT);`,
  index: [`CREATE INDEX transDate ON trans (date);`,
          `CREATE INDEX transGenre ON trans (genre_id);`,
          `CREATE INDEX transFund ON trans (fund_id);`]
  }];


  function createTable(table) {
    return new Promise((resolve, reject)=> {
        console.log('Checking table '+table.name+'...');
        g.db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`,table.name,(err,row)=>err?reject(err):resolve(row));
      })
      .then(result=> {
        if (result===undefined) {
          return new Promise((resolve, reject)=> {
            g.db.run(table.stru,(err)=>err?reject(err):resolve());
          })
          .then(async result=> {
            let tmp=await createIndexes(table.index);
            console.log('Created table '+table.name+'.');
          });
        } else {
          console.log('Found table '+table.name+'.');
        }
      })
      .catch(err=> {
        console.log(err);
      });
  }

  function createIndex(sql) {
    return new Promise((resolve, reject)=> {
        console.log(sql+'...');
        g.db.run(sql,(err)=>err?reject(err):resolve());
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