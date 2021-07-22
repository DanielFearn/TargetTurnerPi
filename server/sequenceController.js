module.exports = function(debugging = false) {


    return {
        uploadHandler: (req, res) => {
            console.log('Data: '+req.params.data);
            res.end('OK');
        },

        commandHandler: (req, res) => {
            console.log('Command: '+req.params.command);
            res.end('OK');
        }
    }

}