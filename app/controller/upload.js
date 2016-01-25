'use strict'
module.exports = (function() {
    let config       = require('config');
    let multer       = require('multer');
    let fs           = require('fs');
    let FileModel    = require('../schema/file');
    let router       = require('express').Router();
    let uploadConfig = config.get('Development.upload');
    let upload       = multer({dest : uploadConfig.dest});

    router.get('/:file', (req, res) => {
        FileModel.findOne({ name : req.params.file }, (err, data) => {
            let name = uploadConfig.dest + '/' + data.name;
            fs.writeFile(name, data.bin, 'utf8', (err) => {
                res.download(name);
            });
        });
    });

    router.post('/upload', upload.single, (req, res, next) => {
        fs.readFile(req.file.path, (err, data) => {
            let _file = new FileModel({
                name : req.body.name,
                bin : data
            });

            _file.save(function(err, data) {
                if (this.err) res.send(err.Message);
                res.send(data);
            });
        });
    });

    return router;
})();
