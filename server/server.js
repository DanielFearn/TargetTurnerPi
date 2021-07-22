const app = require('express')();
const controller = require('./sequenceController')(false);
const path = require('path');


app.get('/upload/:data', controller.uploadHandler);

app.get('/:command', controller.commandHandler);

app.get('/', (req, res) => {res.sendFile(path.join(__dirname, '../client/gui.html'));});

app.listen(80);