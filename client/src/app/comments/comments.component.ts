import { Component, Input, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  commentsByPostId=[];
  @Input() postId:string;
  @Input() postObject:any;
  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
    this.commentsByPostId = this.postObject[this.postId].comments;
    this.commentsByPostId.forEach((cmt)=>{
      if(cmt.status==='pending')
        cmt.comment = 'This comment is awaiting moderation.'
      else if(cmt.status==='rejected')
        cmt.comment = 'This comment has been rejected.'
    })
    console.log(this.commentsByPostId,this.postId);

  }

  createComment(comment){
    this.http.post(`http://localhost:4001/posts/${this.postId}/comments`,{
      'content':comment
    }).subscribe(res=>{})
  }

}
