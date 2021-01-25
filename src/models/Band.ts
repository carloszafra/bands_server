import * as uuid from "uuid";

export class Band {

    public id: string = uuid.v4();
    public name: string = "";
    public votes: number = 0;

    constructor(name: string = "no name"){
       this.name = name;

    }
}