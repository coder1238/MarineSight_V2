const fs = require("fs");

/**
 * Standalone Roboflow Oil Spill Segmentation (CommonJS)
 * Usage: node backend/scripts/segment_oil_spill.cjs [path_to_image.jpg]
 */
const imagePath = process.argv[2] || "frontend/public/logo.jpg";

if (!fs.existsSync(imagePath)) {
  console.error("Image file not found: " + imagePath);
  console.log("Usage: node backend/scripts/segment_oil_spill.cjs <path_to_image.jpg>");
  process.exit(1);
}

const image = fs.readFileSync(imagePath, {
  encoding: "base64"
});

console.log("Reading image: " + imagePath + " (" + (image.length / 1024).toFixed(1) + " KB base64)");
console.log("Sending to Roboflow oil-spill-segmentation/3...");

// API key goes in the Authorization header (inference v1.5.0+)
fetch("https://serverless.roboflow.com/oil-spill-segmentation/3", {
  method: "POST",
  headers: {
    "Authorization": "Bearer TyJb2VkX2RnPaxEniBl3",
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: image
})
  .then((response) => {
    if (!response.ok) throw new Error("Request failed with status " + response.status);
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error.message);
  });
