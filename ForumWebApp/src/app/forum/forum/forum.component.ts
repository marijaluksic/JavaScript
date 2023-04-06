import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Post} from "../../post.model";
import {User} from "../../user.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {DataService} from "../../data.service";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PostsService} from "../../posts.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UsersService} from "../../users.service";
import {ObjectId} from "mongodb";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit, OnDestroy  {


  user : User | null = null;
  editValue = -1;
  addValue = false;
  korisnici : User[] = [];
  komentari : Post[] = [];
  postSubject : BehaviorSubject<Post[]> | null=null;
  subscription : Subscription | null = null;

  userSubject : BehaviorSubject<User[]> | null=null;
  subscription2 : Subscription | null = null;

  new : Post = new Post();


  constructor(private http: HttpClient, private dataService: DataService, private auth : AuthService, private route:ActivatedRoute, private router:Router, private postsService: PostsService,  private usersService : UsersService) { }

  ngOnInit() {
    this.user = this.auth.getUser();
    this.postSubject = this.postsService.getPosts();
    this.subscription = this.postSubject.
    subscribe(data => {
      console.log(data); // should be your users.
      this.komentari = data;
    }, error => {
      console.log(error); // if api returns and error you will get it here
    });
    this.userSubject = this.usersService.getUsers();
    this.subscription2 = this.userSubject.
    subscribe(data => {
      console.log(data); // should be your users.
      this.korisnici = data;
    }, error => {
      console.log(error); // if api returns and error you will get it here
    });
  }

  userIdToUsername(id:string) {
    if(this.korisnici.length<1)
    {
      this.userSubject = this.usersService.getUsers();this.subscription2 = this.userSubject.
    subscribe(data => {
      console.log(data); // should be your users.
      this.korisnici = data;
    }, error => {
      console.log(error); // if api returns and error you will get it here
    });
    }
    let korisnik = this.korisnici.filter(k => k._id == id).map(k => k.username);
    return korisnik;
  }

  onCancel(){
    this.addValue = !this.addValue;
    this.new.comment = '';
  }
  addPost(userId: string){
    console.log(this.new);
    this.new.userId = userId;
    this.new.timeStamp = new Date().toLocaleString();
    this.addValue = false;
    this.postsService.addPost(this.new);



    this.new = {_id: '', userId: '', timeStamp: '', comment: ''};
  }
  startEditing(post:Post){
    this.editValue=this.komentari.indexOf(post)
  }
  startAdding(){
    this.addValue = !this.addValue;
    this.editValue= -1;
  }
  onEdit(post: Post, editirani: HTMLTextAreaElement){
    this.editValue = -1;
    post.comment = editirani.value;
    this.postsService.editPost(post);
  }

  onDelete(i:string){
    this.editValue = -1;
    console.log(i);
    this.postsService.deletePost(i);
  }
  profile() {
    this.router.navigate(['profile']);
  }
  logout(){
    this.auth.logout();
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}
