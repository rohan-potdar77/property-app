const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const propertyRoutes = require("./routes/propertyRoutes");

const app = express();
const port = 4000;

mongoose
  .connect("mongodb://localhost:27017/PropertyDB")
  .then(() => console.info("database connected!"))
  .catch(() => console.error("database not connected!"));

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/private/properties", propertyRoutes);

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size limit exceeds!" });
    }
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: "An unexpected error occurred!" });
});

app.listen(port, () => console.info(`Server is running on port '${port}'`));
