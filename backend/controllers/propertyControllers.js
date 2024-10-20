const Property = require("../models/Property");
const { deleteImageFromServer } = require("../utils/services");

const getProperties = async (req, res) => {
  try {
    const {
      location,
      type,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const parsedMinPrice = parseInt(minPrice, 10);
    const parsedMaxPrice = parseInt(maxPrice, 10);

    const pipeline = [];
    const matchStage = {};

    if (location) matchStage.propertyLocation = location;
    if (type) matchStage.propertyType = type;

    if (minPrice || maxPrice) {
      matchStage.propertyPrice = {};
      if (minPrice) matchStage.propertyPrice.$gte = parsedMinPrice;
      if (maxPrice) matchStage.propertyPrice.$lte = parsedMaxPrice;
    }

    if (search) {
      matchStage.$or = [
        { propertyName: { $regex: search, $options: "i" } },
        { propertyLocation: { $regex: search, $options: "i" } },
        { propertyType: { $regex: search, $options: "i" } },
      ];
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    const skip = (parsedPage - 1) * parsedLimit;
    pipeline.push({ $skip: skip }, { $limit: parsedLimit });

    const properties = await Property.aggregate(pipeline);
    const totalProperties = await Property.countDocuments(matchStage);
    const totalPages = Math.ceil(totalProperties / parsedLimit);

    if (properties.length === 0) {
      return res.status(204).json({ message: "No properties found" });
    }

    return res.status(200).json({ properties, totalPages });
  } catch (error) {
    console.error("Error fetching properties:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

const addProperties = async (req, res) => {
  try {
    const data = { ...req.body, propertyImage: req.file.path };
    const property = await Property.create(data);
    if (!property)
      return res.status(400).json({ message: "Property not created!" });
    return res.status(200).json(property);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const updateProperties = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file && req.file.path) {
      data.propertyImage = req.file.path;
      const oldData = await Property.findById(req.params.id);
      deleteImageFromServer(oldData.propertyImage);
    }
    const property = await Property.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!property)
      return res.status(400).json({ message: "Property not updated!" });
    return res.status(200).json(property);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const deleteProperties = async (req, res) => {
  try {
    deleteImageFromServer(req.body.image);
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property)
      return res.status(400).json({ message: "Property not deleted!" });
    return res.status(200).json(property);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  addProperties,
  updateProperties,
  deleteProperties,
};
