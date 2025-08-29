

const Product = require("../models/productModels");
const cloudinary = require("../utils/cloudinary/cloudinary");


exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      sku,
      brand,
      category,
      subCategory,
      supplier,
      itemBarcode,
      store,
      warehouse,
      purchasePrice,
      sellingPrice,
      wholesalePrice,
      retailPrice,
      quantity,
      unit,
      taxType,
      tax,
      discountType,
      discountValue,
      quantityAlert,
      description,
      seoTitle,
      seoDescription,
      itemType,
      isAdvanced,
      trackType,
      isReturnable,
      leadTime,
      reorderLevel,
      initialStock,
      serialNumber,
      batchNumber,
      returnable,
      expirationDate,
      hsn,
    } = req.body;

    // Parse variants if provided
    const variants = req.body.variants ? JSON.parse(req.body.variants) : {};

    let images = [];

    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "product_images" })
      );

      const uploadedImages = await Promise.all(imageUploadPromises);
      images = uploadedImages.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));
    }

    // Validate required ObjectId fields
    if (!brand || brand === "undefined") {
      return res.status(400).json({ message: "Brand is required and must be selected." });
    }
    if (!category || category === "undefined") {
      return res.status(400).json({ message: "Category is required and must be selected." });
    }
    const subCatValue = subCategory || req.body.subcategory || req.body.subCatogery || req.body.subcatogery;
    if (!subCatValue || subCatValue === "undefined") {
      return res.status(400).json({ message: "Subcategory is required and must be selected." });
    }
    const hsnValue = hsn || req.body.hsnm;
    if (!hsnValue || hsnValue === "undefined") {
      return res.status(400).json({ message: "HSN is required and must be selected." });
    }
   
    const supplierValue = (supplier && typeof supplier === 'string' && supplier.trim() !== '') ? supplier : undefined;
    const newProduct = new Product({
      productName,
      sku,
      brand,
      category,
      subcategory: subCatValue,
      supplier: supplierValue,
      itemBarcode,
      store,
      warehouse,
      purchasePrice,
      sellingPrice,
      wholesalePrice,
      retailPrice,
      quantity,
      unit,
      taxType,
      tax,
      discountType,
      discountValue,
      quantityAlert,
      images,
      description,
      seoTitle,
      seoDescription,
      variants,
      itemType,
      isAdvanced,
      trackType,
      isReturnable,
      leadTime,
      reorderLevel,
      initialStock,
      serialNumber,
      batchNumber,
      returnable,
      expirationDate,
      hsn: hsnValue,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand")
      .populate("category")
      .populate("subcategory")
      .populate("hsn")
      .populate("supplier")
      .populate("warehouse")
      .sort({ createdAt: -1 }); // Optional: latest first

    // Ensure hsnCode, supplierName, warehouseName are always present for frontend
    const productsWithDetails = products.map(prod => {
      let hsnCode = "";
      if (prod.hsn) {
        if (typeof prod.hsn === "object" && prod.hsn !== null) {
          hsnCode = prod.hsn.code || prod.hsn.hsnCode || prod.hsn.name || prod.hsn._id || "";
        } else {
          hsnCode = prod.hsn;
        }
      } else if (prod.hsnCode) {
        hsnCode = prod.hsnCode;
      }

      let supplierName = "";
      if (prod.supplier) {
        if (typeof prod.supplier === "object" && prod.supplier !== null) {
          supplierName = prod.supplier.name || prod.supplier.supplierName || prod.supplier.companyName || prod.supplier.firstName || prod.supplier._id || "";
        } else {
          supplierName = prod.supplier;
        }
      }

      let warehouseName = "";
      if (prod.warehouse) {
        if (typeof prod.warehouse === "object" && prod.warehouse !== null) {
          warehouseName = prod.warehouse.name || prod.warehouse.warehouseName || prod.warehouse._id || "";
        } else {
          warehouseName = prod.warehouse;
        }
      }

      // Remove full supplier and warehouse objects from response, only send names
      const { supplier, warehouse, ...rest } = prod._doc;
      return { ...rest, hsnCode, supplierName, warehouseName };
    });
    res.status(200).json(productsWithDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/search?name=abc
exports.searchProductsByName = async (req, res) => {
  try {
    const { name } = req.query;
    console.log("Search query received:", name);

    const query = name
      ? { productName: { $regex: name, $options: "i" } } // ✅ Fixed field name
      : {};

    const products = await Product.find(query)
      .populate("brand")
      .populate("category")
      .populate("subcategory")
      .populate("hsn")
        .populate("supplier")
      .populate("warehouse")
      .sort({ createdAt: -1 });

    // Add hsnCode and availableQty logic for frontend
    const productsWithDetails = products.map(prod => {
      let hsnCode = "";
      if (prod.hsn) {
        if (typeof prod.hsn === "object" && prod.hsn !== null) {
          hsnCode = prod.hsn.code || prod.hsn.hsnCode || prod.hsn.name || prod.hsn._id || "";
        } else {
          hsnCode = prod.hsn;
        }
      } else if (prod.hsnCode) {
        hsnCode = prod.hsnCode;
      }
      // Calculate availableQty as quantity + sum(newQuantity array)
      const qty = Number(prod.quantity) || 0;
      let newQuantitySum = 0;
      if (Array.isArray(prod.newQuantity)) {
        newQuantitySum = prod.newQuantity.reduce((acc, n) => {
          const num = Number(n);
          return acc + (isNaN(num) ? 0 : num);
        }, 0);
      } else if (typeof prod.newQuantity === 'number') {
        newQuantitySum = Number(prod.newQuantity);
      }
      // availableQty is always latest DB value after sale subtraction
      const availableQty = qty + newQuantitySum;
      // Add availableStock field for frontend
      const availableStock = availableQty;
      return { ...prod._doc, hsnCode, availableQty, availableStock };
    });
    res.status(200).json(productsWithDetails);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: err.message });
  }
};


// GET /api/products/stock
exports.getProductStock = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand")
      .populate("category")
      .populate("subcategory")
      .populate("hsn")
        .populate("supplier")
      .populate("warehouse")
      .sort({ createdAt: -1 });

 
    const productsWithStock = products.map(prod => {
      let hsnCode = "";
      if (prod.hsn) {
        if (typeof prod.hsn === "object" && prod.hsn !== null) {
          hsnCode = prod.hsn.code || prod.hsn.hsnCode || prod.hsn.name || prod.hsn._id || "";
        } else {
          hsnCode = prod.hsn;
        }
      } else if (prod.hsnCode) {
        hsnCode = prod.hsnCode;
      }
      const qty = Number(prod.quantity) || 0;
      let newQuantitySum = 0;
      if (Array.isArray(prod.newQuantity)) {
        newQuantitySum = prod.newQuantity.reduce((acc, n) => {
          const num = Number(n);
          return acc + (isNaN(num) ? 0 : num);
        }, 0);
      } else if (typeof prod.newQuantity === 'number') {
        newQuantitySum = Number(prod.newQuantity);
      }
      const availableStock = qty + newQuantitySum;
           const purchasePrice = Number(prod.purchasePrice) || 0;
           const stockValue = availableStock * purchasePrice;
          let warehouseName = '';
          if (prod.warehouse) {
            if (typeof prod.warehouse === 'object' && prod.warehouse !== null) {
              warehouseName = prod.warehouse.name || prod.warehouse.warehouseName || prod.warehouse._id || '';
            } else {
              warehouseName = prod.warehouse;
            }
          }
          let supplierName = '';
          if (prod.supplier) {
            if (typeof prod.supplier === 'object' && prod.supplier !== null) {
              supplierName = prod.supplier.name || prod.supplier.supplierName || prod.supplier.companyName || prod.supplier.firstName || prod.supplier._id || '';
            } else {
              supplierName = prod.supplier;
            }
          }
          return {
            _id: prod._id,
            productName: prod.productName,
            hsnCode,
            availableStock,
            unit: prod.unit,
            purchasePrice,
            stockValue,
            warehouseName,
            supplierName
          };
    });
    res.status(200).json(productsWithStock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

   // GET /api/products/purchase-return-stock
    exports.getPurchaseReturnStock = async (req, res) => {
      try {
        const products = await Product.find()
          .populate("brand")
          .populate("category")
          .populate("subcategory")
          .populate("hsn")
          .populate("supplier")
          .populate("warehouse")
          .sort({ createdAt: -1 });

        const productsWithReturnStock = products.map(prod => {
          let hsnCode = "";
          if (prod.hsn) {
            if (typeof prod.hsn === "object" && prod.hsn !== null) {
              hsnCode = prod.hsn.code || prod.hsn.hsnCode || prod.hsn.name || prod.hsn._id || "";
            } else {
              hsnCode = prod.hsn;
            }
          } else if (prod.hsnCode) {
            hsnCode = prod.hsnCode;
          }
          // Calculate availableReturnStock as purchaseReturnQuantity - sum(newPurchaseReturnQuantity)
          const qty = Number(prod.purchaseReturnQuantity) || 0;
          let newQuantitySum = 0;
          if (Array.isArray(prod.newPurchaseReturnQuantity)) {
            newQuantitySum = prod.newPurchaseReturnQuantity.reduce((acc, n) => {
              const num = Number(n);
              return acc + (isNaN(num) ? 0 : num);
            }, 0);
          } else if (typeof prod.newPurchaseReturnQuantity === 'number') {
            newQuantitySum = Number(prod.newPurchaseReturnQuantity);
          }
          const availableReturnStock = qty - newQuantitySum;
          const purchasePrice = Number(prod.purchasePrice) || 0;
          const stockValue = availableReturnStock * purchasePrice;
          return {
            _id: prod._id,
            productName: prod.productName,
            hsnCode,
            availableReturnStock,
            unit: prod.unit,
            purchasePrice,
            stockValue
          };
        });
        res.status(200).json(productsWithReturnStock);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    };

// Get Single Product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const {
      productName,
      sku,
      brand,
      category,
      subcategory,
      supplier,
      itemBarcode,
      store,
      warehouse,
      purchasePrice,
      sellingPrice,
      wholesalePrice,
      retailPrice,
      quantity,
      unit,
      taxType,
      tax,
      discountType,
      discountValue,
      quantityAlert,
      description,
      seoTitle,
      seoDescription,
      hsn,
      variants: variantsString
    } = req.body;

 // Parse variants if sent as JSON string
    const variants = variantsString ? JSON.parse(variantsString) : {};

    // Upload new images if provided
    let newImages = [];
    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(file => cloudinary.uploader.upload(file.path, { folder: "product_images" }))
      );
      newImages = uploadedImages.map(img => ({ url: img.secure_url, public_id: img.public_id }));
    }

    // Merge existing images from frontend
    let existingImages = [];
    if (req.body.existingImages) {
  const parsed = JSON.parse(req.body.existingImages);

  // Make sure each item is an object with url & public_id
  existingImages = parsed.map(img => {
    if (typeof img === "string") {
      return { url: img, public_id: "" }; // no public_id if not sent
    } else {
      return img;
    }
  });
}

    const allImages = [...existingImages, ...newImages];
    

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
       ...req.body,
       images: allImages,
       variants
      },
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.importProducts = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const importedProducts = [];

    for (const row of data) {
      const product = new Product({
        productName: row.productName,
        sku: row.sku,
        brand: row.brand, // Make sure this is an ObjectId if using ref
        category: row.category,
        subcategory: row.subcategory,
        supplier: row.supplier,
        itemBarcode: row.itemBarcode,
        store: row.store,
        warehouse: row.warehouse,
        purchasePrice: row.purchasePrice,
        sellingPrice: row.sellingPrice,
        wholesalePrice: row.wholesalePrice,
        retailPrice: row.retailPrice,
        quantity: row.quantity,
        unit: row.unit,
        taxType: row.taxType,
        tax: row.tax,
        discountType: row.discountType,
        discountValue: row.discountValue,
        quantityAlert: row.quantityAlert,
        description: row.description,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        variants: row.variants ? JSON.parse(row.variants) : {},
        itemType: row.itemType,
        isAdvanced: row.isAdvanced,
        trackType: row.trackType,
        isReturnable: row.isReturnable,
        leadTime: row.leadTime,
        reorderLevel: row.reorderLevel,
        initialStock: row.initialStock,
        serialNumber: row.serialNumber,
        batchNumber: row.batchNumber,
        returnable: row.returnable,
        expirationDate: row.expirationDate ? new Date(row.expirationDate) : null,
      });
      const saved = await product.save();
      importedProducts.push(saved);
    }

    res.status(201).json({ message: "Products imported", count: importedProducts.length });
  } catch (error) {
    res.status(500).json({ message: "Import failed", error: error.message });
  }
};

