const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

/* =====================================================
   Qualification Schema
===================================================== */
const QualificationSchema = new Schema(
  {
    level: String,
    degree: String,
    specialization: String,
    university: String,
    yearOfPassing: Number,
    percentageOrCGPA: String,

    // file upload
    certificateFile: String,
  },
  { _id: false }
);

/* =====================================================
   Experience Schema
===================================================== */
const ExperienceSchema = new Schema(
  {
    type: String,
    organisation: String,
    designation: String,
    fromDate: Date,
    toDate: Date,
    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    // file upload
    experienceFile: String,
  },
  { _id: false }
);

/* =====================================================
   Profile Schema
===================================================== */
const ProfileSchema = new Schema({
  /* ===== BASIC INFO ===== */
  Name: {
    type: String,
    required: true,
  },

  Email: {
    type: String,
    unique: true,
    sparse: true,
  },

  branch: {
    type: String,
    enum: ["IT","CSE","ECE","EEE","AI/ML","BS&H","Admin","Others"],
  },

  Designation: String,

  AICTE_ID: String,
  JNTUH_ID: String,

  College_ID: {
    type: String,
    required: true,
  },

  /* ===== DOCUMENTS ===== */

  Aadhaar_Number: String,
  Aadhaar_File: String,

  PAN_Number: String,
  PAN_File: String,
  Profile_Photo: String,

  /* ===== PROFESSIONAL DETAILS ===== */

  Ratification_status: String,

  Teaching_Experience: String,
  Research_Experience: String,
  Industry_Experience: String,

  Scopus_ID: String,
  WoS_ID: String,
  Google_Scholar_ID: String,
  Vidwan_ID: String,
  ORCID_ID: String,

  Fields_of_Specialization: String,
  Professional_Memberships: String,
  Invited_Talks: String,
  Editor_for_Journals: String,
  Reviewer_for_Journals: String,

  /* ===== NESTED ARRAYS ===== */

  Education_Qualifications: [QualificationSchema],

  Experience: [ExperienceSchema],
});

/* =====================================================
   Plugins & Export
===================================================== */

ProfileSchema.plugin(mongoosePaginate);

const Profile = mongoose.model(
  "Profile",
  ProfileSchema,
  "ProfileData"
);

module.exports = Profile;
