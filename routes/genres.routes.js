//genres.routes.js

var g=require('../config/globals.js');
var l=require('../config/login.js')
var router=require('express').Router();
var ctrl=require('../ctrls/genres.ctrl');

router.get('/form', l.authent, ctrl.form);
router.post('/new', l.authent, l.noGuest, ctrl.new);
router.post('/modify', l.authent, l.noGuest, ctrl.modify);
router.post('/delete', l.authent, l.noGuest, ctrl.delete);
router.post('/find', l.authent, ctrl.find);
router.post('/icon', l.authent, ctrl.icon);
router.post('/count', l.authent, ctrl.count);

module.exports=router;