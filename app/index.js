var express = require('express');
var mongoose = require('mongoose');
var bodyParser  = require('body-parser');

module.exports = function(server, port, user, password, db) {
    var app = express();
    var fileSchema = require('./schema/file');

    app.use(bodyParser.json());

    mongoose.connect("mongodb://" + user + ":" + password + "@" + server + "/" + db);

    app.get('/', function(req, res) {
        fileSchema.find({}, {'_id' : 0, 'name' : 1}, function(err, data) {
            if(err) res.send(err.message);
            res.json(data);
        });
    });

    app.listen("3000", function() {
        console.log("Applications started on port 3000");
    });
};


