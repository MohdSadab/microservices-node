const express= require('express');
const cors= require('cors');
const axios = require('axios');


const app =express();

app.use(cors());
app.use(express.json({extended:true}));

const posts ={};


const eventHandler=(type,data)=>{
    const {id,postId} =data;
    switch(type){

        case 'PostCreated':
            const {title}=data;
            posts[id]={id,title,comments:[]};
            break;

        case 'CommentCreated':
            const {content,status}=data;
            posts[postId]?.comments.push({id,content,status});
            break;
        
        case 'CommentUpdated':
            console.log(posts[postId]?.comments,"query comment")
            posts[postId].comments=posts[postId]?.comments?.map((com)=>{
                if(com.id===id){
                   return data;
                }
                return com;
            });
            break;

    }
}

app.get('/posts',(req,res)=>{

    res.json(posts);
})


app.post('/events',(req,res)=>{

    const {type,data}= req.body;
    console.log(type,data,">>>> type and data")
    try{
        eventHandler(type,data)
        
    }catch(err){
        console.log("events err query",err)
    }
    res.json({msg:'OK'});
})

app.listen(5002, async ()=>{

    // handle the missing events during the service down 
    // try{
    console.log("started at 5002 v3")
    // const {data} = await axios.get('http://event-bus-serv:5000/events');
    // for(let curr of data){
    //     console.log(curr.type)
    //     eventHandler(curr.type,curr.data)
    // }
    // }catch(error){
    //     console.log(error,"from query")
    // }

});