const os = require("os");
const speedfan = require("speedfan");
const cpu = require("./cpu-usage.js");
const disks = require("./disks.js");

const initialize = function () {
    cpu.start();
}

const returnIfDone = function (out, callback) {
    if (out.cpu && out.memory && out.disks && out.temps && out.fans && out.volts &&
        typeof callback === "function")
        callback(null, out);
}

const getInfo = function (callback) {
    var out = {};
    var isError = false;

    cpu.poll((results) => {
        out.cpu = results;
        returnIfDone(out, callback);
    });

    out.memory = {
        free: os.freemem(),
        total: os.totalmem()
    };

    speedfan.poll(false, (error, results) => {
        if (error) {
            if (!isError && typeof callback === "function") callback(error);
            isError = true;
            return;
        }
        out.temps = results.temps;
        out.fans = results.fans;
        out.volts = results.volts;
        returnIfDone(out, callback);
    });

    disks.getAll((error, results) => {
        if (error) {
            if (!isError && typeof callback === "function") callback(error);
            isError = true;
            return;
        }
        out.disks = results;
        returnIfDone(out, callback);
    });
}

module.exports = {
    getInfo: getInfo,
    initialize: initialize
};