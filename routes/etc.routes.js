//etc.routes.js

var g=require('../config/globals.js');
var l=require('../config/login.js')
var router=require('express').Router();
var ctrl=require('../ctrls/etc.ctrl');

router.get('/', ctrl.index);
router.get('/about', l.authent, ctrl.about);
router.get('/admin', l.authent, l.noGuest, ctrl.admin);
router.post('/admin/dropcreate', l.authent, l.noGuest, ctrl.dropCreate);
router.post('/admin/importdata', l.authent, l.noGuest, ctrl.importData);
router.post('/admin/exportdata', l.authent, l.noGuest, ctrl.exportData);

module.exports=router;