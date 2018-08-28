//globals.js

module.exports={
  app: null,
  port: process.env.PORT || 3000,

  dbConfigFile: 'dbconfig_pg', //pg για postgreSQL...
  dbCommFile: 'dbcomm_pg', //pg για postgreSQL...
  dbName: 'inout',
  db: null,

  echo: function (err, res, respVal=null) {
    respVal=(err)?{error: err.message}:(typeof respVal==='string')?{error: respVal}:respVal;
    console.log(respVal);
    res.json(respVal);
  }
}