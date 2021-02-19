import mongoose = require("mongoose");
require("dotenv").config();

let database = mongoose.connection;

export const connect =  () => {
   
    const uri: string = `${process.env.MONGO_DB_URI}`;
    

    // if(database){
    //     return;
    // }

    console.log("despues")

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    database = mongoose.connection;

    database.once("open", async() => {
        console.log("conected to database");
    });

    database.on("error", (err) => {
        console.log(`error : ${err}`);
    })
}

export const disconnect = () => {
    if (!database) {
      return;
    }
    mongoose.disconnect();
  };