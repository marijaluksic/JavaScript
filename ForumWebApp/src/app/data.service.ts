import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {User} from "./user.model";
import {Post} from "./post.model";
import {environment} from "../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class DataService{

  apiUsersRoot = environment.API_URL + '/api/users';
  apiPostsRoot = environment.API_URL + '/api/posts';

  constructor(private http:HttpClient) { }


  getUsers(){

    return this.http.get(this.apiUsersRoot)
      .pipe(map((res:any) => {
      const users=[];
      for (let key in res){
        users.push({...res[key]});
      }
      return users;
    }));


  }

  addUser(user: User){
    return this.http.post(this.apiUsersRoot,user);

  }

  getPosts(){

    return this.http.get(this.apiPostsRoot)
      .pipe(map((res:any) => {
      const posts=[];
      for (let key in res){
        posts.push({...res[key]});
      }
      return posts;
    }));


  }

  addPost(post: Post){
    return this.http.post(this.apiPostsRoot,post)

  }

  deletePost(id:string){
    return this.http.delete(this.apiPostsRoot+'/' +id);
  }

  editPost(post: Post){
    return this.http.put(this.apiPostsRoot,post)
  }


}
