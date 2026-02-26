const { json } = require("express");
const dataModal = require("../db/ProfileSchema");
const mongoose = require("mongoose");
const PublicationsModal = require("../db/PublicationsSchema");

/* =====================================================
   CREATE PROFILE
===================================================== */
module.exports.postData = async function (req, res) {
  try {
    let myobj = { ...req.body };

    /* ======================================
       1️⃣ PARSE ARRAYS (VERY IMPORTANT)
    ====================================== */
    
    if (typeof myobj.Education_Qualifications === "string") {
      myobj.Education_Qualifications = JSON.parse(
        myobj.Education_Qualifications
      );
    }

    if (typeof myobj.Experience === "string") {
      myobj.Experience = JSON.parse(myobj.Experience);
    }

    /* ======================================
       2️⃣ MAP UPLOADED FILES
    ====================================== */

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {

        // MAIN FILES
        if (file.fieldname === "Aadhaar_File") {
          myobj.Aadhaar_File = file.filename;
        }

        if (file.fieldname === "PAN_File") {
          myobj.PAN_File = file.filename;
        }

        if (file.fieldname === "Profile_Photo") {
          myobj.Profile_Photo = file.filename;
        }

        // QUALIFICATION FILES
        if (file.fieldname.startsWith("qual_")) {
          const index = parseInt(file.fieldname.split("_")[1]);

          if (
            myobj.Education_Qualifications &&
            myobj.Education_Qualifications[index]
          ) {
            myobj.Education_Qualifications[index].certificateFile =
              file.filename;
          }
        }

        // EXPERIENCE FILES
        if (file.fieldname.startsWith("exp_")) {
          const index = parseInt(file.fieldname.split("_")[1]);

          if (myobj.Experience && myobj.Experience[index]) {
            myobj.Experience[index].experienceFile = file.filename;
          }
        }
      });
    }

    /* ======================================
       3️⃣ SAVE TO DB
    ====================================== */

    const result = await dataModal.create(myobj);

    return res.status(200).json({
      message: "Profile created successfully",
      profile: result,
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
module.exports.putData = async function (req, res) {
  try {
    const id = req.params.id;
    let incoming = { ...req.body };

    /* ======================================
       1️⃣ PARSE ARRAYS (VERY IMPORTANT)
    ====================================== */

    if (typeof incoming.Education_Qualifications === "string") {
      incoming.Education_Qualifications = JSON.parse(
        incoming.Education_Qualifications
      );
    }

    if (typeof incoming.Experience === "string") {
      incoming.Experience = JSON.parse(incoming.Experience);
    }

    /* ======================================
       2️⃣ MAP NEWLY UPLOADED FILES
    ====================================== */

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {

        // MAIN FILES
        if (file.fieldname === "Aadhaar_File") {
          incoming.Aadhaar_File = file.filename;
        }

        if (file.fieldname === "PAN_File") {
          incoming.PAN_File = file.filename;
        }

        if (file.fieldname === "Profile_Photo") {
          incoming.Profile_Photo = file.filename;
        }

        // QUAL FILES
        if (file.fieldname.startsWith("qual_")) {
          const index = parseInt(file.fieldname.split("_")[1]);

          if (
            incoming.Education_Qualifications &&
            incoming.Education_Qualifications[index]
          ) {
            incoming.Education_Qualifications[index].certificateFile =
              file.filename;
          }
        }

        // EXP FILES
        if (file.fieldname.startsWith("exp_")) {
          const index = parseInt(file.fieldname.split("_")[1]);

          if (incoming.Experience && incoming.Experience[index]) {
            incoming.Experience[index].experienceFile =
              file.filename;
          }
        }
      });
    }

    /* ======================================
       3️⃣ UPDATE DATABASE
    ====================================== */

    const updated = await dataModal.findByIdAndUpdate(
      id,
      incoming,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: updated,
    });

  } catch (error) {
    console.error("Update Error:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
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
  console.log("Test")
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

module.exports.getProfileById = async function(req, res){
  const { id } = req.params;

  console.log("Test", id);
  try {
    if (!id) {
      return res.status(400).json({ message: "Profile id is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid profile id" });
    }

    const profile = await dataModal.findById(id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    // console.log("Profile", profile)
    const userObjectId = new mongoose.Types.ObjectId(id);

    const publications = await PublicationsModal
      .find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .lean();
    
    return res.status(200).json({
      message: "Profile fetched successfully",
      profile,
      publications,
    });
  } catch (error) {
    console.error("getProfileById error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};