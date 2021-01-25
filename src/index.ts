import express from "express";
import path from "path";
require("dotenv").config();
import {Sockets} from "./socket/socket";

const app = express();
const socket = new Sockets();

//node server
const server = require("http").createServer(app);
export const io = require("socket.io")(server);

app.set("port", 3001);

socket.Connect();

// io.on("connection", (client: any) => {
//    console.log("Client connected");
//    client.on('message', (data: any) => { 
//       console.log(data);

//       io.emit("message", data);
//    });
//   client.on('disconnect', () => console.log("Client disconnected"));
// })



const publicPath = path.resolve(__dirname, "public");

app.use(express.static(publicPath));

server.listen(process.env.PORT, () => {
   console.log(`Server on port ${process.env.PORT}`);
});