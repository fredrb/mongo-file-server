'use strict';
let Server = require('./app')();
let app = new Server(3000);

app.init();
