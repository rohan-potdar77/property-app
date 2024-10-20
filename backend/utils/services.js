const path = require("path");
const fs = require("fs");

const deleteImageFromServer = (imagePath) => {
  const fullOldImagePath = path.join(__dirname, "..", imagePath);
  fs.unlink(fullOldImagePath, (err) => {
    if (err) {
      console.error(`Failed to delete old image: ${err.message}`);
    } else {
      console.log("Old image deleted successfully");
    }
  });
};

module.exports = { deleteImageFromServer };
