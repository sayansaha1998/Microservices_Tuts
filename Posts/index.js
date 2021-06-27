const express = require('express');
const app = express();
const {randomBytes} = require('crypto');
const cors = require('cors')
const { default: axios } = require('axios');
let posts= []

const corsOptions = {
    "origin":'*',
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    " Access-Control-Allow-Credentials":true

}
app.use(cors(corsOptions))

app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

app.get('/posts',(req,res)=>{
    console.log(posts)
    res.json({posts});
})

app.post('/posts',async (req,res)=>{
    const id = randomBytes(4).toString('hex');
    const {title} = req.body
    const {content} = req.body
    posts.push({
        id,title,content
    });
    
    await axios.post('http://localhost:4005/events',{
        type : 'PostCreated',
        data: {
            postId:id,
            title,
            content
        }
    });
    
    res.status(200).json(posts);
})

app.post('/posts/events',(req,res)=>{
    console.log(req.body.type)
    res.send({})
})


app.listen(4000,()=>{
    'Listening to server at port 5000'
})
