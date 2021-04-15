const express = require('express')
const cors= require('cors');
require('dotenv').config();
const fileUpload = require('express-fileUpload');
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tcbnc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload())
const port =5000;
 
client.connect(err => {
 console.log("database connected");
  const appointmentCollection = client.db("doctorPortals").collection("appointments");

  app.post('/addAppointment',(req,res)=>{
    const appointment =req.body;
    // console.log(appointment);
    appointmentCollection.insertOne(appointment)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
    
  });

  app.get('/appointments', (req, res) => {
    appointmentCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
})

  app.post('/appointmentByDate',(req,res)=>{
    const date =req.body;
    console.log(date.date)
    appointmentCollection.find({date:date.date})
    .toArray((err,documents)=>{
      res.send(documents)
    })
    
    
  });

  app.post('/addDoctor',(req,res)=>{
        const file = req.files.file;

        const name = req.body.name;
        const email = req.body.email;
      // console.log(name,file,email);
      file.mv(`${__dirname}/doctors/${file.name}`,err=>{
        if(err){
          console.log(err);
          return res.status(500).send({msg:"failed to upload image"})
        }
        return res.send({name:file.name,path:`/${file.name}`})
      })
  })


  
  
  
  
});



app.listen(process.env.PORT || port)


