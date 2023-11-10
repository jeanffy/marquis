export var ConsoleColors;
(function (ConsoleColors) {
    ConsoleColors.reset = '\x1b[0m';
    ConsoleColors.bright = '\x1b[1m';
    ConsoleColors.dim = '\x1b[2m';
    ConsoleColors.underscore = '\x1b[4m';
    ConsoleColors.blink = '\x1b[5m';
    ConsoleColors.reverse = '\x1b[7m';
    ConsoleColors.hidden = '\x1b[8m';
    ConsoleColors.fgBlack = '\x1b[30m';
    ConsoleColors.fgRed = '\x1b[31m';
    ConsoleColors.fgGreen = '\x1b[32m';
    ConsoleColors.fgYellow = '\x1b[33m';
    ConsoleColors.fgBlue = '\x1b[34m';
    ConsoleColors.fgMagenta = '\x1b[35m';
    ConsoleColors.fgCyan = '\x1b[36m';
    ConsoleColors.fgWhite = '\x1b[37m';
    ConsoleColors.bgBlack = '\x1b[40m';
    ConsoleColors.bgRed = '\x1b[41m';
    ConsoleColors.bgGreen = '\x1b[42m';
    ConsoleColors.bgYellow = '\x1b[43m';
    ConsoleColors.bgBlue = '\x1b[44m';
    ConsoleColors.bgMagenta = '\x1b[45m';
    ConsoleColors.bgCyan = '\x1b[46m';
    ConsoleColors.bgWhite = '\x1b[47m';
    function notice(message, color) {
        return console.log(`${color ?? ConsoleColors.dim}${message}${ConsoleColors.reset}`);
    }
    ConsoleColors.notice = notice;
    function info(message, color) {
        return console.info(`${color ?? ConsoleColors.bright}${message}${ConsoleColors.reset}`);
    }
    ConsoleColors.info = info;
    function success(message, color) {
        return console.log(`${color ?? ConsoleColors.fgGreen}${message}${ConsoleColors.reset}`);
    }
    ConsoleColors.success = success;
    function warning(message, color) {
        return console.warn(`${color ?? ConsoleColors.fgYellow}${message}${ConsoleColors.reset}`);
    }
    ConsoleColors.warning = warning;
    function error(message, color) {
        return console.error(`${color ?? ConsoleColors.fgRed}${message}${ConsoleColors.reset}`);
    }
    ConsoleColors.error = error;
})(ConsoleColors || (ConsoleColors = {}));
//# sourceMappingURL=console-colors.mjs.map