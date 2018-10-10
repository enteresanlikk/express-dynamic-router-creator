const Reset = "\x1b[0m";
const Bright = "\x1b[1m";
const Dim = "\x1b[2m";
const Underline = "\x1b[4m";
const Blink = "\x1b[5m";
const Reverse = "\x1b[7m";
const Hidden = "\x1b[8m";

const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";

const BgBlack = "\x1b[40m";
const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";
const BgBlue = "\x1b[44m";
const BgMagenta = "\x1b[45m";
const BgCyan = "\x1b[46m";
const BgWhite = "\x1b[47m";

class Colors{
    //FR
    black(str){
        return `${FgBlack}${str}${Reset}`;
    }

    red(str){
        return `${FgRed}${str}${Reset}`;
    }

    green(str){
        return `${FgGreen}${str}${Reset}`;
    }

    yellow(str){
        return `${FgYellow}${str}${Reset}`;
    }

    blue(str){
        return `${FgBlue}${str}${Reset}`;
    }

    magenta(str){
        return `${FgMagenta}${str}${Reset}`;
    }

    cyan(str){
        return `${FgCyan}${str}${Reset}`;
    }
    
    white(str){
        return `${FgWhite}${str}${Reset}`;
    }

    //BG
    bgBlack(str){
        return `${BgBlack}${str}${Reset}`;
    }

    bgRed(str){
        return `${BgRed}${str}${Reset}`;
    }

    bgGreen(str){
        return `${BgGreen}${str}${Reset}`;
    }

    bgYellow(str){
        return `${BgYellow}${str}${Reset}`;
    }

    bgBlue(str){
        return `${BgBlue}${str}${Reset}`;
    }

    bgMagenta(str){
        return `${BgMagenta}${str}${Reset}`;
    }

    bgCyan(str){
        return `${BgCyan}${str}${Reset}`;
    }
    
    bgWhite(str){
        return `${BgWhite}${str}${Reset}`;
    }

    //Other
    reset(str){
        return `${Reset}${str}${Reset}`;
    }

    bright(str){
        return `${Bright}${str}${Reset}`;
    }

    dim(str){
        return `${Dim}${str}${Reset}`;
    }

    underline(str){
        return `${Underline}${str}${Reset}`;
    }

    blink(str){
        return `${Blink}${str}${Reset}`;
    }

    reverse(str){
        return `${Reverse}${str}${Reset}`;
    }

    hidden(str){
        return `${Hidden}${str}${Reset}`;
    }
}

module.exports = new Colors();