const express = require('express');
const cors = require('cors')
const axios = require('axios')
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));


posts = {};

const handleEvent=(type,data)=>{
    let postId = data.postId;
    if(type === 'PostCreated'){
        
        posts[postId]={
            postId: data.postId,
            title: data.title,
            content:data.content,
            comments: []
        }
    }
    else if(type === 'CommentCreated') {
      
      posts[postId].comments.push({
          commentId:data.commentId,
          comment:data.content,
          status:data.status
      })
    }
    if(type === 'CommentUpdated') {
      
        const cmt_updated=posts[postId].comments.find(cmt=>{
            return cmt.commentId === data.commentId;
        });
        cmt_updated.status = data.status;
        console.log(cmt_updated);
      }
}

app.get('/posts',(req,res)=>{
    // console.log('PostList:',posts)
    res.status(200).json({posts});
});

app.post('/query/events',(req,res)=>{
    const {type,data} = req.body;
    
    handleEvent(type,data);
    res.send({})
});

app.listen(4002,async ()=>{
    console.log(`Listening at port 4002`)

    const events = await axios.get(`http://localhost:4005/fetch/events`);
    for(let event of events.data){
        handleEvent(event.type,event.data);
    }

})