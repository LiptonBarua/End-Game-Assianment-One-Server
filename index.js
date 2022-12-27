const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app= express();
const port= process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

require('dotenv').config();


app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ebocqiq.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
     const postCollection= client.db('EndGameAssianment1').collection('uploading');
     
     app.post('/upload', async(req, res)=>{
        const upload= req.body;
        const result = await postCollection.insertOne(upload);
        res.send(result)
     })

     app.get('/upload', async(req, res)=>{
        const query={};
        const result = await postCollection.find(query).toArray();
        res.send(result)
     })
    }
    finally{

    }
}
run().catch(console.dir);
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })