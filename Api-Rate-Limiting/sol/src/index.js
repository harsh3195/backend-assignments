const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 3000
const data = require("./initialData.js");
let timeOfLast5APICalls = [new Date(),new Date(),new Date(),new Date(),new Date()];
let maxOfLast5APICalls = [10,10,10,10,10];
let thisApiCallIndex=0;
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
// your code goes here
const isNullOrUndefined = val => val===undefined||val===null;

app.get("/api/posts",(req,res)=>{
    //better solution would be through googling for libraries!
    let max=10;
    thisApiCallIndex = (lastApiCallIndex+1) % 5;
    const now = new Date();
    try{
        max = Number(req.query.max);
        if(max>20){
            max=10;
        }
    }catch{
       max=10; 
    }
    for(let i=0;i<5;i++){
        if((now - timeOfLast5APICalls[i])<30*1000){
            max = Math.min(max, maxOfLast5APICalls[i])
            timeOfLast5APICalls[i]=max;
        }
    }
    timeOfLast5APICalls[lastApiCallIndex]=now; 
    if(now - (Math.min.apply(null,timeOfLast5APICalls))<30*1000){
        res.status(429).send({message:
            "Exceed Number of API Calls"});
    }else{
        res.send(data.slice(0,max));
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
