const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

// var schema = new mongoose.Schema({ /* schema definition */ });


// const Schema = mongoose.Schema;
var dataSchema = new mongoose.Schema({
    username                          : { type: String, required: true},
    cjb                               : { type: String, required: true, enum: ['C', 'J', 'B', 'BC']},
    title                             : { type: String, required: true},
    name_cjb                          : String,
    branch                            : { type: String, required: true, enum: ['IT','CSE','ECE','EEE','AI/ML','BS&H']},
    vol                               : { type: String, default: null},
    issue                             : { type: String, default: null},
    year                              : { type: Date},
    month                             : { type: Number, default:null},
    doi                               : { type: String, required: true},
    nationality                       : { type: String, required: true},
    organised_by                      : { type: String, default: null},
    is_proceeding                     : { type:String, default: "No"},
    is_published                      : { type: String, default: "No"},
    scl                               : { type: String, default: "Others"},
    citation_scopus                   : { type: String, default: "0"},
    citation_google                  : { type: String, default: "0"},
    link                              : { type: String, default: null},
    is_affilated                      : { type: String, default: "No"},
    author_no                         : { type: String, default: ""},
    starting_page                     : { type: Number, default: 0},
    ending_page                       : { type: Number, default: 0},
    cite                              : { type: String, default: null},
    fileName                          : { type: String, default: null},
})
dataSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Testdata", dataSchema);