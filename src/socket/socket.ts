import { io } from "../index";
import { deleteI } from "../interfaces/deleteband.interface";
import { newbandI } from "../interfaces/new-band.interface";
import { voteI } from "../interfaces/vote.interface";
import { Band } from "../models/Band";
import { Bands } from "../models/Bands";

export class Sockets {

    private io = null;
    private bands: Bands = new Bands();

    constructor(){
        this.io = io;
        this.bands.addBand(new Band("Queen"));
        this.bands.addBand(new Band("AC/DC"));
        this.bands.addBand(new Band("Bon Jovi"));
        this.bands.addBand(new Band("Los Adolecentes"));


        console.log(this.bands);
    }

    

   public Connect(): void {
       io.on("connection", (client:any) => {
           console.log("Client connected");

           client.emit("active-bands", this.bands.getBands());

           client.on("message", (data: Object) => {
              console.log(data);
              io.emit("message", data);
           });

           client.on("send-notification", (data: Object) => {
               console.log(data);
               client.broadcast.emit("notification", data);
           });

           client.on("vote", (vote: voteI) => {
              this.bands.voteBand(vote.id);
              this.emitBands(io);
           });

           client.on("new-band", (band: newbandI) => {
               const new_band = new Band(band.name);
               this.bands.addBand(new_band);
               this.emitBands(io);
           });

           client.on("delete-band", (band: deleteI) => {
               this.bands.deleteBands(band.id);
               this.emitBands(io);
           })

           client.on('disconnect', () => console.log("Client disconnected"));
       });
       
    }

    private emitBands(io: any): void {
      io.emit("active-bands", this.bands.getBands());
    }
}

// (function main() {
//     const howSum = (target: number, numbers: number[], memo = {} ) => {
//         if(target in memo) return memo[target];
//         if(target === 0) return [];
//         if(target < 0) return null;
        
//         for(let num of numbers){
//             const remainder = target - num;
//             const result = howSum(remainder, numbers, memo);
//             if(result != null){
//                 memo[target] = [...result, num];
//                 return memo[target];
//             }
//         }
//         memo[target] = null;
//         return null;
//     }
    
//     console.log(howSum(300, [5,3,4,7]));
// }());