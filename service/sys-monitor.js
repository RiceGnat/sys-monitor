const os = require("os");
// const speedfan = require("sensor");
const cpu = require("./cpu");
const memory = require("./memory");
const disk = require("./disks");

const modules = { cpu, memory, disk };

const initialize = function () {
    cpu.start();
}

const get = async () => {
    const keys = Object.keys(modules);
    const results = await Promise.all(keys.map(key => modules[key].get()));

    return results.reduce((out, current, i) => {
        return out.concat((Array.isArray(current) ? current : [current]).map(item => ({
            type: keys[i],
            data: item
        })))
    }, []);
}

module.exports = {
    get,
    initialize
};