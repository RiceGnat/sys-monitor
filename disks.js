const exec = require("child_process").exec;

const cmd = "wmic logicaldisk where drivetype=3 get name,freespace,size,volumename /format:list";

const get = () => new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            return reject(error);
        }

        var out = [];
        var data = stdout.trim().replace(/\r/g, "").split("\n\n");
        data.forEach((element) => {
            var properties = element.trim().split("\n");
            var disk = {};
            properties.forEach((element) => {
                var pair = element.trim().split("=");
                var name = pair[0];
                name = name.charAt(0).toLowerCase() + name.slice(1);
                var value = pair[1];

                disk[name] = value;
            });
            out.push(disk);
        });

        return resolve(out);
    });
});

module.exports = { get };