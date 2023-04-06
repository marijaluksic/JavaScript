export class Post {
  _id : string
  userId : string;
  timeStamp : string;
  comment : string;

  constructor() {
    this._id="";
    this.userId= "";
    this.timeStamp='';
    this.comment='';
  }
}
