export namespace mediaapi {
	
	export class ThumbnailData {
	    id: string;
	    image: string;
	
	    static createFrom(source: any = {}) {
	        return new ThumbnailData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.image = source["image"];
	    }
	}

}

