// import http from "http";
// import express from "express";

import server from './server'

// import mongoose from "mongoose";

import mongo from "./mongo";

//import wsConnect from "./src/wsConnect.js";
//import { WebSocketServer } from "ws";

mongo.connect();

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocketServer({ server });
// const db = mongoose.connection;

// db.once("open", () => {
// 	console.log("MongoDB connected!");
// 	wss.on("connection", (ws) => {
// 		ws.box = "";
// 		ws.onmessage = wsConnect.onMessage(ws); //當ws有message時，執行後面的把丟入method
// 	});
// });

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
