// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const app = require("./app");

// dotenv.config({ path: "./config.env" });
// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

// mongoose
//   .connect(DB, {
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useNewUrlParser: true,
//   })
//   .then((con) => {
//     // console.log(con.connection);
//     console.log("DB Connection Successfully");
//   });
// // console.log(app.get("env"));
// // console.log(process.env);

// // const nftSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: [true, "A NFT must have a name"],
// //     unique: true,
// //   },
// //   rating: {
// //     type: Number,
// //     default: 4.5,
// //   },
// //   price: {
// //     type: Number,
// //     required: [true, "A NFT must have price"],
// //   },
// // });

// // const testNFT = new NFT({
// //   name: "The Rutik Monkey",
// //   rating: 3.2,
// //   price: 567,
// // });

// // testNFT
// //   .save()
// //   .then((docNFT) => {
// //     console.log(docNFT);
// //   })
// //   .catch((error) => {
// //     console.log("ERROR:", error);
// //   });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}....`);
// });

// PART 2-------------------
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const server = next({dev});
const handle = server.getRequestHandler();

//To handle error occured when someone tries to access API variable which is undefined.
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception Shutting down application");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("DB Connection Successfully");
  });

console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;

server.prepare().then(()=>{
  app.get("*",(req,res)=>{
    return handle(req,res);
  });

  app.listen(port, () => {
    console.log(`App running on port ${port}....`);
  });
});

//Code to handle unknown error like database server downn and shutting down application at such scenario.
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection Shutting down application");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
