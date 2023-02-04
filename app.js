// const fs = require("fs");
// const express = require("express");

// const app = express();
// app.use(express.json());

// const nfts = JSON.parse(
//   fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)
// );

// // app.get("/", (req, res) => {
// //   res.status(200).send("Hellow i am nft marketplace api");
// // });

// // app.get("/", (req, res) => {
// //   res.status(200).json({
// //     message: "Hellow i am nft marketplace api",
// //     api: "NFT Marketplace",
// //   });
// // });

// // app.post("/", (req, res) => {
// //   res.status(201).json({
// //     message: "Your data",
// //   });
// // });

// //GET REQUEST

// // console.log(nfts);

// app.get("/api/v1/nfts", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     results: nfts.length,
//     data: {
//       nfts,
//     },
//   });
// });

// //POST METHOD

// app.post("/api/v1/nfts", (req, res) => {
//   //   console.log(req);
//   //   console.log(req.body);

//   const newId = nfts[nfts.length - 1].id + 1;
//   const newNFTs = Object.assign({ id: newId }, req.body);

//   nfts.push(newNFTs);

//   fs.writeFile(
//     `${__dirname}/nft-data/data/nft-simple.json`,
//     JSON.stringify(nfts),
//     (err) => {
//       res.status(201).json({
//         status: "success",
//         nft: newNFTs,
//       });
//     }
//   );
//   //   res.send("POST NFT");
// });

// // GET SINGLE NFT

// app.get("/api/v1/nfts/:id", (req, res) => {
//   //   console.log(req.params);

//   const id = req.params.id * 1;
//   const nft = nfts.find((el) => el.id === id);

//   //   if (id > nfts.length) {
//   if (!nft) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft,
//     },
//   });
// });

// //PATCH METHOD

// app.patch("/api/v1/nfts/:id", (req, res) => {
//   if (req.params.id * 1 > nfts.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft: "Updating nft",
//     },
//   });
// });

// //DELET METHOD

// app.delete("/api/v1/nfts/:id", (req, res) => {
//   if (req.params.id * 1 > nfts.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}....`);
// });

// /////PART 2 -----------------------

// const fs = require("fs");
// const express = require("express");
// const morgan = require("morgan"); //Morgan is used to identify what request user is making on api & if you want to attach some events based on the api request we can use this package and trigger the event.

// const app = express();
// app.use(express.json());
// app.use(morgan("dev"));

// //CUSTOM MIDDLE WARE
// app.use((req, res, next) => {
//   console.log("Hey i am from middleware function 👋");
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// const nfts = JSON.parse(
//   fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)
// );

// const getAllNfts = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: "success",
//     requestTime: req.requestTime,
//     results: nfts.length,
//     data: {
//       nfts,
//     },
//   });
// };
// //POST METHOD
// const createNFT = (req, res) => {
//   const newId = nfts[nfts.length - 1].id + 1;
//   const newNFTs = Object.assign({ id: newId }, req.body);

//   nfts.push(newNFTs);

//   fs.writeFile(
//     `${__dirname}/nft-data/data/nft-simple.json`,
//     JSON.stringify(nfts),
//     (err) => {
//       res.status(201).json({
//         status: "success",
//         nft: newNFTs,
//       });
//     }
//   );
// };
// // GET SINGLE NFT
// const getSingleNFT = (req, res) => {
//   const id = req.params.id * 1;
//   const nft = nfts.find((el) => el.id === id);

//   if (!nft) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft,
//     },
//   });
// };
// //PATCH METHOD
// const updateNFT = (req, res) => {
//   if (req.params.id * 1 > nfts.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft: "Updating nft",
//     },
//   });
// };
// //DELETE METHOD
// const deleteNFT = (req, res) => {
//   if (req.params.id * 1 > nfts.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// };

// // app.get("/api/v1/nfts", getAllNfts);
// // app.post("/api/v1/nfts", createNFT);
// // app.get("/api/v1/nfts/:id", getSingleNFT);
// // app.patch("/api/v1/nfts/:id", updateNFT);
// // app.delete("/api/v1/nfts/:id", deleteNFT);

// app.route("/api/v1/nfts").get(getAllNfts).post(createNFT);

// app
//   .route("/api/v1/nfts/:id")
//   .get(getSingleNFT)
//   .patch(updateNFT)
//   .delete(deleteNFT);

// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}....`);
// });

// /////PART 3 -----------------------

// const fs = require("fs");
// const express = require("express");
// const morgan = require("morgan");

