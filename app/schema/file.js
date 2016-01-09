var mongoose = require('mongoose');

var file = new mongoose.Schema({
   name : String
});

module.exports = mongoose.model('file', file);