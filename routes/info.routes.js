//info.routes.js

var g=require('../config/globals.js');
var l=require('../config/login.js')
var router=require('express').Router();
var ctrl=require('../ctrls/info.ctrl');

router.get('/form', l.authent, ctrl.form);
router.post('/data', l.authent, ctrl.data);

module.exports=router;