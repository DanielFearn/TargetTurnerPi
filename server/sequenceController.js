module.exports = function(debugging = false) {

    const maxTargets = 10;
    var targetStates = [];
    targetStates.length = maxTargets;
    targetStates.fill(0);

    var sequenceIndex = 0;
    var sequence = [];


    function printTargets(){
        if(!debugging) return;
        console.log('State: '+targetStates.join(''));
    }

    return {
        uploadHandler: (req, res) => {
            console.log(req.body);
            sequence = JSON.parse(req.params.data);
            res.end('OK');
        },

        commandHandler: (req, res) => {
            console.log('Command: '+req.params.command);

            switch (req.params.command){
                case 'faceall':
                    targetStates.fill(1);
                    break;
                case 'awayall':
                    targetStates.fill(0);
                    break;
            }

            printTargets();

            res.end('OK');
        }
    }

}