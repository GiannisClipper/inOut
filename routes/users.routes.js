//users.routes.js

var g=require('../config/globals.js');
var router=require('express').Router();
var ctrl=require('../ctrls/users.ctrl');

router.get('/form', g.login, ctrl.form);
router.post('/new', g.login, g.noGuest, ctrl.new);
router.post('/modify', g.login, g.noGuest, ctrl.modify);
router.post('/delete', g.login, g.noGuest, ctrl.delete);
router.post('/find', g.login, ctrl.find);
router.post('/icon', g.login, ctrl.icon);
router.post('/count', g.login, ctrl.count);
router.post('/login', ctrl.login);

module.exports=router;