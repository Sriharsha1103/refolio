const { json } = require('express');

const dataModal = require('../db/PatentsSchema')

module.exports.postData =async function(req,res) {
    try{
        const myobj = req.body;
        // console.log(myobj)
        myobj.year = myobj.year ? new Date(myobj.year) : null;
        myobj.filed = new Date(myobj.filed)
        myobj.published = myobj.published ? new Date(myobj.published) : null;
        dataModal.create(myobj, function(err, result) {  
            if (err) throw err;
            console.log("success her")
            return res.status(200).json(result);
        }
        )
    }
    catch(error){
        return res.status(500).json(error)
    }
}
module.exports.getPatentNo = async function(req,res){
    try{
        dataModal.find({}, 'pat_no', function(err, result) {
            if (err) throw err;
            console.log("success")
            const names = result.map(item => item.pat_no);
            return res.status(200).json(names)
        })
    }catch(error){
        console.log("ERROR",error)
        return res.status(500).json(error)
    }
}
module.exports.bulkUpload = async function(req,res){
    try{
        const object = req.body;
        let result1 = [];
       for (const key in object) {
        console.log("year",object[key].year)
        object[key].year = object[key].year ? new Date(object[key].year) : null;
        object[key].filed = new Date(object[key].filed)
        object[key].published = object[key].published ? new Date(object[key].published) : null;
           console.log("year",object[key].year)
           
           dataModal.create(object[key],function(err,result){
               if(err) throw err;
               result1.push(result);
           })            
       }
        return res.status(200).json(result1)
    }
    catch(error){
        console.log("ERROR",error)
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
        const {
            title,
            branch,
            authors,
            design,
            pat_no,
            country,
            startDate,
            endDate,
            advance
        } = req.query;

        const query = {};

        const addRegex = (key, value) => {
            if (value) query[key] = { $regex: value, $options: "i" };
        };

        addRegex("title", title);
        addRegex("dept", branch);
        addRegex("authors", authors);
        addRegex("country", country);

        if (design) query.design_utility = design;
        if (pat_no) query.pat_no = { $regex: pat_no, $options: "i" };

        if (startDate && endDate && advance) {
            const fieldMap = { grant: "year", filed: "filed", published: "published" };
            const targetField = fieldMap[advance];
            if (targetField) {
                query[targetField] = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
        }

        const result = await dataModal.find(query).sort({ _id: -1 });
        return res.status(200).json({ docs: result });
    } catch (error) {
        console.error("getData Error:", error);
        return res.status(500).json(error);
    }
}