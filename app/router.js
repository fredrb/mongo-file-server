'use strict';
module.exports = (function() {
    let express = require('express');
    let router = express.Router();

    router.get('/', (req, res) => { res.send('Application'); });
    router.use('/file', require('./controller/upload'));

    return router;
})();
