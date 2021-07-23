const Gpio = require('pigpio').Gpio;
const targetServoPins = [6, 13, 19, 26, 21, 20, 16, 12, 7, 8];
var motors = [];
const facePulseWidth = 500;
const awayPulseWidth = 1500;

//const motor = new Gpio(10, {mode: Gpio.OUTPUT});


module.exports = function(debugging = false) {

    const maxTargets = 10;

    for (var i = 0; i < targetServoPins.length; i++) {
        motors.push(new Gpio(targetServoPins[i], {mode: Gpio.OUTPUT}));
    } 

    var sequenceIndex = 0;
    var sequence = [];
    var sequenceTimeout;

    function stepSequence(){
        if (!sequence[0]) return;

        var currentState = sequence[sequenceIndex].targetState;
        var duration = sequence[sequenceIndex].duration;

        writeToTargets(currentState);

        sequenceIndex++;
        if (sequenceIndex >= sequence.length) {return;}
        sequenceTimeout = setTimeout(stepSequence, duration*1000);
    }

    function writeToTargets(state){
        if (debugging) {
            console.log('State: '+state.join(''));
        }
        // GPIO stuff
        for (var i = 0; i < state.length; i++){
            if (state[i]){
                motors[i].servoWrite(facePulseWidth);
            } else {
                motors[i].servoWrite(awayPulseWidth);
            }
       }
    }

    return {
        uploadHandler: (req, res) => {
            console.log('Uploading');
            sequence = req.body;
            res.end('OK');
        },

        commandHandler: (req, res) => {
            console.log('Command: '+req.params.command);

            switch (req.params.command){
                case 'faceall':
                    writeToTargets(new Array(maxTargets).fill(1));
                    break;
                case 'awayall':
                    writeToTargets(new Array(maxTargets).fill(0));
                    break;
                case 'start':
                    sequenceIndex = 0;
                    stepSequence();
                    break;
                case 'stop':
                    sequenceIndex = 0;
                    clearTimeout(sequenceTimeout);
            }

            res.end('OK');
        }
    }

}
