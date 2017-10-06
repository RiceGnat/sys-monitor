const http = require("http");
const url = require("url");
const sys = require("./sys-monitor.js");

sys.initialize();

const server = http.createServer((req, res) => {
    var reqUrl = url.parse(req.url, true);
    if (reqUrl.pathname.split("/")[1].toLowerCase() == "sys") {
        //var options = reqUrl.query;
        sys.getInfo((error, results) => {
            if (error) {
                res.writeHead(500);
                res.end(error);
            }
            else {
                res.writeHead(200, { "Content-Type": "text/json" });
                res.end(JSON.stringify(results));
            }
        });
    }
    else {
        res.writeHead(404);
        res.end();
    }
}).listen(process.env.PORT | 8080);
