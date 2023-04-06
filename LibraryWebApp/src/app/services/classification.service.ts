import { Injectable } from '@angular/core';
import {Book} from "../models/book.model";
import {BehaviorSubject, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DataService} from "./data.service";
import {Publisher} from "../models/publisher.model";
import {Genre} from "../models/genre.model";
import {Borrowed} from "../models/borrowed.model";

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {




  publishers: Publisher[] = [];
  publisherSubject : BehaviorSubject<Publisher[]> = new BehaviorSubject<Publisher[]>([]);
  genres: Genre[] = [];
  genreSubject : BehaviorSubject<Genre[]> = new BehaviorSubject<Genre[]>([]);

  responseEmitter : Subject<string> = new Subject<string>();

  constructor(private http:HttpClient, private dataService:DataService) {
    this.init()
  }

  init(){


    this.dataService.getPublishers()
      .subscribe(res => {
        this.publishers=res;
        this.publisherSubject.next([...this.publishers]);
      })
    this.dataService.getGenres()
      .subscribe(res => {
        this.genres=res;
        this.genreSubject.next([...this.genres]);
      })

  }


  getPublishers(){

    return this.publisherSubject;

  }
  addPublisher(publisher: Publisher){
    this.dataService.addPublisher(publisher)
      .subscribe(((res: any) => {
      console.log(res);
      this.responseEmitter.next(res.message.toString());
      publisher._id = res.insertedId.toString();
      this.publishers.push(publisher);
      this.publisherSubject.next(this.publishers);
    }));
  }
  getGenres(){

    return this.genreSubject;

  }
  addGenre(genre: Genre){
    this.dataService.addGenre(genre)
      .subscribe(((res: any) => {
      console.log(res);
      this.responseEmitter.next(res.message.toString());
      genre._id = res.insertedId.toString();
      this.genres.push(genre);
      this.genreSubject.next(this.genres);
    }));
  }
}
