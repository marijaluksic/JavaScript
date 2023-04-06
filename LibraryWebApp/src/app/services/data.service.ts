import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {User} from "../models/user.model";
import {environment} from "../../environments/environment";
import {Book} from "../models/book.model";
import {Borrowed} from "../models/borrowed.model";
import {Genre} from "../models/genre.model";
import {Publisher} from "../models/publisher.model";
@Injectable({
  providedIn: 'root'
})
export class DataService{

  authUrl = environment.API_URL + '/authenticate/register';
  booksRoot = environment.API_URL+ '/books';
  borrowedRoot = environment.API_URL+ '/borrowed';
  classificationRoot = environment.API_URL+ '/classification';
  usersRoot = environment.API_URL+ '/users';

  constructor(private http:HttpClient) {
  }


  getUsers(){

    return this.http.get(this.usersRoot)
      .pipe(map((res:any) => {
      const users=[];
      for (let key in res){
        users.push({...res[key]});
      }
      return users;
    }));


  }

  addUser(user: User){
    return this.http.post(this.authUrl,user);

  }

  getBooks(){
    return this.http.get(this.booksRoot/*, {headers: {'authorization' : this.token.slice(8,this.token.length-1)}}*/)
      .pipe(map((res:any) => {
      const books=[];
      for (let key in res){
        books.push({...res[key]});
      }
      return books;
    }));

  }

  addBook(book: Book){
    return this.http.post(this.booksRoot,book)

  }

  deleteBook(id:string){
    return this.http.delete(this.booksRoot+'/' +id);
  }

  editBook(book: Book){
    return this.http.put(this.booksRoot,book)
  }
  getPublishers() {

    return this.http.get(this.classificationRoot + '/publishers')
      .pipe(map((res: any) => {
        const publishers = [];
        for (let key in res) {
          publishers.push({...res[key]});
        }
        return publishers;
      }));
  }
  addPublisher(publisher:Publisher){
    return this.http.post(this.classificationRoot + '/publishers',publisher)

  }
  getGenres() {

    return this.http.get(this.classificationRoot + '/genres')
      .pipe(map((res: any) => {
        const genres = [];
        for (let key in res) {
          genres.push({...res[key]});
        }
        return genres;
      }));
  }
  addGenre(genre:Genre){
    return this.http.post(this.classificationRoot + '/genres',genre)

  }
  getBorrowed(){

    return this.http.get(this.borrowedRoot)
      .pipe(map((res:any) => {
        const borrowed=[];
        for (let key in res){
          borrowed.push({...res[key]});
        }
        return borrowed;
      }));


  }
  addBorrowed(borrowed:Borrowed){
    return this.http.post(this.borrowedRoot,borrowed)

  }

  deleteBorrowed(id:string){
    return this.http.delete(this.borrowedRoot+'/' +id);
  }

  editBorrowed(borrowed:Borrowed){
    return this.http.put(this.borrowedRoot,borrowed)
  }

}
