module.exports = function(debugging = false) {

    var targetStates = [];
    targetStates.length = 10;
    targetStates.fill(0);

    function printTargets(){
        if(!debugging) return;
        console.log('State: '+targetStates.join(''));
    }

    return {
        uploadHandler: (req, res) => {
            console.log('Data: '+req.params.data);
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