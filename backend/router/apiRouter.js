var express = require('express');
var router = express.Router();
var dbLib = require("../lib/fetchUtils")
const { uploadMiddleware } = require('../utils/uploadMiddleware');

router.get('/data', dbLib.getData)
router.put('/data/:id', uploadMiddleware, dbLib.putData)
router.post('/data', uploadMiddleware, dbLib.postData)
router.delete('/data/:id',dbLib.deleteData)
router.post('/bulk',dbLib.bulkUpload)
router.get('/titles',dbLib.titles)

module.exports =router;