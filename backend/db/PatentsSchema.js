const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

// var schema = new mongoose.Schema({ /* schema definition */ });


// const Schema = mongoose.Schema;
var patentSchema = new mongoose.Schema({
    authors             : { type: String, required: true},
    pat_no              : { type: String, required: true},
    title               : { type: String, required: true},
    filed               : { type: Date, required: true},
    dept                : { type: [String], required: true},
    abstract            : { type: String, default: ""},
    design_utility      : { type: String, required: true, enum: ['Design','Utility']},
    published           : { type: Date},
    year                : { type: Date},
    country             : { type: String, required: true}
})
patentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("PatentData", patentSchema, "PatentData");