import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage : string | null = null;
  signinForm! : FormGroup;

  constructor(private auth : AuthService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit() {

    this.signinForm = new FormGroup({
      'username' : new FormControl(null, [Validators.required]),
      'password' : new FormControl(null, [Validators.required])
    });

    this.auth.errorEmitter
        .subscribe((error : string) => {
          this.errorMessage = error;
        });

  }
  register() {
    this.router.navigate(['register']);
  }

  onLogin() {

    this.auth.login(this.signinForm.value.username, this.signinForm.value.password);
  }

}
