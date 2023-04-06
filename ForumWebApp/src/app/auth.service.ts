import {EventEmitter, Injectable} from '@angular/core';
import {User} from "./user.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../environments/environment";
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";
import {UsersService} from "./users.service";
import {map} from "rxjs/operators";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {
  private user : User| null=null;
  private token : string| null=null;
  errorEmitter : Subject<string> = new Subject<string>();
  authChange : Subject<boolean> = new Subject<boolean>();
  authUrl : string = environment.API_URL+'/authenticate';


  users : User[] = [];

  userSubject : BehaviorSubject<User[]> | null=null;
  subscription : Subscription | null = null;

  constructor(private http : HttpClient, private router : Router, private usersService: UsersService) { }

  login(username : string, password: string){


    this.http.post(this.authUrl, {
      username,
      password
    }, httpOptions).subscribe((user : any)=>{

      if (user) {
        this.user = user;
        this.token = user.accessToken;
        console.log(this.token);
        localStorage.setItem('token', JSON.stringify(this.token));
        localStorage.setItem('user', JSON.stringify(this.user));
        this.authChange.next(true);
        this.router.navigate(['/']);
      } else {
        this.errorEmitter.next('Wrong username and/or password, please try again!');
      }

    });



  }

  logout(){
    this.user= null;
    this.token= null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser(){
    if (this.user)
      return {...this.user}; else return null;
  }

 getToken(){

    /*if (this.token) {
      return this.token;
    }
    else {*/

      if (localStorage.getItem('token')){
        this.token=localStorage.getItem('token');
        return this.token;
      }
/*
    }*/
    return this.token;
  }


  isAuthenticated(){
    return this.user!=null;
  }
  /*whoAmI(){

    if (this.getToken()) {

      return this.http.get(environment.API_URL + '/api/me')
        .pipe(map((response => {
            console.log(response);
            this.authChange.next(true);
          }
        )))

    } else {
      return new Observable(observer => {
        observer.next({status:100})
      })
    }

  }*/

}
