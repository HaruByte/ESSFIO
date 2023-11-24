const oldConsole = console; // Prevent stack overflow

console = {
    ...oldConsole,
    log: (string) => {
        oldConsole.log(`[ESSFIO] [LOG] [${timestamp()}]`, string);
    },
    error: (string) => {
        oldConsole.error(`[ESSFIO] [ERROR] [${timestamp()}]`, string);
    },
    warn: (string) => {
        oldConsole.warn(`[ESSFIO] [WARN] [${timestamp()}]`, string);
    }
}

function timestamp() {
    const date = new Date();
    const ss = date.getSeconds().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");
    const hh = date.getHours().toString().padStart(2, "0");
    
    return `${hh}:${mm}:${ss}`;
}