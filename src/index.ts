import express, { Request, Response } from "express";
import { connectDatabase } from "./db/connect";
import { userRouter } from "./user/routes";
import cors from "cors";
const app = express();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);

const port = process.env.PORT || 3000;
connectDatabase()
  .then(() => {
    console.log("Database connected ");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    throw new Error("Error connecting database");
  });
