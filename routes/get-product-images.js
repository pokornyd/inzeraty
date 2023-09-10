import { Router } from "express";
import JSZip from "jszip";

var router = Router();

router.post("/", async (req, res) => {
  try {
    const urls = req.body.urls;
    const zip = new JSZip();

    const fetchBlobs = urls.map(async (url, index) => {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      zip.file(`image-${index}.jpg`, buffer);
    });

    await Promise.all(fetchBlobs);

    const zippedFile = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader('Content-Disposition', 'attachment; filename=images.zip');
    res.setHeader('Content-Type', 'application/zip');
    res.send(zippedFile);

  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred while fetching the data");
  }
});

export default router;
