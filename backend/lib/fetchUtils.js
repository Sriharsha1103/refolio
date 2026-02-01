const { json } = require('express');
const dataModal = require('../db/testData')
const multer = require('multer');
const path = require('path');
const fs = require('fs');


module.exports.postData = async function(req, res) {
    try {
    
        const myobj = req.body;
        const fileInfo = req.file;

        if (myobj.year) {
            myobj.year = new Date(myobj.year);
        }

        // console.log('Received metadata:', myobj);
        // console.log('Received file:', fileInfo);
        
        dataModal.create(myobj, function(err, result) {  
            if (err) throw err;
            console.log("success");
            
            return res.status(200).json({
                message: 'Publication and file uploaded successfully',
                publication: myobj,
                file: fileInfo ? fileInfo.filename : null,
                result: result
            });
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports.titles = async function(req,res){
    try{
        dataModal.find({}, 'title', function(err, result) {
            if (err) throw err;
            console.log("success")
            const names = result.map(item => item.title);
            return res.status(200).json(names)
        })
    }catch(error){
        // console.log("ERROR",error)
        return res.status(500).json(error)
    }
}
module.exports.bulkUpload = async function(req,res){
    try{
        const object = req.body;
        let result1 = [];
       for (const key in object) {
        // console.log("year",object[key].year)
           object[key].year = new Date(object[key].year.toString());
        //    console.log("year",object[key].year)
           object[key].month = parseInt(object[key].month);
           dataModal.create(object[key],function(err,result){
               if(err) throw err;
               result1.push(result);
           })            
       }
        return res.status(200).json(result1)
    }
    catch(error){
        // console.log("ERROR",error)
        return res.status(500).json(error)
    }
}
module.exports.deleteData = async function(req,res){
    try{
        const id = req.params.id;
        dataModal.findByIdAndDelete(id,function(err,result){
            if(err) throw err;
            console.log("success")
            return res.status(200).json(result);
        })
    }
    catch(error){
        return res.status(500).json(error)
    }
}

module.exports.editData = async function(req,res){
    try{
        dataModal.findOneAndReplace({_id:req.body._id},req.body,{runValidators:true}, function(err,result){
            if(err) throw err;
            console.log("updated");
            return res.status(200).json({msg:"Successfully Updated"})
        })
    }
    catch(err){
        return res.status(500).json(err)
    }
}

module.exports.getData = async function (req, res) {
    try {
        const validParams = ['title', 'branch', 'username', 'cjb', 'year', 'nationality', 'scl', 'author_no', 'startDate', 'endDate'];
        const hasFilters = validParams.some(param => req.query[param]);

    
        
        const {
            title, branch, username, cjb, year, nationality, scl, author_no,
            startDate, endDate
        } = req.query;

        const query = {};

        const addRegex = (key, value) => {
            if (value) query[key] = { $regex: value, $options: "i" };
        };

        addRegex("title", title);
        addRegex("branch", branch);
        addRegex("username", username);
        addRegex("nationality", nationality);
        addRegex("scl", scl);

        if (cjb) query.cjb = cjb;
        if (year && year !== '0') query.year = year;
        if (author_no) query.author_no = author_no;

        if (startDate && endDate) {
            query.year = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        const result = await dataModal.find(query).sort({ _id: -1 });
        
        return res.status(200).json({ docs: result });

    } catch (error) {
        console.error("getData Error:", error);
        return res.status(500).json(error);
    }
}