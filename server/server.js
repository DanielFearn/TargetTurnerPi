const express = require('express');
const app = express();
const controller = require('./sequenceController')(true);
const path = require('path');

app.use(express.json());
app.post('/upload/', controller.uploadHandler);

app.get('/command/:command', controller.commandHandler);

app.get('/', (req, res) => {res.sendFile(path.join(__dirname, '../client/gui.html'));});
app.use(express.static(path.join(__dirname, '../client')));

app.listen(80);
console.log('TargetTurnerPi is listening on port 80');