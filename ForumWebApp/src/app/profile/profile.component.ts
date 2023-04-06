import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../user.model";
import {Post} from "../post.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../data.service";
import {AuthService} from "../auth.service";
import {PostsService} from "../posts.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user : User | null = null;

  komentari : Post[] = [];
  postSubject : BehaviorSubject<Post[]> | null=null;
  subscription : Subscription | null = null;

  constructor(private http: HttpClient, private dataService: DataService, private auth : AuthService, private route:ActivatedRoute, private router:Router, private postsService: PostsService, private fb : FormBuilder) { }

  ngOnInit(){

    this.user = this.auth.getUser();
    this.postSubject = this.postsService.getPosts();
    this.subscription = this.postSubject.
    subscribe(data => {
      console.log(data); // should be your users.
      this.komentari = data.filter(post => post.userId == this.user?._id);
    }, error => {
      console.log(error); // if api returns and error you will get it here
    });
  }
  back(){
    this.router.navigate(['/']);
  }
}
