const { json } = require('express');
const dataModal = require('../db/PublicationsSchema');
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

module.exports.postData = async function (req, res) {
    try {
        const payload = { ...req.body };

        // Accept userId from either route param or body (support both UI patterns)
        const userId = req.params.userId || payload.userId || payload.profileId;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        payload.userId = userId; // satisfies PublicationsSchema required validator

        const fileInfo = req.file;

        if (payload.year) {
            payload.year = new Date(payload.year);
        }

        const created = await dataModal.create(payload);

        return res.status(200).json({
            message: "Publication created successfully",
            publication: created,
            file: fileInfo ? fileInfo.filename : null,
        });
    } catch (error) {
        console.error("Publication create error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports.putData = async function(req, res) {
    try {
        const id = req.params.id;
        const incoming = { ...req.body };
        const fileInfo = req.file;

        // Ensure ID exists
        if (!id) {
            return res.status(400).json({ message: 'Invalid request: missing id' });
        }

        // Defensive normalization: treat ""/"null"/undefined as nulls and cast types
        const normalizeEmpty = (v) => (v === undefined || v === null || v === '' || v === 'null' ? null : v);

        const update = {};

        // Copy only known fields to avoid accidental overwrites
        const fields = [
            'username','cjb','title','name_cjb','branch','vol','issue','year','month','doi','nationality',
            'organised_by','is_proceeding','is_published','scl','citation_scopus','citation_google','link',
            'is_affilated','author_no','starting_page','ending_page','cite'
        ];

        for (const key of fields) {
            if (incoming.hasOwnProperty(key)) {
                update[key] = normalizeEmpty(incoming[key]);
            }
        }

        // Year: cast valid values to Date, else set null
        if (update.year) {
            const d = new Date(update.year);
            update.year = isNaN(d.getTime()) ? null : d;
        }

        // Month: cast to integer or null
        if (update.month !== undefined && update.month !== null) {
            const m = parseInt(update.month, 10);
            update.month = Number.isNaN(m) ? null : m;
        }

        // Starting/ending page: integers or 0/null
        if (update.starting_page !== undefined && update.starting_page !== null) {
            const sp = parseInt(update.starting_page, 10);
            update.starting_page = Number.isNaN(sp) ? 0 : sp;
        }

        if (update.ending_page !== undefined && update.ending_page !== null) {
            const ep = parseInt(update.ending_page, 10);
            update.ending_page = Number.isNaN(ep) ? 0 : ep;
        }

        // Author numbers: if array, store as comma-separated string
        if (Array.isArray(incoming.author_no)) {
            update.author_no = incoming.author_no.join(',');
        }

        // File upload: store filename when provided
        if (fileInfo && fileInfo.filename) {
            update.fileName = fileInfo.filename;
        }

        // Build update operations to avoid writing undefined values
        const $set = {};
        const $unset = {};

        Object.keys(update).forEach((k) => {
            const v = update[k];
            if (v === null) {
                $unset[k] = ""; // Unset field if explicitly null-like
            } else {
                $set[k] = v;
            }
        });

        const ops = {};
        if (Object.keys($set).length) ops.$set = $set;
        if (Object.keys($unset).length) ops.$unset = $unset;

        if (!Object.keys(ops).length) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        const result = await dataModal.findByIdAndUpdate(
            id,
            ops,
            { new: true, runValidators: true }
        );

        if (!result) {
            return res.status(404).json({ message: 'Publication not found' });
        }

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