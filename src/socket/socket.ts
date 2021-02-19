
import { deleteI } from "../interfaces/deleteband.interface";
import { newbandI } from "../interfaces/new-band.interface";
import { voteI } from "../interfaces/vote.interface";
import { Band } from "../models/Band";
import { Bands } from "../models/Bands";
import { connect } from "../database/config";

import express from "express";
import socketio from "socket.io";
import cookieParser from "cookie-parser";
import { createServer, Server } from 'http';
var cors = require("cors");
require("dotenv").config();
import path from "path";
import { router } from "../routes/auth"
import errorMiddleware from "../middleware/error.middleware";



export class SocketsServer {
    public PORT = process.env.PORT;
    private _app: express.Application;
    private _server: Server;
    private io!: socketio.Server;
    private bands: Bands = new Bands();
    public publicPath = path.resolve(__dirname, "../public");

    constructor(public controllers: any[]) {

        this._app = express();
        this._app.use(cors());
        this._app.options("*", cors());
        this.app.use(cookieParser());
        this._app.use(express.json());
        this._app.use(express.static(this.publicPath));
        this.initErrorMiddleware();

        //routes
        // this._app.use("/api/auth", router);
        this.initializeControllers(controllers);

        this._server = createServer(this._app);
        this.initSocket();
        
        this.Connect();

        this.bands.addBand(new Band("Queen"));
        this.bands.addBand(new Band("AC/DC"));
        this.bands.addBand(new Band("Bon Jovi"));
        this.bands.addBand(new Band("Los Adolecentes"));
    }

    private initSocket(): void {
        this.io = socketio(this._server);

    }

    private initErrorMiddleware(){
        this._app.use(errorMiddleware);
    }

    private initializeControllers(controllers: any[]) {
        controllers.forEach((controller) => {
          this.app.use('/api', controller.router);
        });
    }


    public async Connect(): Promise<void> {
        
        //Connection to MongoDB
        connect();
       
        //Server Run
        this._server.listen(this.PORT, () => {
            console.log("Running on port %s", this.PORT);
        });


        //Socket events
        this.io.on("connection", (client: any) => {
            console.log("Client connected");

            client.emit("active-bands", this.bands.getBands());

            client.on("message", (data: Object) => {
                console.log(data);
                this.io.emit("message", data);
            });

            client.on("send-notification", (data: Object) => {
                console.log(data);
                client.broadcast.emit("notification", data);
            });

            client.on("vote", (vote: voteI) => {
                this.bands.voteBand(vote.id);
                this.emitBands(this.io);
            });

            client.on("new-band", (band: newbandI) => {
                const new_band = new Band(band.name);
                this.bands.addBand(new_band);
                this.emitBands(this.io);
            });

            client.on("delete-band", (band: deleteI) => {
                this.bands.deleteBands(band.id);
                this.emitBands(this.io);
            })

            client.on('disconnect', () => console.log("Client disconnected"));
        });

    }

    private emitBands(io: any): void {
        io.emit("active-bands", this.bands.getBands());

    }

    get app (): express.Application {
        return this._app;
    }
}

