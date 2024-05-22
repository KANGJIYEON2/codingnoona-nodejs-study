const { MongoClient } = require("mongodb");
const uri = `mongodb://localhost:27017`;
const client = new MongoClient(uri);

async function run() {
  //db연결
  const database = client.db("firstDB");
  const users = database.collection("users");

  //   const userList = [
  //     //여러개 넣을때
  //     { name: "철수", age: 30 },
  //     { name: "김아무개", age: 20 },
  //   ];
  //   //1개는 inserOnme
  //   const userListResult = await users.insertMany(userList);
  //   console.log("Result", userListResult);

  //const findUser = await users.findOne({ name: "철수" });
  // 다 불러올떄
  //  const findUser = await users.findOne({}).toArray();
  //const findUser = await users.find(age : {$gt:20}).toArray(); 20세이상만
  //findOne도 가능 하지만 맨처음 조건 만족할때만 보여짐

  //나이 업데이트
  //   const updataUser = await users.updateOne(
  //     { name: "철수" },
  //     { $set: { age: 20 } }
  //   );
  //   console.log(updataUser);

  //여러개 삭제
  //   const deleteUsers = await users.deleteMany({ age: { $gt: 20 } });
  //   console.log(deleteUsers);

  //아이디 뺴고 볼수있음
  const userData = await users
    .find({ name: "철수" })
    .project({ _id: 0 })
    .toArray();
  console.log(userData);
}
run();
