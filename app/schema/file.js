var mongoose = require('mongoose');

var file = new mongoose.Schema({
    name : String,
    bin : Buffer
});

module.exports = mongoose.model('file', file);
