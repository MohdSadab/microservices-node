const express= require('express');
const {v4:uuid} = require('uuid')
const cors= require('cors');;
const axios=require('axios');

const app =express();

app.use(cors());
app.use(express.json({extended:true}));

const posts ={};

app.get('/posts',(req,res)=>{
    res.json(posts);
})
app.post('/post/create',async (req,res)=>{
    const id= uuid();
    req.body['id']=id;
    posts[id]=req.body;
    try{
        await axios.post('http://event-bus-serv:5005/events',{
            type:'PostCreated',
            data:{
                ...req.body
            }
        });
    }catch(error){
        console.log("errooror",error)
    }
    res.json(posts);
})


app.post('/events',(req,res)=>{

    const event= req.body;
    console.log("recieved event",event.type);
    res.json({msg:'OK'});
})


app.listen(5000, ()=>console.log("statrted at 5000 v66"));