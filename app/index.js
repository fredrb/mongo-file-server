'use strict';

let express     = require('express');
let mongoose    = require('mongoose');
let config      = require('config');
let bodyParser  = require('body-parser');
let multer      = require('multer');
let fs          = require('fs');
let router      = require('./router');

let dbConfig = config.get('Development.dbConfig');

module.exports = (function() {
    class Server {
        constructor(serverPort) {
            this.serverPort = serverPort;
            // this.upload = multer({dest : uploadConfig.dest});
        }

        init() {
            let app  = express();
            let port = this.serverPort;
            this._connectDB();

            app.use('/', router);

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
