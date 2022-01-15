const express= require('express');
const cors= require('cors');
const axios = require('axios');


const app =express();

app.use(cors());
app.use(express.json({extended:true}));

const posts ={};

app.post('/events',(req,res)=>{

    const {type,data}= req.body;
    const {id} =data;
    switch(type){

        case 'CommentCreated':
            const {content}=data;
            console.log(content)
            setTimeout(async ()=>{
                await axios.post('http://localhost:5005/events',{
                    type:'CommentModerated',
                    data:{
                        ...data,
                        status:data?.content.includes('orange')?'rejected':'approved'
                    }
                });
            })
            

    }
    console.log(posts);
    res.json({msg:'OK'});
})

app.listen(5003, ()=>console.log("statrted at 5003"));