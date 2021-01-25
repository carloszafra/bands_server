import { Band } from "./Band";

export class Bands {
   private bands: Band[];

    constructor(){
        this.bands = [];
    }

    public addBand(band: Band): void {
      this.bands.push(band);
    }

    public getBands(): Band[] {
      return this.bands;
    }

    public deleteBands(id: string): Band[] {
        this.bands = this.bands.filter(band => band.id != id);
        return this.bands;
    }

    public voteBand(id: string): void {
        this.bands = this.bands.map(band => {
            if(band.id == id)
            {
                band.votes += 1;
            }
            return band;
        });
    }
}