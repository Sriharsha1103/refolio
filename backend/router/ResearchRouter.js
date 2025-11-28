var express = require('express');
var router = express.Router();
var dbLib = require("../lib/ResearchController")

router.get('/data', dbLib.getData)
router.post('/update', dbLib.editData)
router.post('/data',dbLib.postData)
router.delete('/data/:id',dbLib.deleteData)
// router.post('/bulk',dbLib.bulkUpload)
router.get('/titles',dbLib.getTitles)

module.exports =router;