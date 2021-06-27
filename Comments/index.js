const express = require('express')
const {randomBytes} = require('crypto');
const cors = require('cors');
const { default: axios } = require('axios');
const app = express();
app.listen(4001,()=>console.log(`Listening at port 4001`))

app.use(cors())
app.use(express.json())

const commentsByPostId = []
app.get('/posts/:id/comments',(req,res)=>{
    let postId = req.params.id;
    console.log(commentsByPostId[postId]||[])
    res.json(commentsByPostId[postId]||[]);
})

app.post('/posts/:id/comments',async (req,res)=>{
    const {content} = req.body;
    let postId = req.params.id;
    const commentId = randomBytes(4).toString('hex');
    const comments = commentsByPostId[postId] || []
    comments.push({commentId,content})
    commentsByPostId[postId] = comments;
    
    await axios.post('http://localhost:4005/events',{
        type : 'CommentCreated',
        data: {
            postId,
            commentId,
            content,
            status:'pending'
        }
    });

    res.status(200).json(commentsByPostId[postId]);
})

app.post('/comments/events',async (req,res)=>{
    console.log(req.body.type);
    const {type,data} = req.body;
    if(type === 'CommentModerated') {
      
        // commentsByPostId[data.postId]={
        //     commentId:data.commentId,
        //     comment:data.content,
        //     status:data.status
        // })
        await axios.post('http://localhost:4005/events',{
            type:'CommentUpdated',
            data:{
                postId:data.postId,
                commentId:data.commentId,
                content:data.content,
                status:data.status
            }
        })
      }
    res.send({})
})