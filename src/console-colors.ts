export namespace ConsoleColors {
  export const reset = '\x1b[0m';
  export const bright = '\x1b[1m';
  export const dim = '\x1b[2m';
  export const underscore = '\x1b[4m';
  export const blink = '\x1b[5m';
  export const reverse = '\x1b[7m';
  export const hidden = '\x1b[8m';

  export const fgBlack = '\x1b[30m';
  export const fgRed = '\x1b[31m';
  export const fgGreen = '\x1b[32m';
  export const fgYellow = '\x1b[33m';
  export const fgBlue = '\x1b[34m';
  export const fgMagenta = '\x1b[35m';
  export const fgCyan = '\x1b[36m';
  export const fgWhite = '\x1b[37m';

  export const bgBlack = '\x1b[40m';
  export const bgRed = '\x1b[41m';
  export const bgGreen = '\x1b[42m';
  export const bgYellow = '\x1b[43m';
  export const bgBlue = '\x1b[44m';
  export const bgMagenta = '\x1b[45m';
  export const bgCyan = '\x1b[46m';
  export const bgWhite = '\x1b[47m';

  export function notice(message: string, color?: string): void {
    return console.log(`${color ?? dim}${message}${reset}`);
  }

  export function info(message: string, color?: string): void {
    return console.info(`${color ?? bright}${message}${reset}`);
  }

  export function success(message: string, color?: string): void {
    return console.log(`${color ?? fgGreen}${message}${reset}`);
  }

  export function warning(message: string, color?: string): void {
    return console.warn(`${color ?? fgYellow}${message}${reset}`);
  }

  export function error(message: string, color?: string): void {
    return console.error(`${color ?? fgRed}${message}${reset}`);
  }
}
