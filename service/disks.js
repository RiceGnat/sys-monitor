const exec = require("child_process").exec;

const cmd = "wmic logicaldisk where drivetype=3 get name,freespace,size,volumename /format:list";

const get = () => new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            return reject(error);
        }

        resolve(stdout.trim().replace(/\r/g, "").split("\n\n").map(token => {
            var properties = token.trim().split("\n");
            var disk = {};
            properties.forEach(token => {
                var pair = token.trim().split("=");
                var name = pair[0];
                name = name.charAt(0).toLowerCase() + name.slice(1);
                var value = pair[1];

                disk[name] = value;
            });
            return disk;
        }).map(({ name, freeSpace, size, volumeName }) => ({
            name,
            label: volumeName,
            used: size - freeSpace,
            free: parseInt(freeSpace),
            size: parseInt(size),
            usage: Math.trunc((size - freeSpace) / size * 100)
        })));
    });
});

module.exports = { get };