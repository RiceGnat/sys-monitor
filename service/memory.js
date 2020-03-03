const os = require("os");

module.exports = {
    get: async () => {
        const free = os.freemem();
        const total = os.totalmem();
        const used = total - free;
        return {
            used,
            free,
            total,
            usage: Math.trunc(used / total * 100)
        }
    }
}