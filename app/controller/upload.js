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
    if (!data) return null;
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
    if (req.file == null)
      res.send({
        'success' : false,
        'message' : 'No document to be uploaded \'file\' parameter'
      });
    fs.readFile(req.file.path, (err, data) => {
      let _file = new FileModel({
        name : req.body.name || null,
        bin : data
      });

      _file.save((err, data) => {
        if (err) {
          return res.send({
            'success' : false,
            'message' : err.message
          });
        }

        res.send({
          'success' : true,
          'message' : 'Object saved',
          'data' : _format(data, ['_id', 'name'])
        });
      });
    });
  });

  return router;
})();
