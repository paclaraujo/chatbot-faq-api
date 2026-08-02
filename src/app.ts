import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import openapiSpec from "../openapi.json";
import routes from "./routes/index";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use(routes);

export default app;