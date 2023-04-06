import { Injectable, OnInit } from '@angular/core';
import {User} from "./user.model";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DataService} from "./data.service";
import {environment} from "../environments/environment";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usersUrl = environment.API_URL + '/api/users';

  users : User[] = [];
  userSubject : BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);


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
      .subscribe((res => {
        console.log(res);
        this.users.push(user);
        this.userSubject.next(this.users);
      }));
  }

}
