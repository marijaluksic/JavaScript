import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {User} from "../../models/user.model";
import {Book} from "../../models/book.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BooksService} from "../../services/books.service";
import {ClassificationService} from "../../services/classification.service";
import {UsersService} from "../../services/users.service";
import {Borrowed} from "../../models/borrowed.model";
import {BorrowedService} from "../../services/borrowed.service";

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css']
})
export class ReturnsComponent implements OnInit {

  @Output() cancelEvent : EventEmitter<void> = new EventEmitter<void>();

  user : User | null = null;

  korisnici : User[] = [];
  korisnikSubject : BehaviorSubject<User[]> | null=null;
  subscription5 : Subscription | null = null;

  posudbe : Borrowed[] = [];
  borrowedSubject : BehaviorSubject<Borrowed[]> | null=null;
  subscription6 : Subscription | null = null;

  knjige : Book[] = [];
  bookSubject : BehaviorSubject<Book[]> | null=null;
  subscription : Subscription | null = null;

  posudbeKorisnika : Borrowed[] = [];
  posudbeKorisnikaSubject : BehaviorSubject<Borrowed[]> | null=null;
  subscription7 : Subscription | null = null;

  query='';

  selectedUser : User = new User();
  selectedReturn:Borrowed=new Borrowed();
  canExtendLoan: boolean = false;

  cancelUser:boolean = false;

  showPosudbeKorisnika : boolean = false;
  highlight : string = "";
  showSelectedPosudba : boolean = false;


  constructor(private http: HttpClient,private borrowedService: BorrowedService, private userService: UsersService, private dataService: DataService, private auth : AuthService, private route:ActivatedRoute, private router:Router, private booksService: BooksService) { }

  ngOnInit() {
    this.user = this.auth.getUser();

    this.korisnikSubject = this.userService.getUsers();
    this.subscription5 = this.korisnikSubject.
    subscribe(data => {
      console.log(data); // should be your users.
      this.korisnici = data;
    }, error => {
      console.log(error); // if api returns and error you will get it here
    });

    this.borrowedSubject = this.borrowedService.getBorrowed();
    this.subscription6 = this.borrowedSubject.
    subscribe(data => {
      console.log(data); // should be your users.
      this.posudbe = data;
    }, error => {
      console.log(error); // if api returns and error you will get it here
    });

    this.bookSubject = this.booksService.getBooks();
    this.subscription = this.bookSubject
      .subscribe(data => {
        console.log(data); // should be your users.
        this.knjige = data;
      }, error => {
        console.log(error); // if api returns and error you will get it here
      });
  }

  showDetail(user: User){
    this.selectedUser = {...user};
    this.selectedReturn = new Borrowed();
    this.cancelUser = false;
    this.showPosudbeKorisnika = false;
    this.highlight = "";
  }

  calculateLateFee(posudbe: Borrowed[])
  {
    let lateFee = 0;
    let today = new Date();
    for(let i =0; i<posudbe.length;i++)
    {
      let returnDate = new Date(posudbe[i].returnDate);
      if(returnDate < today)
      {
        let difference = today.getTime() - returnDate.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        lateFee = lateFee + (TotalDays*0.1);
      }
    }
    return lateFee.toPrecision(2);
  }
  boolLateFee(posudbe: Borrowed[])
  {
    let fee=parseFloat(this.calculateLateFee(posudbe));
    if(fee>parseFloat("0"))
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  calculateReturnDate(borrowed:string, current: string)
  {
    let value1 = new Date(borrowed);
    let value2 = new Date(current);
    let difference = value2.getTime() - value1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));

    let date2 = new Date(value2.setMonth(value2.getMonth()+1));
    let date3 = new Date();

    if(TotalDays>56 && date2>date3)
    {
      return true;
    }
    else
    {
      return false;
    }



  }

  confirmUser(){
    this.posudbeKorisnikaSubject = this.borrowedService.getBorrowed();
    this.subscription7 = this.posudbeKorisnikaSubject
      .subscribe(data => {
      console.log(data); // should be your users.
      this.posudbeKorisnika = data.filter(i => i.userId == this.selectedUser._id);
    }, error => {
      console.log(error); // if api returns and error you will get it here
    });
    this.showPosudbeKorisnika = true;
    this.cancelUser = true;
  }

  bookIdToTitle(id:string) {
    let title = this.knjige.filter(k => k._id == id).map(k => k.title);
    return title;
  }

  showReturnDetail(borrowed: Borrowed){
    this.selectedReturn = {...borrowed};
    if((this.boolLateFee(this.posudbeKorisnika)) || this.calculateReturnDate(this.selectedReturn.timeStamp, this.selectedReturn.returnDate))
    {
      this.canExtendLoan = true;
    }
    else {
      this.canExtendLoan = false;
    }
    this.highlight = this.selectedReturn._id;
  }

  extendLoan()
  {
    let date = new Date(this.selectedReturn.returnDate);
    this.selectedReturn.returnDate = new Date(date.setMonth(date.getMonth()+1)).toLocaleString();
    this.borrowedService.editBorrowed(this.selectedReturn);
    this.selectedReturn = new Borrowed();
    this.highlight = "";
  }

  deleteBorrowed()
  {
    this.borrowedService.deleteBorrowed(this.selectedReturn._id);
    this.selectedReturn = new Borrowed();
    this.highlight = "";
    this.cancelEvent.emit();
  }
  onCancelUser(){
    this.query = "";
    this.selectedUser = new User();
    this.highlight = "";
    this.cancelEvent.emit();
  }
  onCancel(){
    this.selectedReturn = new Borrowed();
    this.showPosudbeKorisnika = false;
    this.cancelUser = false;
    this.highlight = "";
    this.cancelEvent.emit();
  }

  backToDashboard(){
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}
