import { Injectable } from '@angular/core';
import {Book} from "../models/book.model";
import {BehaviorSubject, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DataService} from "./data.service";
import {Borrowed} from "../models/borrowed.model";

@Injectable({
  providedIn: 'root'
})
export class BorrowedService {




  borrowed: Borrowed[] = [];
  borrowedSubject : BehaviorSubject<Borrowed[]> = new BehaviorSubject<Borrowed[]>([]);
  responseEmitter : Subject<string> = new Subject<string>();

  constructor(private http:HttpClient, private dataService:DataService) {
    this.init()
  }

  init(){

    this.dataService.getBorrowed()
      .subscribe(res => {
        this.borrowed=res;
        this.borrowedSubject.next([...this.borrowed]);
      })

  }

  getBorrowed(){

    return this.borrowedSubject;

  }

  addBorrowed(borrowed:Borrowed){
    this.dataService.addBorrowed(borrowed)
      .subscribe(((res: any) => {
        console.log(res);
        this.responseEmitter.next(res.message.toString());
        borrowed._id = res.insertedId.toString();
        this.borrowed.push(borrowed);
        this.borrowedSubject.next(this.borrowed);
      }));
  }

  deleteBorrowed(id:string){
    this.dataService.deleteBorrowed(id)
      .subscribe((res => {
        console.log(res);
        this.borrowed=this.borrowed.filter(c => c._id!=id);
        this.borrowedSubject.next(this.borrowed);
      }));
  }

  editBorrowed(borrowed:Borrowed){
    this.dataService.editBorrowed(borrowed)
      .subscribe((res => {
        console.log(res);
        this.borrowed[this.borrowed.findIndex(c => c._id==borrowed._id)]=borrowed;
        this.borrowedSubject.next(this.borrowed);
      }),error => {
        console.log(error);
      });
  }
}
