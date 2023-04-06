import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import Validation from "./validate";
import {AuthService} from "../auth.service";
import {DataService} from "../data.service";
import {User} from "../user.model";
import {filter, map} from "rxjs/operators";
import {BehaviorSubject, Subscription} from "rxjs";
import {Post} from "../post.model";
import {UsersService} from "../users.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorMessage : string = '';
  registerForm! : FormGroup;
  submitted = false;
  new: User = new User();


  users : User[] = [];

  userSubject : BehaviorSubject<User[]> | null=null;
  subscription : Subscription | null = null;

  constructor(private route:ActivatedRoute, private router:Router, private usersService : UsersService) { }

  ngOnInit(){
    this.registerForm = new FormGroup({
        'username' : new FormControl('', [Validators.required, Validators.minLength(4)]),
        'password' : new FormControl('', [Validators.required]),
        'password2' : new FormControl('', [Validators.required]),
        'name' : new FormControl('', [Validators.required]),
        'email' : new FormControl('', [Validators.required, Validators.email])
      }, {validators: [Validation.match('password', 'password2')]}
    );

    this.userSubject = this.usersService.getUsers();
    this.subscription = this.userSubject.
    subscribe(data => {
      console.log(data);
      this.users = data;
    }, error => {
      console.log(error);
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }
  onRegister(){
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    this.new = this.registerForm.value;

    this.usersService.addUser(this.new);

    this.new = {_id: '', username : '', password: '', name : '', email: ''};
  }

  back(){
    this.router.navigate(['login']);
  }

}
