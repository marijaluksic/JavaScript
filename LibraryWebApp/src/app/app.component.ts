import { Component } from '@angular/core';
import {User} from "./models/user.model";
import {Router} from "@angular/router";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Library';
  constructor(private auth:AuthService, private router:Router){
  }

  ngOnInit(){

    /*this.auth.whoAmI()
      .subscribe((response:{status:number, user? : User})=>{
        if (response.status==200) {
          console.log(response);
        } else {
          this.router.navigate(['login'])
        }
      }, (err) => {
        console.log(err);
      });*/
  }
}
