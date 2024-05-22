const express = require("express");
const app = express();

// app.get("/", (req, res) => {
//   res.send("hello");
// });

// app.get("/about", (req, res) => {
//     res.send("hello about");
//   });

//미들웨어
const checkAuth = (req, res, next) => {
  console.log("she has admin permission");
  next();
};
//미들웨어시 next 꼭 필요!!

const getUser = (req, res) => {
  res.send("here is user info");
};

app.get("/users", checkAuth, getUser);

app.listen(5000, () => {
  console.log("서버완성");
});
