const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

// var schema = new mongoose.Schema({ /* schema definition */ });


// const Schema = mongoose.Schema;
var researchSchema = new mongoose.Schema({
    pi             : { type: String, required: true},
    co_pi          : { type: String, required: true},
    title          : { type: String, required: true},
    year           : { type: String, required: true},
    duration       : { type: String, required: true},
    dept           : { type: [String], required: true},
    amount         : { type: String, required: true},
    scheme         : { type: String, required: true},
})
researchSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("ResearchData", researchSchema, "ResearchData");