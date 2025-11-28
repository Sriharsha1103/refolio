var express = require('express');
var router = express.Router();
var dbLib = require("../lib/LoginController")

router.get('/list', dbLib.allUsers)
router.post('/role', dbLib.editRole)
// router.post('/data',dbLib.postData)
router.delete('/record/:id',dbLib.deleteUser)
// router.post('/bulk',dbLib.bulkUpload)
// router.get('/titles',dbLib.titles)

module.exports =router;