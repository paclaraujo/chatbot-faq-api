import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import openapiSpec from "../openapi.json";
import routes from "./routes/index";
import { errorHandler } from "./middlewares/error-handler.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use(routes);

app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

app.use(errorHandler);

export default app;