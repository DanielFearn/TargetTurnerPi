var presetSequences = {
    tp1s1: [[1, 120], [0, 1]],
    tp1s2: [[1, 2], [0, 5], [1, 2], [0, 5], [1, 2], [0, 5], [1, 2], [0, 5], [1, 2], [0, 5], [1, 2], [0, 5]],
    tp1s3: [[1, 3], [0, 5], [1, 3], [0, 5], [1, 3], [0, 5]]
}

var SequenceInput = {
    numTargets: 4,
    maxTargets: 10, // this number MUST be the same as on the controller
    defaultDuration: 1,
    defaultRandomSettings: {
        min: 1,
        max: 3,
        duration: 15,
        away: false
    },

    sequenceData: [],

    init: function(targets = 1) {

        this.emptyTable();

        this.numTargets = targets;
        var table = document.getElementById('sequenceTable');

        var tr1 = document.createElement('tr');

        var th1 = document.createElement('th');
        th1.setAttribute('colspan', targets);
        th1.appendChild(document.createTextNode('Target'));

        var th2 = document.createElement('th');
        th2.setAttribute('rowspan', 2);
        th2.setAttribute('style', 'width: 100px');
        th2.appendChild(document.createTextNode('Duration (s)'));

        var th3 = document.createElement('th');

        /*var addTargetButton = document.createElement('button');
        addTargetButton.appendChild(document.createTextNode('Add Target'));
        addTargetButton.onclick = this.addTarget.bind(this);

        th3.appendChild(addTargetButton); */

        th3.setAttribute('rowspan', 2);
        th3.setAttribute('style', 'width: 60px');

        tr1.appendChild(th1);
        tr1.appendChild(th2);
        tr1.appendChild(th3);
        table.appendChild(tr1);

        var tr2 = document.createElement('tr');
        
        for (var i = 0; i < targets; i++) {
            var idColHead = document.createElement('th');
            var text = document.createTextNode(i+1);
            idColHead.appendChild(text);
            tr2.appendChild(idColHead);
        }

        table.appendChild(tr2);
        
    },

    emptyTable: function() {
        var table = document.getElementById("sequenceTable");
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
    },
    
    changeNumTargets: function(){
        newTargets = prompt('Enter the number of targets connected:');
        if(!newTargets) return;
        if(isNaN(newTargets)) return;
        newTargets = parseInt(newTargets);

        if(newTargets > this.maxTargets){
            alert('Maximum number of targets is ' + this.maxTargets);
            return;
        }

        this.init(newTargets);

    },

    addRow: function(state) {
        var newRow = document.createElement('tr');

        for (var i = 0; i < this.numTargets; i++) {
            var newCell = document.createElement('td');
            newCell.classList.add('sequence__cell');

            if (state[i]){
                newCell.classList.add('sequence__cell--active');
            }

            newCell.onclick = SequenceInput.buttonClick;

            newRow.appendChild(newCell);
        }

        var durationCell = document.createElement('td');
        var inputBox = document.createElement('input');
        inputBox.type = 'number';
        inputBox.step = 0.1;
        inputBox.min = 0.1;
        inputBox.max = 90;
        inputBox.value = state[this.numTargets];

        durationCell.appendChild(inputBox);
        newRow.appendChild(durationCell);

        var deleteCell = document.createElement('td');
        var deleteButton = document.createElement('button');
        deleteButton.appendChild(document.createTextNode('Delete'));
        deleteButton.onclick = function (e) {this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)};
        deleteButton.classList.add('sequence__deletebutton');
        deleteCell.append(deleteButton);
        newRow.appendChild(deleteCell);

        document.getElementById('sequenceTable').appendChild(newRow);

    },

    addBlankRow: function(time = this.defaultDuration) {
        var rowState = [];
        const defaultTargetState = false;

        for (var i = 0; i < this.numTargets; i++) {
            rowState.push(defaultTargetState);
        }
        rowState.push(time);

        this.addRow(rowState);
    },

    addRandomRow: function(duration) {
        var newRowState = [];
        for (var i = 0; i < this.numTargets; i++) {
            newRowState.push(Math.random()>0.5);
        }
        newRowState.push(duration);
        this.addRow(newRowState);

    },
    
    fillSequence: function(sequence) {
        this.emptyTable();
        this.init(this.numTargets);

        for (var i = 0; i < sequence.length; i++) {
            var line = [];
            for (var j = 0; j < this.numTargets; j++) {
                line.push(sequence[i][0]);
            }
            line.push(sequence[i][1]);
            
            this.addRow(line);
        }
    },

    buttonClick: function(event) {
        var cell = event.target;

        cell.classList.toggle('sequence__cell--active');
    },

    sendData: function() {

        var deadRowsTop = 2;
        var deadColsRight = 2;

        var data = [];

        var table = document.getElementById('sequenceTable');
        var rows = table.children;

        var outputString = (rows.length-2).toString() + ',';

        for (var r = 0; r <  rows.length-deadRowsTop; r++) {
            data[r] = [];

            var cells = rows[r+deadRowsTop].children;
            var b;

            for (b = 0; b < cells.length-deadColsRight; b++) {
                var active = cells[b].classList.contains('sequence__cell--active') ? 1 : 0;
                data[r][b] = (active);
                outputString += active.toString() + ',';
            }

            outputString += '0,'.repeat(this.maxTargets - (cells.length-deadColsRight));

            // duration value
            data[r][b] = parseFloat(cells[b].children[0].value);
            outputString += cells[b].children[0].value + ',';
        }

        console.log(data);
        console.log(outputString);

        document.getElementById('upload_button').innerHTML = 'Uploading...';
        var originalColour = document.getElementById('upload_button').style.backgroundColor;
        document.getElementById('upload_button').style.backgroundColor = 'red';

        var request = new XMLHttpRequest();
        request.open('GET', '/upload/' + outputString, true);
        request.onload = function () {
            document.getElementById('upload_button').innerHTML = 'Sequence uploaded!';
            document.getElementById('upload_button').style.backgroundColor = originalColour;
            setTimeout(function(){
                document.getElementById('upload_button').innerHTML = 'Upload sequence';
            }, 2000);
        }
        request.onreadystatechange = function() {
            if(request.readyState == 4 && request.status != 200) {
                alert('Connection to the controller has been lost.');
            }
        }
        request.send();


    },

    randomSequence: function(minTime, maxTime, awayInBetween){

        this.emptyTable();
        this.init(this.numTargets);

        var targetsToShow = [];

        for (var k = 0; k < this.numTargets; k++) {
            targetsToShow.push(k);
        }

        var j, x, i;
        for (i = targetsToShow.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = targetsToShow[i];
            targetsToShow[i] = targetsToShow[j];
            targetsToShow[j] = x;
        }

        for (var l = 0; l  < this.numTargets; l++) {
            var rowState = [];

            for (var m = 0; m < this.numTargets; m++) {
                rowState.push(targetsToShow[l] == m);
                
            }
            if(awayInBetween) {
                this.addBlankRow(Math.floor((minTime + Math.random()*(maxTime - minTime))*10) / 10);
            }

            rowState.push(Math.floor((minTime + Math.random()*(maxTime - minTime))*10) / 10);
            this.addRow(rowState);
        }

        this.addBlankRow(0.1);

    },

    handleRandomForm: function(event) {
        event.preventDefault();
        var form = event.target;

        var min = parseFloat(form.min.value);
        var max = parseFloat(form.max.value);
        var away = form.away.checked;

        if (min >= max) {
            alert('Minimum duration must be shorter than maximum duration.');
            return false;
        }


        this.randomSequence(min, max, away);
    },

    fillRandomSettings: function() {
        var form = document.getElementById('randomSequence');
        form.min.value = this.defaultRandomSettings.min;
        form.max.value = this.defaultRandomSettings.max;
        form.away.checked = this.defaultRandomSettings.away;
    },

    sendSimpleCommand: function(command) {
        var request = new XMLHttpRequest();
        request.open('GET', '/command/'+command, true);
        request.onreadystatechange = function() {
            if(request.readyState == 4 && request.status != 200) {
                alert('Connection to the controller has been lost.');
            }
        }
        request.send();
    }
    

}

SequenceInput.init(4);
SequenceInput.fillRandomSettings();