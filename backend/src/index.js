import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import ConnectDB from "./db/index.js";
ConnectDB()
  .then(() => {
    try {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Server is listening at Port ${port}`);
      });
    } catch (error) {
      console.log(`App didn't listen error:${error}`);
    }
  })
  .catch((error) => {
    console.log("Mongodb Connection failed", error);
  });
