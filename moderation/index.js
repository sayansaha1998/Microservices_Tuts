const express = require('express');
const axios = require('axios')
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const handleEvent=async (type,data)=>{

    if(type === 'CommentCreated'){
        const status = data.content.includes('fuck')?'rejected':'approved';
        //sending a commentModerated event
        await axios.post(`http://localhost:4005/events`,{
            type:'CommentModerated',
            data:{
                postId:data.postId,
                commentId:data.commentId,
                content:data.content,
                status:status
            }
        })
    }
}


app.post('/comments/moderate/events', async (req,res)=>{
    const {type,data} = req.body;
    handleEvent(type,data);
    res.send({})

})



app.listen(4003,async ()=>{
    console.log(`Listening at port 4003`)

    const events = await axios.get(`http://localhost:4005/fetch/events`);
    for(let event of events.data){
        console.log(event.type)
        handleEvent(event.type,event.data);
    }
});
