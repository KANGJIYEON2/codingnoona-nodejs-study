const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/mongoose-test");
const validator = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: "홍길동",
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        if (!validator.isEmail(value)) throw new Error("이메일 아님");
      },
    },
  },
  password: {
    type: String,
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

const newUser = new User({
  name: "지연",
  email: "123@naver.com",
  password: "12345",
});

newUser.save().then((value) => console.log(value));

User.find()
  .then({ name: "지연" })
  .select("name - _id")
  .then((value) => console.log(value));
