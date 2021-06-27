const express = require('express');
const cors = require('cors')
const { default: axios } = require('axios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
const events = [];


app.get('/fetch/events',(req,res)=>{
    res.status(200).json(events);
});

app.post('/events',(req,res)=>{
    // console.log(req.body)
    const event = req.body;
    events.push(event);
    axios.post(`http://localhost:4000/posts/events`,event); //post Service
    axios.post(`http://localhost:4001/comments/events`,event); //Comment Service
    axios.post(`http://localhost:4002/query/events`,event); ///Query Service
    axios.post(`http://localhost:4003/comments/moderate/events`,event); ///Moderation Service

    res.send({});
})


app.listen(4005,()=>console.log(`Listening at port 4005`))