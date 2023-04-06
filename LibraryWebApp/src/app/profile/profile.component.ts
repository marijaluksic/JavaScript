import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../models/user.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../services/data.service";
import {AuthService} from "../services/auth.service";
import {FormBuilder} from "@angular/forms";
import {Book} from "../models/book.model";
import {BooksService} from "../services/books.service";
import {Borrowed} from "../models/borrowed.model";
import {BorrowedService} from "../services/borrowed.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user : User | null = null;

  borrowed : Borrowed[] = [];
  borrowedSubject : BehaviorSubject<Borrowed[]> | null=null;
  subscription : Subscription | null = null;

  books : Book[] = [];
  bookSubject : BehaviorSubject<Book[]> | null=null;
  subscription2 : Subscription | null = null;

  constructor(private http: HttpClient, private dataService: DataService, private auth : AuthService, private route:ActivatedRoute, private router:Router, private borrowedService: BorrowedService, private fb : FormBuilder, private bookService: BooksService) { }

  ngOnInit(){

    this.user = this.auth.getUser();
    this.borrowedSubject = this.borrowedService.getBorrowed();
    this.subscription = this.borrowedSubject.
    subscribe(data => {
      console.log(data); // should be your users.
      this.borrowed = data.filter(borrowed => borrowed.userId == this.user?._id);
    }, error => {
      console.log(error); // if api returns and error you will get it here
    });
    this.bookSubject = this.bookService.getBooks();
    this.subscription2 = this.bookSubject
   .subscribe(data => {
      console.log(data); // should be your users.
      this.books = data;
    }, error => {
      console.log(error); // if api returns and error you will get it here
    });
  }
  back(){
    this.router.navigate(['/']);
  }
  bookIdToTitle(id:string) {
    let title = this.books.filter(k => k._id == id).map(k => k.title);
    return title;
  }
  bookIdToAuthor(id:string) {
    let author = this.books.filter(k => k._id == id).map(k => k.authorId);
    return author;
  }
  calculateLateFee()
  {
    let lateFee = 0;
    let today = new Date();
    for(let i =0; i<this.borrowed.length;i++)
    {
      let returnDate = new Date(this.borrowed[i].returnDate);
        if(returnDate < today)
        {
          let difference = today.getTime() - returnDate.getTime();
          let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
          lateFee = lateFee + (TotalDays*0.1);
        }
    }
    return lateFee.toPrecision(2);
  }
}
