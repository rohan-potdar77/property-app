const express = require("express");
const router = express.Router();
const handleFile = require("../middlewares/handleFiles");
const {
  getProperties,
  addProperties,
  updateProperties,
  deleteProperties,
  getPropertyById,
} = require("../controllers/propertyControllers");

router.get("/", getProperties);

router.get("/:id", getPropertyById);

router.post("/", handleFile.single("propertyImage"), addProperties);

router.put("/:id", handleFile.single("propertyImage"), updateProperties);

router.delete("/:id", deleteProperties);

module.exports = router;
