var express = require('express');
var router = express.Router();
var dbLib = require("../lib/ProfileController")
const { profileUploadMiddleware } = require('../utils/profileUploadMiddleware');

router.get('/data', dbLib.allUsers)
router.post('/update', dbLib.editData)
router.put('/data/:id', profileUploadMiddleware, dbLib.putData)
router.post('/data', profileUploadMiddleware, dbLib.postData)
router.delete('/data/:id',dbLib.deleteData)
router.get('/names',dbLib.getNames)

module.exports =router;