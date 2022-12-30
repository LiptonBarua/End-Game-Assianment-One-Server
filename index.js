const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app= express();
const port= process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

require('dotenv').config();




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ebocqiq.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
     const postCollection= client.db('EndGameAssianment1').collection('uploading');
     const commentCollection= client.db('EndGameAssianment1').collection('comment');
    
     
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
     
     app.get('/upload/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await postCollection.findOne(query);
      res.send(result)
  })
  
   //  app.post('/comment', async(req, res)=>{
   //  const upload= req.body;
   //      const result = await commentCollection.insertOne(upload);
   //      res.send(result)
   //  })

   //  app.get('/comment', async(req, res)=>{
   //    const query={};
   //    const result = await postCollection.find(query).toArray();
   //    res.send(result)
   // })
    app.patch("/upload/:id", async (req, res) => {
      const id = req.params.id;
      const comment = req.body.comment;

      const filter = { _id: ObjectId(id) };
      const allComment = await postCollection.find(filter).toArray();
      const myComment = (allComment[0].comment)
      console.log(myComment)
      myComment?.push(comment)
      const options = { upsert: true };
   const updateDoc = [{
      $set: { comment: myComment },
   }];
   const result = await postCollection.updateOne(
      filter,
      updateDoc,
      options
   );
   res.send(result);
  })
  
  app.patch('/likes/:id', async (req, res) => {
   const id = req.params.id;
   const like = req.body.like;
   const filter = { _id: ObjectId(id) };
   const options = { upsert: true };
   const update = { $set: { like: like } }
   const result = await postCollection.updateOne(filter, update, options);
  res.send(result);
})


// app.patch("/upload/:id", async(req, res)=>{
//    const id = req.params.id;
 
//   const comment= req.body.comment;
// 
//   const filter={ _id:ObjectId(id) }
//   const options = { upsert: true };
//   const updateDoc = {
//          $set: { 
//             comment: [comment]
//          },
//       }
//       const result = await postCollection.updateOne(filter,updateDoc,options);
//       res.send(result)
// })

    }
    finally{

    }
}
run().catch(console.dir);
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })