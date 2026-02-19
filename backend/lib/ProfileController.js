const { json } = require("express");
const dataModal = require("../db/ProfileSchema");

/* =====================================================
   CREATE PROFILE
===================================================== */
module.exports.postData = async function (req, res) {
  try {
    const myobj = req.body;
    const fileInfo = req.file; // optional

    /* ===== if direct upload ===== */
    if (fileInfo && fileInfo.filename) {
      myobj.fileName = fileInfo.filename;
    }

    dataModal.create(myobj, function (err, result) {
      if (err) throw err;

      return res.status(200).json({
        message: "Profile created successfully",
        profile: result,
        file: fileInfo ? fileInfo.filename : null,
      });
    });
  } catch (error) {
    console.error("Profile upload error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

/* =====================================================
   UPDATE PROFILE (PUT)
===================================================== */
module.exports.putData = async function(req,res){

  try{

    const incoming = req.body;

    // ===== PARSE ARRAYS (MOST IMPORTANT FIX) =====
    if(incoming.Education_Qualifications){
      incoming.Education_Qualifications =
        JSON.parse(incoming.Education_Qualifications);
    }

    if(incoming.Experience){
      incoming.Experience =
        JSON.parse(incoming.Experience);
    }

    // ===== FILE MAPPING =====
    if(req.files){
      req.files.forEach(file=>{
        if (file.fieldname === "Aadhaar_File")
          myobj.Aadhaar_File = file.filename;

        if (file.fieldname === "PAN_File")
          myobj.PAN_File = file.filename;

        if (file.fieldname === "Profile_Photo")
          myobj.Profile_Photo = file.filename;

        if(file.fieldname.startsWith("qual_")){
          const i=parseInt(file.fieldname.split("_")[1]);
          incoming.Education_Qualifications[i]
            .certificateFile = file.filename;
        }

        if(file.fieldname.startsWith("exp_")){
          const i=parseInt(file.fieldname.split("_")[1]);
          incoming.Experience[i]
            .experienceFile = file.filename;
        }

      });
    }

    const result =
      await dataModal.findByIdAndUpdate(
        req.params.id,
        { $set: incoming },
        { new:true }
      );

    return res.status(200).json(result);

  }catch(err){
    console.log("Update Error:",err);
    return res.status(500).json(err);
  }
};

/* =====================================================
   EDIT DATA (OLD METHOD)
===================================================== */
module.exports.editData = async function (req, res) {
  try {
    dataModal.findOneAndReplace(
      { _id: req.body._id },
      req.body,
      { runValidators: true },
      function (err, result) {
        if (err) throw err;
        return res.status(200).json({
          msg: "Successfully Updated",
        });
      }
    );
  } catch (err) {
    return res.status(500).json(err);
  }
};

/* =====================================================
   GET NAMES
===================================================== */
module.exports.getNames = async function (req, res) {
  try {
    dataModal.find({}, "Name", function (err, result) {
      if (err) throw err;

      const names = result.map((item) => item.Name);

      return res.status(200).json(names);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

/* =====================================================
   DELETE
===================================================== */
module.exports.deleteData = async function (req, res) {
  try {
    const id = req.params.id;

    dataModal.findByIdAndDelete(id, function (err, result) {
      if (err) throw err;
      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

/* =====================================================
   PAGINATED USERS
===================================================== */
module.exports.allUsers = async function (req, res) {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let registeredDate =
      req.query.registeredDate == "1"
        ? { createdAt: "asc" }
        : { createdAt: "desc" };

    let query = {};

    dataModal.paginate(
      query,
      {
        page: page,
        limit: limit,
        sort: registeredDate,
      },
      function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          return res.status(200).json(result);
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
