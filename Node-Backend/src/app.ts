import express from "express";
import bodyParser from "body-parser";
import userRouter from "./Routes/userRouter";
import authenticate from "./Middleware/authMiddleware";
import logRequest from "./Middleware/logRequest";
import errorHandler from "./Middleware/errorHandler";
import limiter from "./Middleware/requestLimiter";
import dotenv from "dotenv";
import seedCountry from "./country";
import Country from "./model/countryModel";
import { connectToMongoDB } from "./utils/connectToDb";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT: number = parseInt(process.env.PORT as string, 10) || 9000;

app.use(limiter);
app.use(logRequest);
// app.use(authenticate);
app.use("/api", userRouter);
app.use(errorHandler);

const seedDB = async () => {
  const countryCount = await Country.countDocuments();
  if (countryCount === 0) {
    await Country.insertMany(seedCountry);
    console.log("Data Inserted");
  } else {
    console.log("Data already present, no need to insert");
  }
};

connectToMongoDB()
  .then(async () => {
    await seedDB();
    console.log("Data Inserted");
  })
  .catch((err: Error) => {
    console.error("Data insertion failed", err);
  });

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