// const app = express();
// app.use(express.json());
// app.use(morgan("dev"));

// //CUSTOM MIDDLE WARE
// app.use((req, res, next) => {
//   console.log("Hey i am from middleware function 👋");
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// const nfts = JSON.parse(
//   fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)
// );

// const getAllNfts = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: "success",
//     requestTime: req.requestTime,
//     results: nfts.length,
//     data: {
//       nfts,
//     },
//   });
// };
// //POST METHOD
// const createNFT = (req, res) => {
//   const newId = nfts[nfts.length - 1].id + 1;
//   const newNFTs = Object.assign({ id: newId }, req.body);

//   nfts.push(newNFTs);

//   fs.writeFile(
//     `${__dirname}/nft-data/data/nft-simple.json`,
//     JSON.stringify(nfts),
//     (err) => {
//       res.status(201).json({
//         status: "success",
//         nft: newNFTs,
//       });
//     }
//   );
// };
// // GET SINGLE NFT
// const getSingleNFT = (req, res) => {
//   const id = req.params.id * 1;
//   const nft = nfts.find((el) => el.id === id);

//   if (!nft) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft,
//     },
//   });
// };
// //PATCH METHOD
// const updateNFT = (req, res) => {
//   if (req.params.id * 1 > nfts.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft: "Updating nft",
//     },
//   });
// };
// //DELETE METHOD
// const deleteNFT = (req, res) => {
//   if (req.params.id * 1 > nfts.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// };

// ///------USERS
// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const createUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const getSingleUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const nftsRouter = express.Router();
// const usersRouter = express.Router();

// //ROUTER NFTs
// nftsRouter.route("/").get(getAllNfts).post(createNFT);

// nftsRouter.route("/:id").get(getSingleNFT).patch(updateNFT).delete(deleteNFT);

// //ROUTERS USERS
// usersRouter.route("/").get(getAllUsers).post(createUser);

// usersRouter
//   .route("/:id")
//   .get(getSingleUser)
//   .patch(updateUser)
//   .delete(deleteUser);

// app.use("/api/v1/nfts", nftsRouter);
// app.use("/api/v1/users", usersRouter);

// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}....`);
// });

/////PART 4 -----------------------

// const express = require("express");
// const morgan = require("morgan");

// const nftsRouter = require("./routes/nftsRoute");
// const usersRouter = require("./routes/usersRoute");

// const app = express();
// app.use(express.json());

// // if (process.env.NODE_ENV === "development ") {
// //   app.use(morgan("dev"));
// // }
// app.use(morgan("dev"));

// //SERVING TEMPLATE DEMO
// app.use(express.static(`${__dirname}/nft-data/img`));

// //CUSTOM MIDDLE WARE
// app.use((req, res, next) => {
//   console.log("Hey i am from middleware function 👋");
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// app.use("/api/v1/nfts", nftsRouter);
// app.use("/api/v1/users", usersRouter);

// module.exports = app;

// PART 5 ----------------------- ERROR

const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./API/Utils/appError");
const globalErrorHandler = require("./API/controllers/errorController");
const nftsRouter = require("./API/routes/nftsRoute");
const usersRouter = require("./API/routes/usersRoute");

const app = express();
app.use(express.json({limit: "10kb"})); //Setting data limit to expect in our API. Since we are sending json file 10kb are enough

//DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

//DATA SANITIZATION AGAINST SITE SCRIPT XSS
app.use(xss());

//PREVENT PARAM POLLUTION ie specifying params on which sorting should take place
app.use(hpp({
  whitelist: ["duration", "difficulty", "maxGroupSize", "price", "ratingsAverage", "ratingsQuantity"],
}));

//SECURE HEADER HTTP
app.use(helmet());
//GLOBAL MIDDLEWARES
// if (process.env.NODE_ENV === "development ") {
//   app.use(morgan("dev"));
// }

// RATE LIMIT: With the foll, user can only send 100 API requests in an hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Request Limit exceeded for this IP, Try Again in one hour",
});

app.use("/api",limiter);

app.use(morgan("dev"));

//SERVING TEMPLATE DEMO
app.use(express.static(`${__dirname}/nft-data/img`));

//CUSTOM MIDDLE WARE
app.use((req, res, next) => {
  console.log("Hey i am from middleware function 👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  next();
});

app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);

// ERROR SECTION

app.all('*', (req, res,next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server`,404));
});

// GLOBAL ERROR HANDLING
app.use(globalErrorHandler);

module.exports = app;