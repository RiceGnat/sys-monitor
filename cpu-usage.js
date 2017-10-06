const os = require("os");

const POLL_PERIOD = 1000;

var cpus = os.cpus();
var last = [];
var average;
var out = [];

var timeout;

const initialize = function () {
    for (var i = 0; i < cpus.length; i++) {
        var cpu = cpus[i];

        out.push({
            name: cpu.model,
            clock: cpu.speed
        });
        var used = cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.irq;
        last.push({
            used: used,
            free: cpu.times.idle
        });
    }
}

const poll = function () {
    var cpus = os.cpus();
    average = 0;
    for (var i = 0; i < cpus.length; i++) {
        var cpu = cpus[i];

        var used = cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.irq;
        var free = cpu.times.idle;

        out[i].usage = Math.trunc((used - last[i].used) / (used - last[i].used + free - last[i].free) * 100);

        average += out[i].usage;

        last[i].used = used;
        last[i].free = free;
    }
    average = Math.trunc(average / cpus.length);
}

const pollOnce = function (callback) {
    initialize();

    setTimeout(() => {
        poll();
        if (typeof callback === "function") callback(out);
    }, POLL_PERIOD);
}

const start = function () {
    initialize();

    var continuousPoll = () => {
        poll();
        timeout = setTimeout(continuousPoll, POLL_PERIOD);
    }

    timeout = setTimeout(continuousPoll, POLL_PERIOD);
}

const stop = function () {
    clearTimeout(timeout);
}

const get = function (callback) {
    if (timeout) {
        if (typeof callback === "function") callback(out);
    }
    else {
        pollOnce(callback);
    }
}

module.exports = {
    poll: get,
    start: start,
    stop: stop
};