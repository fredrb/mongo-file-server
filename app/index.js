'use strict';

var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var config      = require('config');
var multer      = require('multer');
var fs          = require('fs');

let dbConfig = config.get('Development.dbConfig');
let uploadConfig = config.get('Development.upload');

let FileModel = require('./schema/file');

module.exports = (function() {
    class Server {
        constructor(serverPort) {
            this.serverPort = serverPort;
            this.upload = multer({dest : uploadConfig.dest});
        }

        init() {
            let app = express();
            let port = this.serverPort;
            this._connectDB();

            app.get('/', function(req, res) {
                res.send("Application");
            });

            app.get('/:file', function(req, res) {
                FileModel.findOne({ name : req.params.file }, function(err, data) {
                    console.log(uploadConfig.dest);
                    fs.writeFileSync(uploadConfig.dest + '/tmpFile', data.bin);
                    res.download(uploadConfig.dest + '/tmpFile');
                });
            });

            app.post('/upload', this.upload.single('file'), function(req, res, next) {
                let _file = new FileModel({
                    name : req.body.name,
                    bin : fs.readFileSync(req.file.path)
                });

                _file.save(function(err, data) {
                    if (err) res.send(err.Message);
                    console.log(data);
                    res.send(data);
                });
            });

            app.listen(port, function() {
                console.log("Application started on port " + port);
            });
        }

        _connectDB() {
            mongoose.connect("mongodb://" + dbConfig.user + ":" + dbConfig.password + "@" + dbConfig.host + "/" + dbConfig.db);
        }
    }

    return Server;
});
