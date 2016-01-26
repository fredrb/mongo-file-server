'use strict';

var mongoose = require('mongoose');
function notNullValidator(value, respond) {
  respond((value != null) && (value.length > 0), 'Invalid length');
}

var file = new mongoose.Schema({
  name : String,
  bin : Buffer
});

file.path('name').validate(notNullValidator);

module.exports = mongoose.model('file', file);
