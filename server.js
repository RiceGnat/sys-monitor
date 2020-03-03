const express = require("express");
const cors = require("cors");
const sys = require("./service/sys-monitor.js");
const port = process.env.PORT || 8080;

sys.initialize();

express().use(cors()).get("/sys", async (req, res) => {
    res.send(await sys.get())
})
.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
