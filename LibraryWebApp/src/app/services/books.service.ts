import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DataService} from "./data.service";
import {Book} from "../models/book.model";

@Injectable({
  providedIn: 'root'
})
export class BooksService {



  books: Book[] = [];
  bookSubject : BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);

  responseEmitter : Subject<string> = new Subject<string>();

  constructor(private http:HttpClient, private dataService:DataService) {
    this.init()
  }

  init(){

    this.dataService.getBooks()
      .subscribe(res => {
        this.books=res;
        this.bookSubject.next([...this.books]);
      })

  }

  getBooks(){

    return this.bookSubject;

  }

  addBook(book:Book){
    this.dataService.addBook(book)
      .subscribe(((res: any) => {
        console.log(res);
        this.responseEmitter.next(res.message.toString());
        book._id = res.insertedId.toString();
        this.books.push(book);
        this.bookSubject.next(this.books);
      }));
  }

  deleteBook(id:string){
    this.dataService.deleteBook(id)
      .subscribe((res => {
        console.log(res);
        this.books=this.books.filter(c => c._id!=id);
        this.bookSubject.next(this.books);
      }));
  }

  editBook(book:Book){
    this.dataService.editBook(book)
      .subscribe((res => {
        console.log(res);
        this.books[this.books.findIndex(c => c._id==book._id)]=book;
        this.bookSubject.next(this.books);
      }),error => {
        console.log(error);
      });
  }
}
