var express = require('express');
var router = express.Router();
var dbLib = require("../lib/PatentsController")

router.get('/data', dbLib.getData)
router.post('/update', dbLib.editData)
router.post('/data',dbLib.postData)
router.delete('/data/:id',dbLib.deleteData)
router.post('/bulk',dbLib.bulkUpload)
router.get('/number',dbLib.getPatentNo)

module.exports =router;