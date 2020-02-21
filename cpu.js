const os = require("os");

const POLL_PERIOD = 1000;

let cpus, last;

const mapTimes = cpu => ({
    used: cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.irq,
    idle: cpu.times.idle
});

const initialize = () => {
    // os reports cumulative cpu time, so need to keep track of previous values
    last = os.cpus().map(cpu => mapTimes(cpu));
}

const getUsage = () => {
    let overall = 0;

    const cpus = os.cpus().map((cpu, i) => {
        const current = mapTimes(cpu);
        const diff = {
            used: current.used - last[i].used,
            idle: current.idle - last[i].idle
        };

        const usage = Math.trunc(diff.used / (diff.used + diff.idle) * 100);
        overall += usage;

        last[i] = current;

        return {
            name: cpu.model,
            clock: cpu.speed,
            usage
        }
    });

    overall = Math.trunc(overall / cpus.length);

    return { overall, cpus };
}

const poll = () => {
    cpus = getUsage();
    setTimeout(poll, POLL_PERIOD);
}

const start = () => {
    initialize();
    poll();
}

const get = async () => cpus;

module.exports = { start, get };