const { errorMonitor } = require('mongodb/lib/apm');
const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    name : { type : String, required : true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    
})

module.exports = mongoose.model('User', Schema);