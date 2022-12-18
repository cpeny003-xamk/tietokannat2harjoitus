import express from 'express'
import flatpickr from 'flatpickr'
import { MongoClient, ObjectId } from 'mongodb'
import cors from 'cors'


const app = express()

const port = Number(process.env.PORT) || 3001

app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.set("view engine", "ejs")
app.use(cors({
  "origin" : "http://localhost:3000",
  "optionsSuccessStatus" : 200
}))

// TODO: add your MongoDB Atlas Cluster connection string here:
const uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.pyxw3ds.mongodb.net/?retryWrites=true&w=majority"

// Create the MongoClient instance
const client = new MongoClient(uri)

// Establishes a connection to the database using the MongoClient instance
// const main = async () => {
//   try {
//     await client.connect()
//     console.log("Connected to MongoDB Atlas!")
//     // list out all the databases in the cluster
//     const dbs = await client.db().admin().listDatabases()
//     console.table(dbs.databases)
//     console.log(await client.db("sample_training").collection("companies").findOne())
//   } catch (error) {
//     console.error(error)
//   } finally {
//     await client.close()
//   }
// }

app.post("/", async (req, res) => {

  let result;

  try {
    await client.connect()
    console.log("Connected to MongoDB Atlas!")
    result = await client.db("aktiviteettiloki").collection("urheilu").insertOne({
      nimi : req.body.nimi,
      alku : req.body.alku,
      loppu : req.body.loppu,
      kcal : req.body.kcal
    })
  } finally {
    await client.close()
  }

  res.json({data : result})
})

app.post("/many", async (req, res) => {

  let result;

  try {
    await client.connect()
    console.log("Connected to MongoDB Atlas!")
    result = await client.db("aktiviteettiloki").collection("urheilu").insertMany(req.body.data)
  } finally {
    await client.close()
  }

  res.json({data : result})
})

app.delete("/", async (req, res) => {

  let result;

  try {
    await client.connect()
    console.log("Connected to MongoDB Atlas!")
    result = await client.db("aktiviteettiloki").collection("urheilu").deleteOne(
       {_id: ObjectId(req.body._id)}
    )
  } finally {
    await client.close()
  }

  res.json({data : result})

})

app.put("/", async (req, res) => {

  let result;

  try {
    await client.connect()
    console.log("Connected to MongoDB Atlas!")
    result = await client.db("aktiviteettiloki").collection("urheilu").updateOne(
      {
        _id : ObjectId(req.body._id)
      },
      {$set:
        {
        nimi : req.body.nimi,
        alku : req.body.alku,
        loppu : req.body.loppu,
        kcal : req.body.kcal
        }
      },
      {
        upsert : false
      }
    )
  } finally {
    await client.close()
  }

  res.json({data : result})
})

app.get("/", async (req, res) => {

  let result;

  try {
    await client.connect()
    console.log("Connected to MongoDB Atlas!")
    result = await client.db("aktiviteettiloki").collection("urheilu").find().toArray()
  } finally {
    await client.close()
  }

  res.json({data : result})
})

// Run the `main` function, catch any errors and finally close the connection when the main function is done
// main()
//   .catch((err) => console.log(err))
//   .finally(() => client.close())

  app.listen(port, () => {
    console.log(`Palvelin yhdistetty http://localhost:${port}`)
  })