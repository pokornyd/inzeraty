import { Router } from "express";
import { getProductValues } from "../services/dataLoader.js";
var router = Router();

router.post("/", async (req, res) => {
  try {
    const urls = req.body.urls;
    const results = [];

    for (const url of urls) {
      const offerObject = await getProductValues(url);

      results.push(offerObject);
    }

    res.json(results);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred while fetching the data");
  }
});

export default router;
