const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

// var schema = new mongoose.Schema({ /* schema definition */ });


// const Schema = mongoose.Schema;
var consultancySchema = new mongoose.Schema({
    pi             : { type: String, required: true},
    co_pi          : { type: String, required: true},
    title          : { type: String, required: true},
    // year           : { type: [String], required: true},
    dept           : { type: [String], required: true},
    amount         : { type: String, required: true},
    industry       : { type: String, required: true},
    ngo            : { type: String, required: true},
})
consultancySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("ConsultancyData", consultancySchema, "ConsultancyData");