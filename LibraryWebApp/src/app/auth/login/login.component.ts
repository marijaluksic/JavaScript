import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
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
      'email' : new FormControl(null, [Validators.required, Validators.email]),
      'password' : new FormControl(null, [Validators.required])
    });

    this.auth.errorEmitter
        .subscribe((error : string) => {
          this.errorMessage = error;
          setTimeout(() => {
            this.errorMessage = "";
          }, 2000)
        });

  }
  register() {
    this.router.navigate(['register']);
  }

  onLogin() {

    this.auth.login(this.signinForm.value.email, this.signinForm.value.password);
  }

}
