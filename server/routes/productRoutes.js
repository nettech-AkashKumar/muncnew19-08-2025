const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProductsByName,
  importProducts,
  getProductStock,
  
  getUpcomingExpiryProducts,
  getPurchaseReturnStock,

  deleteProductImage,

  // getTotalStockValue 
} = require("../controllers/productController");


const upload = require("../middleware/Multer/multer"); // ✅ fix double slash
const path = require("path");

router.get("/stock", getProductStock);
router.post("/create", upload.array("images", 10), createProduct);
router.post("/import", upload.single("file"), importProducts);
router.get("/search", searchProductsByName);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.array("images", 10), updateProduct);
router.delete("/:id", deleteProductImage)
router.delete("/pro/:id", deleteProduct);
// router.get("/total-stock-value", getTotalStockValue);
module.exports = router;
