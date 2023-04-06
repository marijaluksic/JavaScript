export class Borrowed {
  _id : string
  userId : string;
  bookId : string;
  timeStamp : string;
  returnDate : string;

  constructor() {
    this._id="";
    this.userId= "";
    this.bookId= "";
    this.timeStamp='';
    this.returnDate='';
  }
}
