class Colors {
    private Reset: String = "\x1b[0m";
    private Bright: String = "\x1b[1m";
    private Dim: String = "\x1b[2m";
    private Underline: String = "\x1b[4m";
    private Blink: String = "\x1b[5m";
    private Reverse: String = "\x1b[7m";
    private Hidden: String = "\x1b[8m";

    private FgBlack: String = "\x1b[30m";
    private FgRed: String = "\x1b[31m";
    private FgGreen: String = "\x1b[32m";
    private FgYellow: String = "\x1b[33m";
    private FgBlue: String = "\x1b[34m";
    private FgMagenta: String = "\x1b[35m";
    private FgCyan: String = "\x1b[36m";
    private FgWhite: String = "\x1b[37m";

    private BgBlack: String = "\x1b[40m";
    private BgRed: String = "\x1b[41m";
    private BgGreen: String = "\x1b[42m";
    private BgYellow: String = "\x1b[43m";
    private BgBlue: String = "\x1b[44m";
    private BgMagenta: String = "\x1b[45m";
    private BgCyan: String = "\x1b[46m";
    private BgWhite: String = "\x1b[47m";
    //FR
    public black(str){
        return `${this.FgBlack}${str}${this.Reset}`;
    }

    public red(str){
        return `${this.FgRed}${str}${this.Reset}`;
    }

    public green(str){
        return `${this.FgGreen}${str}${this.Reset}`;
    }

    public yellow(str){
        return `${this.FgYellow}${str}${this.Reset}`;
    }

    public blue(str){
        return `${this.FgBlue}${str}${this.Reset}`;
    }

    public magenta(str){
        return `${this.FgMagenta}${str}${this.Reset}`;
    }

    public cyan(str){
        return `${this.FgCyan}${str}${this.Reset}`;
    }
    
    public white(str){
        return `${this.FgWhite}${str}${this.Reset}`;
    }

    //BG
    public bgBlack(str){
        return `${this.BgBlack}${str}${this.Reset}`;
    }

    public bgRed(str){
        return `${this.BgRed}${str}${this.Reset}`;
    }

    public bgGreen(str){
        return `${this.BgGreen}${str}${this.Reset}`;
    }

    public bgYellow(str){
        return `${this.BgYellow}${str}${this.Reset}`;
    }

    public bgBlue(str){
        return `${this.BgBlue}${str}${this.Reset}`;
    }

    public bgMagenta(str){
        return `${this.BgMagenta}${str}${this.Reset}`;
    }

    public bgCyan(str){
        return `${this.BgCyan}${str}${this.Reset}`;
    }
    
    public bgWhite(str){
        return `${this.BgWhite}${str}${this.Reset}`;
    }

    //Other
    public reset(str){
        return `${this.Reset}${str}${this.Reset}`;
    }

    public bright(str){
        return `${this.Bright}${str}${this.Reset}`;
    }

    public dim(str){
        return `${this.Dim}${str}${this.Reset}`;
    }

    public underline(str){
        return `${this.Underline}${str}${this.Reset}`;
    }

    public blink(str){
        return `${this.Blink}${str}${this.Reset}`;
    }

    public reverse(str){
        return `${this.Reverse}${str}${this.Reset}`;
    }

    public hidden(str) {
        return `${this.Hidden}${str}${this.Reset}`;
    }
}

export default new Colors();