import { Injectable, OnInit } from '@angular/core';
import {User} from "../models/user.model";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DataService} from "./data.service";
import {environment} from "../../environments/environment";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usersUrl = environment.API_URL + '/api/users';
  authUrl = environment.API_URL + '/authenticate/register';

  users : User[] = [];
  userSubject : BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  responseEmitter : Subject<string> = new Subject<string>();
  constructor(private http:HttpClient, private dataService:DataService) {
    this.init()
  }

  init(){




    this.dataService.getUsers()
      .subscribe(res=> {
        this.users= res;
        console.log(res);
        this.userSubject.next([...this.users]);
      })

  }

  getUsers(){
    return this.userSubject;

  }

  addUser(user: User){
    this.dataService.addUser(user)
      .subscribe(((res: any) => {
        console.log(res);
        this.responseEmitter.next(res.message.toString());
        user._id = res.insertedId.toString();
        this.users.push(user);
        this.userSubject.next(this.users);
      }));
  }

}
