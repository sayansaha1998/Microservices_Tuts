import { Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Posts} from '../interface/posts.interface';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  postList:any=[];
  postObject={};
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getAllPost()
  }

  createPost(title:string,content:string){
    this.http.post(`http://localhost:4000/posts`,{
      'title':title,
      'content':content
    }).subscribe(res=>console.log(res));
  }

  getAllPost(){
    this.http.get(`http://localhost:4002/posts`)
    .subscribe((res:any)=>{
      this.postObject = res.posts;
      this.postList = Object.values(res.posts);
      console.log(res)
    });

  }

}
