    const moongoose = require('mongoose');
    const Schema = moongoose.Schema({
        title : { type : String, required : true},
        description : { type : String},
        image : { type : String},
        address : { type : String, required : true},
        location : {
            lat : { type : Number},
            lng : { type : Number}
        },
        creator : { type : String,  required : true, ref : 'User'}

    });
    module.exports = moongoose.model('Place', Schema);
     