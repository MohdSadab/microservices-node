const express= require('express');
const {v4:uuid} = require('uuid')
const cors=require('cors');
const axios= require('axios');

const app =express();
app.use(cors());
app.use(express.json({extended:true}));

const commentsByPosId ={};

app.get('/post/:id/comments',(req,res)=>{
    const post_id=req.params.id
    const comments=commentsByPosId[post_id] || [];
    res.json(comments);
})
app.post('/post/:id/comment',async (req,res)=>{
    const c_id= uuid();
    req.body['id']=c_id;
    const post_id=req.params.id
    const comments=commentsByPosId[post_id] || [];
    comments.push({id:c_id,content:req.body.content,status:"pending"});
    commentsByPosId[post_id] =comments;

    await axios.post('http://localhost:5005/events',{
        type:'CommentCreated',
        data:{
            id:c_id,
            content:req.body.content ,
            postId:post_id,
            status:"pending"
        }
    });

    res.json(comments);
})

app.post('/events',async (req,res)=>{

    const {type,data}= req.body;
    const {id,postId} =data;
    switch(type){

        case 'CommentModerated':
            commentsByPosId[postId]?.comments?.forEach((com)=>{
                if(com.id===id){
                    com=data
                }
            });
            await axios.post('http://localhost:5005/events',{
                type:'CommentUpdated',
                data
            });
            break;

    }

    res.json({msg:'OK'});
})


app.listen(5001, ()=>console.log("statrted at 5001"));