import mongoose from "mongoose";

export async function connect() {
  try {
    if (process.env.MONGO_URL === undefined) {
      throw "MONGO_URL is not defined";
    }
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });
    connection.on("error", (err) => {
      throw new Error(
        "Connection error to MongoDb (connection url is intact), please check is if db is up and running " +
          err
      );
      process.exit();
    });
    mongoose.connect(process.env.MONGO_URL);
  } catch (error: any) {
    if (!(error instanceof Error)) {
      error = new Error(error);
    }
    console.error("Something went wrong with DB !", error);
  }
}
