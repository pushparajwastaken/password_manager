import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const ConnectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      `MONGODB IS CONNECTED!! DB HOST:${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("Error while connecting to Database", error);
    process.exit(1);
  }
};
export default ConnectDB;
