// installed imports
import express from "express";
import cors from "cors";
import mongodb from "mongodb";
import path from "path";

// custom module imports
// NA

// describe the port on which the server runs
var port = process.env.port || 3000;

// intialize express app object
var app = express();

// initialize collections ref
let projectCollection;

// get projects
const getProjects = (callback) => {
  projectCollection.find({}).toArray(callback);
};

// insert / create project
const insertProjects = (project, callback) => {
  projectCollection.insert(project, callback);
};

// configuring the app-level middleware
// serving of static files through public folder
app.use(express.static(path.dirname(".") + "/public"));

// add capability to parse json requests > put parsed info to req.body
app.use(express.json());

// add capability to parse x-www-form-urlencoded requests > put parsed info to req.body
app.use(express.urlencoded({ extended: false }));

// OPTIONAL? NEED TO REVISIT
app.use(cors());

// connection to mongodb NEED ENCRYPTION
const uri =
  "mongodb+srv://VediYD:QKooQUZneynE1TWM@cluster0.qi0uyj8.mongodb.net/?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true });

// creating collection object
const createCollection = (collectionName) => {
  client.connect((err, db) => {
    projectCollection = client.db().collection(collectionName);
    if (!err) {
      console.log("MongoDb Connected Successfully");
    } else {
      console.log("DB Error: ", err);
      process.exit(1);
    }
  });
};

// listen on designated port
app.listen(port, () => {
  console.log("App listening to: " + port);
  createCollection("Whales");
});

app.get("/api/projects", (req, res) => {
  getProjects((err, result) => {
    if (err) {
      res.json({
        statusCode: 400,
        message: err,
      });
    } else {
      res.json({
        statusCode: 200,
        message: "Success",
        data: result,
      });
    }
  });
});

app.post("/api/projects", (req, res) => {
  console.log("New project added", req.body);
  var newProject = req.body;
  insertProjects(newProject, (err, result) => {
    if (err) {
      res.json({
        statusCode: 400,
        message: err,
      });
    } else {
      res.json({
        statusCode: 200,
        message: "project added successfully",
        data: result,
      });
    }
  });
});
