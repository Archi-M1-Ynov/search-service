import express from "express";
import dotenv from "dotenv";
import searchRoutes from "./controllers/searchController.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/search", searchRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`🚀 Search-service running at http://localhost:${PORT}`);
});
