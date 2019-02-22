module.exports = {
    processArgs: function() {
        //Get all command line args (current options are -env <prod,qa,dev> and -logging off
        const args = {};
        for (let i = 0; i < process.argv.length; i++) {
            if (process.argv[i] === '-env') {
                args.env = process.argv[i + 1];
            }
            if (process.argv[i] === '-logging') {
                args.logging = process.argv[i + 1];
            }
        }
        return args;
    }
};
