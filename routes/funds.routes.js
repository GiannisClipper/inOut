//funds.routes.js

var g=require('../config/globals.js');
var router=require('express').Router();
var ctrl=require('../ctrls/funds.ctrl');

router.get('/form', g.login, ctrl.form);
router.post('/new', g.login, ctrl.new);
router.post('/modify', g.login, ctrl.modify);
router.post('/delete', g.login, ctrl.delete);
router.post('/find', g.login, ctrl.find);
router.post('/icon', g.login, ctrl.icon);
router.post('/count', g.login, ctrl.count);

module.exports=router;