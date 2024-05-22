const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use("/api", indexRouter);
const mongoURI = `mongodb://localhost:27017/todo-demo`;

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("몽구스연결");
  })
  .catch((err) => {
    console.log("db connection fail");
  });

app.listen(5000, () => {
  console.log("Server on 5000");
});
