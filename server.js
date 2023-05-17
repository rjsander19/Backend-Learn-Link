//Dependencies
require("dotenv").config();

const { PORT = 4000, MONGODB_URL } = process.env;

const express = require("express");

const app = express();

const mongoose = require("mongoose");

const cors = require("cors");

const morgan = require("morgan");

//Mongoose
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

//Models
const SubjectsSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
    });
      
const Subjects = mongoose.model("Subjects", SubjectsSchema);

//Middleware
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies
app.use(express.urlencoded({extended: true}))


//Routes

app.get("/", (req, res) => {
    res.send("hello world backend page subjects");
  });
  
  //Index
  app.get("/subjects", async (req, res) => {
    try {
      res.json(await Subjects.find({}));
    } catch (error) {
      res.status(400).json(error);
    }
  });
  
  // Create
  app.post("/subjects", async (req, res) => {
    try {
      res.json(await Subjects.create(req.body));
    } catch (error) {
      res.status(400).json(error);
    }
  });
  
  // Delete
  app.delete("/subjects/:id", async (req, res) => {
    try {
      res.json(await Subjects.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });
  
  //Update
  app.put("/subjects/:id", async (req, res) => {
    try {
      res.json(
        await Subjects.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      res.status(400).json(error);
    }
  });

//Listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));