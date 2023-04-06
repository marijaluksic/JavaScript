import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BorrowedService} from "../../services/borrowed.service";
import {UsersService} from "../../services/users.service";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../models/user.model";
import {Book} from "../../models/book.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {Genre} from "../../models/genre.model";
import {Publisher} from "../../models/publisher.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BooksService} from "../../services/books.service";
import {ClassificationService} from "../../services/classification.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  user : User | null = null;
  editValue = -1;
  addValue = false;
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


  errorMessage : string = '';
  errorMessage2 : string = '';
  addForm! : FormGroup;
  submitted = false;


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

    this.addForm = new FormGroup({
        'title' : new FormControl('', [Validators.required]),
        'authorId' : new FormControl('', [Validators.required]),
        'edition' : new FormControl('', [Validators.required]),
        'publisherId' : new FormControl('', [Validators.required]),
        'genreId' : new FormControl('', [Validators.required])
      }
    );
    this.booksService.responseEmitter
      .subscribe((error : string) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = "";
        }, 2500)
      });
    this.classificationService.responseEmitter
      .subscribe((error : string) => {
        this.errorMessage2 = this.errorMessage2 + error + "\n";
        setTimeout(() => {
          this.errorMessage2 = "";
        }, 2500)
      });

  }

  checkIfGenreExists(name:string)
  {
    let genreExists = this.genres.filter(i => i.name.toLowerCase() == name.toLowerCase().trim());
    if(genreExists.length>0)
    {
      return true;
    }
    else
    {
      let newGenre = new Genre();
      newGenre.name = name;
      this.classificationService.addGenre(newGenre);
      return false;
    }
  }


  checkIfPublisherExists(name:string)
  {
    let publisherExists = this.publishers.filter(i => i.name.toLowerCase() == name.toLowerCase().trim());
    if(publisherExists.length>0)
    {
      return true
    }
    else
    {
      let newPublisher = new Publisher();
      newPublisher.name = name;
      this.classificationService.addPublisher(newPublisher);
      return false;
    }
  }

  genreIdToName(id:string) {
    let genre = this.genres.filter(k => k._id == id).map(k => k.name);
    return genre;
  }
  publisherIdToName(id:string) {
    let publisher = this.publishers.filter(k => k._id == id).map(k => k.name);
    return publisher;
  }
  onAddBook(){
    this.submitted = true;

    if (this.addForm.invalid) {
      return;
    }
    this.new = this.addForm.value;
    let genreBool = this.checkIfGenreExists(this.addForm.value.genreId);
    if(genreBool)
    {
      let find = this.genres.filter(i => i.name.toLowerCase() == this.addForm.value.genreId.toLowerCase().trim());
      this.new.genreId = find[0]._id;
    }
    else
    {
      setTimeout(() => {
        if(!genreBool)
        {
          let find = this.genres.filter(i => i.name.toLowerCase() == this.addForm.value.genreId.toLowerCase().trim());
          this.new.genreId = find[0]._id;
        }

      }, 2000);
    }
    let publisherBool = this.checkIfPublisherExists(this.addForm.value.publisherId);
    if(publisherBool)
    {
      let find = this.publishers.filter(i => i.name.toLowerCase() == this.addForm.value.publisherId.toLowerCase().trim());
      this.new.publisherId = find[0]._id;
    }
    else
    {
      setTimeout(() => {
        if(!publisherBool)
        {
          let find = this.publishers.filter(i => i.name.toLowerCase() == this.addForm.value.publisherId.toLowerCase().trim());
          this.new.publisherId = find[0]._id;


        }
      }, 4000);
    }


    setTimeout(() => {
      this.booksService.addBook(this.new);

      this.new = {_id: '', title: '', authorId : '', edition:0, publisherId: '', genreId: ''};

    }, 6000);

  }

  backToDashboard(){
    this.router.navigate(['']);
  }
}
