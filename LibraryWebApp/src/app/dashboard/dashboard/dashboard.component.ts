import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";
import {Book} from "../../models/book.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BooksService} from "../../services/books.service";
import {ClassificationService} from "../../services/classification.service";
import {Genre} from "../../models/genre.model";
import {Publisher} from "../../models/publisher.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user : User | null = null;
  knjige : Book[] = [];
  bookSubject : BehaviorSubject<Book[]> | null=null;
  subscription : Subscription | null = null;


  genres : Genre[] = [];
  genreSubject : BehaviorSubject<Genre[]> | null=null;
  subscription3 : Subscription | null = null;

  publishers : Publisher[] = [];
  publisherSubject : BehaviorSubject<Publisher[]> | null=null;
  subscription4 : Subscription | null = null;

  new : Book = new Book();

  query='';
  query2='';
  bookClick : Book | null = null;




  constructor(private http: HttpClient, private dataService: DataService, private auth : AuthService, private route:ActivatedRoute, private router:Router, private booksService: BooksService, private classificationService: ClassificationService) { }

  ngOnInit() {
    this.user = this.auth.getUser();

    this.bookSubject = this.booksService.getBooks();
    this.subscription = this.bookSubject
      .subscribe(data => {
        console.log(data); // should be your users.
        this.knjige = data;
      }, error => {
        console.log(error); // if api returns and error you will get it here
      });

    this.genreSubject = this.classificationService.getGenres();
    this.subscription3 = this.genreSubject.
    subscribe(data => {
      console.log(data); // should be your users.
      this.genres = data;
    }, error => {
      console.log(error); // if api returns and error you will get it here
    });
    this.publisherSubject = this.classificationService.getPublishers();
    this.subscription4 = this.publisherSubject.
    subscribe(data => {
      console.log(data); // should be your users.
      this.publishers = data;
    }, error => {
      console.log(error); // if api returns and error you will get it here
    });
  }


  genreIdToName(id:string) {
    if(this.genres.length<1)
    {
      this.genreSubject = this.classificationService.getGenres();
      this.subscription3 = this.genreSubject.
      subscribe(data => {
        console.log(data); // should be your users.
        this.genres = data;
      }, error => {
        console.log(error); // if api returns and error you will get it here
      });
    }
    let genre = this.genres.filter(k => k._id == id).map(k => k.name);
    return genre;
  }
  publisherIdToName(id:string) {
    let publisher = this.publishers.filter(k => k._id == id).map(k => k.name);
    return publisher;
  }


  showDetail(book: Book){
    let book1 : Book = {...book};
    book1.publisherId = this.publisherIdToName(book1.publisherId).toString();
    book1.genreId= this.genreIdToName(book1.genreId).toString();
    this.bookClick = book1;
  }
  profile() {
    this.router.navigate(['profile']);
  }

  admin() {
    this.router.navigate(['admin']);
  }
  returns() {
    this.router.navigate(['returns']);
  }
  logout(){
    this.auth.logout();
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}
