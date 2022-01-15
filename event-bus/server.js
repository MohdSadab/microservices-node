const express= require('express');
const cors= require('cors');
const axios = require('axios');


const app =express();

app.use(cors());
app.use(express.json({extended:true}));

const events =[];

app.post('/events',async (req,res)=>{

    const event= req.body;
    events.push(event);
    try{
        await axios.post('http://localhost:5000/events',event);
        await axios.post('http://localhost:5001/events',event);
        await axios.post('http://localhost:5002/events',event);
        await axios.post('http://localhost:5003/events',event);
    }catch(err){
        console.log("err >>>")
    }
    console.log("??????????????????????")
    res.json({msg:'OK'});
})


app.get('/events',(req,res)=>{
    res.json(events);
})

app.listen(5005, ()=>console.log("statrted at 5005"));