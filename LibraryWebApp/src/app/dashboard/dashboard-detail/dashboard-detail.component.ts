import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Book} from "../../models/book.model";
import {BorrowedService} from "../../services/borrowed.service";
import {FormBuilder} from "@angular/forms";
import {UsersService} from "../../services/users.service";
import {Borrowed} from "../../models/borrowed.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.css']
})
export class DashboardDetailComponent implements OnInit {

  @Input() selectedBook :Book = new Book();
  @Input() authorizationLevel : number = 0;
  @Output() cancelEvent : EventEmitter<void> = new EventEmitter<void>();
  userDisplay: boolean = false;
  users : User[] = [];
  userSubject : BehaviorSubject<User[]> | null=null;
  subscription : Subscription | null = null;
  selectedUser : User = new User();
  query : string = "";
  canBorrow : boolean = false;

  posudbeKorisnika : Borrowed[] = [];
  posudbeKorisnikaSubject : BehaviorSubject<Borrowed[]> | null=null;
  subscription7 : Subscription | null = null;
  errorMessage : string = '';

  constructor(private borrowedService:BorrowedService, private userService:UsersService) { }

  ngOnInit() {
      this.userSubject = this.userService.getUsers();
      this.subscription = this.userSubject
        .subscribe(data => {
          console.log(data); // should be your users.
          this.users = data;
        }, error => {
          console.log(error); // if api returns and error you will get it here
        });

    this.borrowedService.responseEmitter
      .subscribe((error : string) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = "";
        }, 2500)
      });


  }
  onCancel(){
    this.query = "";
    this.selectedUser = new User();
    this.userDisplay = false;
    this.cancelEvent.emit();
  }

  startLending()
  {
    this.userSubject = this.userService.getUsers();
    this.subscription = this.userSubject
      .subscribe(data => {
        console.log(data); // should be your users.
        this.users = data;
      }, error => {
        console.log(error); // if api returns and error you will get it here
      });
    this.userDisplay = true;
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

  showDetail(user: User){
    this.selectedUser = {...user};
    this.posudbeKorisnikaSubject = this.borrowedService.getBorrowed();
    this.subscription7 = this.posudbeKorisnikaSubject
      .subscribe(data => {
        console.log(data); // should be your users.
        this.posudbeKorisnika = data.filter(i => i.userId == this.selectedUser._id);
      }, error => {
        console.log(error); // if api returns and error you will get it here
      });
    this.canBorrow = this.boolLateFee(this.posudbeKorisnika);
  }

  onSubmit(){
    let borrowBook : Borrowed = new Borrowed();
    borrowBook.userId = this.selectedUser._id;
    borrowBook.bookId = this.selectedBook._id;
    let date = new Date();
    borrowBook.timeStamp = date.toLocaleString();
    borrowBook.returnDate = new Date(date.setMonth(date.getMonth()+1)).toLocaleString();
    this.borrowedService.addBorrowed(borrowBook);

    this.query = "";
    this.selectedUser = new User();
    this.userDisplay = false;
    this.cancelEvent.emit();

  }
}
