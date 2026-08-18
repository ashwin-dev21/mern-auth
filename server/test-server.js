import express from "express";

const app = express();

app.get("/test", (req, res) => {
    console.log("TEST REQUEST RECEIVED");
    res.send("EXPRESS WORKS");
});

app.listen(4001, "127.0.0.1", () => {
    console.log("TEST SERVER RUNNING");
});