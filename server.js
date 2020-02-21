const express = require("express");
const sys = require("./sys-monitor.js");
const port = process.env.PORT || 8080;

sys.initialize();

express().get("/sys", async (req, res) => {
    res.send(await sys.get())
})
.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
