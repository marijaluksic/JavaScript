import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";
import {Post} from "./post.model";
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class PostsService{


  posts : Post[] = [];
  postSubject : BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);


  constructor(private http:HttpClient, private dataService:DataService) {
    this.init()
  }

  init(){

    this.dataService.getPosts()
      .subscribe(res => {
        this.posts=res;
        this.postSubject.next([...this.posts]);
      })

  }

  getPosts(){

    return this.postSubject;

  }

  addPost(post: Post){
    this.dataService.addPost(post)
      .subscribe((res => {
        console.log(res);
        post._id= res.toString();
        this.posts.push(post);
        this.postSubject.next(this.posts);
      }));
  }

  deletePost(id:string){
    this.dataService.deletePost(id)
      .subscribe((res => {
        console.log(res);
        this.posts=this.posts.filter(c => c._id!=id);
        this.postSubject.next(this.posts);
      }));
  }

  editPost(post:Post){
    this.dataService.editPost(post)
      .subscribe((res => {
        console.log(res);
        this.posts[this.posts.findIndex(c => c._id==post._id)]=post;
        this.postSubject.next(this.posts);
      }),error => {
        console.log(error);
      });
  }

}
