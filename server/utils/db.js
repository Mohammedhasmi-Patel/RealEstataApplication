import mongoose from "mongoose";

const DbCon = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_LOCAL);
    console.log("database connect successfullly");
  } catch (error) {
    console.log("error in mongodb connection");
  }
};

export { DbCon };
