'use strict';

const Reset = '\x1b[0m';
const Bright = '\x1b[1m';
const Dim = '\x1b[2m';
const Underline = '\x1b[4m';
const Blink = '\x1b[5m';
const Reverse = '\x1b[7m';
const Hidden = '\x1b[8m';

const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

const BgBlack = '\x1b[40m';
const BgRed = '\x1b[41m';
const BgGreen = '\x1b[42m';
const BgYellow = '\x1b[43m';
const BgBlue = '\x1b[44m';
const BgMagenta = '\x1b[45m';
const BgCyan = '\x1b[46m';
const BgWhite = '\x1b[47m';

module.exports = {
  black: (str) => `${FgBlack}${str}${Reset}`,
  red: (str) => `${FgRed}${str}${Reset}`,
  green: (str) => `${FgGreen}${str}${Reset}`,
  yellow: (str) => `${FgYellow}${str}${Reset}`,
  blue: (str) => `${FgBlue}${str}${Reset}`,
  magenta: (str) => `${FgMagenta}${str}${Reset}`,
  cyan: (str) => `${FgCyan}${str}${Reset}`,
  white: (str) => `${FgWhite}${str}${Reset}`,
  bgBlack: (str) => `${BgBlack}${str}${Reset}`,
  bgRed: (str) => `${BgRed}${str}${Reset}`,
  bgGreen: (str) => `${BgGreen}${str}${Reset}`,
  bgYellow: (str) => `${BgYellow}${str}${Reset}`,
  bgBlue: (str) => `${BgBlue}${str}${Reset}`,
  bgMagenta: (str) => `${BgMagenta}${str}${Reset}`,
  bgCyan: (str) => `${BgCyan}${str}${Reset}`,
  bgWhite: (str) => `${BgWhite}${str}${Reset}`,
  reset: (str) => `${Reset}${str}${Reset}`,
  bright: (str) => `${Bright}${str}${Reset}`,
  dim: (str) => `${Dim}${str}${Reset}`,
  underline: (str) => `${Underline}${str}${Reset}`,
  blink: (str) => `${Blink}${str}${Reset}`,
  reverse: (str) => `${Reverse}${str}${Reset}`,
  hidden: (str) => `${Hidden}${str}${Reset}`,
};
