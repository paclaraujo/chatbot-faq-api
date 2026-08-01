import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { join } from "path";
import routes from "./routes/index";

const app = express();
const openapiSpec = JSON.parse(
  readFileSync(join(process.cwd(), "openapi.json"), "utf-8")
);

app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use(routes);

export default app;