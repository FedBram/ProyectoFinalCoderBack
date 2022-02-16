import log4js from "log4js";

log4js.configure({
    appenders:{
        console: {type:'console'},
        logWarn: {type:'file', filename: 'warn.log'},
        logErr: {type: 'file', filename: 'error.log'}
    },

    categories:{
        default: {appenders: ["console"], level: 'trace'},
        consola: {appenders: ['console'], level: 'info'},
        warnFile: {appenders: ['logWarn'], level: 'warn'},
        errorFile: {appenders: ['logErr'], level: 'error'}
    }
});

const loggerConsole = log4js.getLogger('consola');
const loggerWarn = log4js.getLogger('warnFile');
const loggerError = log4js.getLogger('errorFile');

export { loggerConsole, loggerWarn, loggerError}