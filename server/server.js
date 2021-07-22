const app = require('express')();
const controller = require('./sequenceController')(false);


app.get('/upload/:data', controller.uploadHandler);

app.get('/:command', controller.commandHandler);

app.listen(80);