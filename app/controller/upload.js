'use strict'
module.exports = (function() {
  let config       = require('config');
  let multer       = require('multer');
  let fs           = require('fs');
  let FileModel    = require('../schema/file');
  let router       = require('express').Router();
  let uploadConfig = config.get('Development.upload');
  let upload       = multer({dest : uploadConfig.dest});

  function _format(data, template) {
    let responseObj = {};
    template.forEach(t => {
      responseObj[t] = data[t];
    });

    return responseObj;
  }

  router.get('/:file', (req, res) => {
    FileModel.findOne({ name : req.params.file }, (err, data) => {
      let name = uploadConfig.dest + '/' + data.name;
      fs.writeFile(name, data.bin, 'utf8', (err) => {
        res.download(name);
      });
    });
  });

  router.post('/upload', upload.single('file'), (req, res, next) => {
    fs.readFile(req.file.path, (err, data) => {
      let _file = new FileModel({
        name : req.body.name,
        bin : data
      });

      _file.save((err, data) => {
        if (err) {
          res.send({
            'sucess' : false,
            'message' : err.Message
          });
        }
        
        res.send({
          'sucess' : true,
          'message' : 'Object saved',
          'data' : _format(data, ['_id', 'name'])
        });
      });
    });
  });

  return router;
})();
