//users.routes.js

var g=require('../config/globals.js');
var router=require('express').Router();
var ctrl=require('../ctrls/users.ctrl');

router.get('/', g.login, ctrl.form);
router.post('/signup', ctrl.create);
router.post('/:id/modify', ctrl.modify);
router.post('/:id/delete', ctrl.delete);
router.post('/view', ctrl.view);
router.post('/list', ctrl.list);
router.post('/signin', ctrl.signin);
module.exports=router;