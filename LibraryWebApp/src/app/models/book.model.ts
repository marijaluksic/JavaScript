export class Book {
  _id : string
  title : string;
  authorId : string;
  edition : number;
  publisherId: string;
  genreId: string;

  constructor() {
    this._id="";
    this.title= "";
    this.authorId='';
    this.edition= 0;
    this.publisherId = "";
    this.genreId = "";
  }
}