// // ✅ Total stock in hand (sellingPrice * quantity)
// exports.getTotalStockValue = async (req, res) => {
//   try {
//     const result = await Product.aggregate([
//       {
//         $project: {
//           sellingPrice: { $ifNull: ["$sellingPrice", 0] },
//           // if quantity exists, use it
//           quantity: { $ifNull: ["$quantity", 0] },
//           // sum of newQuantity[] if present
//           newQuantityTotal: { $sum: { $ifNull: ["$newQuantity", []] } }
//         }
//       },
//       {
//         $project: {
//           stockValue: {
//             $cond: [
//               { $gt: ["$quantity", 0] }, // if normal quantity exists
//               { $multiply: ["$sellingPrice", "$quantity"] },
//               { $multiply: ["$sellingPrice", "$newQuantityTotal"] }
//             ]
//           }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           totalStockValue: { $sum: "$stockValue" }
//         }
//       }
//     ]);

//     res.json({
//       success: true,
//       totalStockValue: result[0]?.totalStockValue || 0
//     });
//   } catch (err) {
//     console.error("❌ Aggregation Error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };






// optional
// const Product = require("../models/productModels");

// // Create Product
// const createProduct = async (req, res) => {
//   try {
//     const product = new Product(req.body);
//     const saved = await product.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // Get All Products
// const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get Single Product
// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.status(200).json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Update Product
// const updateProduct = async (req, res) => {
//   try {
//     const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!updated) return res.status(404).json({ message: "Product not found" });
//     res.status(200).json(updated);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // Delete Product
// const deleteProduct = async (req, res) => {
//   try {
//     const deleted = await Product.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Product not found" });
//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = {
//   createProduct,
//   getAllProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// };
