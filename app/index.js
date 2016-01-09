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

            app.post('/profile', this.upload.single('avatar'), function(req, res, next) {
                console.log(req.body.name);
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

// module.exports = function(server, port, user, password, db) {
//     var app = express();
//     var fileSchema = require('./schema/file');
//
//     app.use(bodyParser.json());
//
//     mongoose.connect("mongodb://" + user + ":" + password + "@" + server + "/" + db);
//
//     app.get('/', function(req, res) {
//         fileSchema.find({}, {'_id' : 0, 'name' : 1}, function(err, data) {
//             if(err) res.send(err.message);
//             res.json(data);
//         });
//     });
//
//     app.listen("3000", function() {
//         console.log("Applications started on port 3000");
//     });
// };
