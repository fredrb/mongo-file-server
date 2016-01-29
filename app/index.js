'use strict';

let express     = require('express');
let mongoose    = require('mongoose');
let config      = require('config');
let multer      = require('multer');
let fs          = require('fs');
let router      = require('./router');

let dbConfig = config.get('Development.dbConfig');

module.exports = (function() {
  class Server {
    static init(port) {
      let app = express();
      mongoose.connect("mongodb://" + dbConfig.user + ":" + dbConfig.password + "@" + dbConfig.host + "/" + dbConfig.db);

      app.use('/', router);

      app.listen(port, () => {
        console.log("Application started on port " + port);
      });
    }
}

  return Server;
})();
