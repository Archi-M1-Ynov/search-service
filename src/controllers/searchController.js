import express from "express";
import axios from "axios";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

await redisClient.connect();

router.post("/", async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Requête vide" });
  }

  const cacheKey = `search:${query.toLowerCase()}`;

  try {
    // 1. Vérifier le cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("📦 Résultat depuis le cache Redis");
      return res.json(JSON.parse(cached));
    }

    // 2. Appeler product-service
    const response = await axios.post(process.env.PRODUCT_SERVICE_URL, {
      query,
    });

    const results = response.data;

    // 3. Stocker dans Redis
    await redisClient.set(cacheKey, JSON.stringify(results), {
      EX: 300, // expire en 5 minutes
    });

    console.log("🔍 Résultat depuis product-service (et mis en cache)");
    return res.json(results);
  } catch (err) {
    console.error("❌ Erreur dans /search :", err.message);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
