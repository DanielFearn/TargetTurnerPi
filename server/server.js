const express = require('express');
const app = express();
const controller = require('./sequenceController')(true);
const path = require('path');


app.get('/upload/:data', controller.uploadHandler);

app.get('/command/:command', controller.commandHandler);

app.get('/', (req, res) => {res.sendFile(path.join(__dirname, '../client/gui.html'));});
app.use(express.static('client'));

app.listen(80);