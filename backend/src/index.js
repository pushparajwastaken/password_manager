import "./config.js";
import { app } from "./app.js";
import ConnectDB from "./db/index.js";
import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
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
