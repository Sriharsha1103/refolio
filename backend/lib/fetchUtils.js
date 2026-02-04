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

        // If author_no comes as comma-separated string, keep it as-is
        // or adjust here if you want to store as array

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

// New: update by id (PUT /data/:id)
module.exports.putData = async function(req, res) {
    try {
        const id = req.params.id;
        const update = { ...req.body };
        const fileInfo = req.file;

        // Normalize year if present
        if (update.year) {
            update.year = new Date(update.year);
        }

        // Normalize month to integer if sent
        if (update.month) {
            update.month = parseInt(update.month, 10);
        }

        // If author_no arrives as array from client, store as comma-separated string
        if (Array.isArray(update.author_no)) {
            update.author_no = update.author_no.join(',');
        }

        // If file uploaded, store filename (assuming your schema has file/fileName field)
        if (fileInfo) {
            update.fileName = fileInfo.filename;
        }

        const result = await dataModal.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!result) {
            return res.status(404).json({ message: 'Publication not found' });
        }

        console.log("updated");
        return res.status(200).json({
            message: 'Successfully Updated',
            publication: result,
            file: fileInfo ? fileInfo.filename : null,
        });
    } catch (error) {
        console.error('Update error:', error);
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

// Old editData (no longer used by frontend, but kept if other code still calls it)
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