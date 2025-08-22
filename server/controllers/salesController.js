// Auto-generate next sale reference number (like purchase)

// const Sales = require('../models/salesModel');
// const mongoose = require('mongoose');
// const Products = require('../models/productModels');

const mongoose = require("mongoose");
const Sales = require("../models/salesModel");
const Product = require("../models/productModels");
const StockHistory = require("../models/soldStockHistoryModel");
const PaymentHistory = require("../models/salesPaymentHistoryModel"); // ✅ New Model

// 🔹 Create Sale
// exports.createSale = async (req, res) => {
//   try {
//     const {
//       customer,
//       billing,
//       shipping,
//       products,
//       saleDate,
//       status,
//       paymentType, // Full | Partial | Pending
//       referenceNumber,
//       paidAmount,
//       dueAmount,
//       dueDate,
//       paymentMethod,
//       transactionId,
//       onlineMod,
//       transactionDate,
//       paymentStatus,
//       images,
//       description,
//       cgst,
//       sgst,
//       totalAmount,
//       labourCost,
//       orderTax,
//       orderDiscount,
//       roundOff,
//       roundOffValue,
//       shippingCost,
//       notes,
//       currency,
//       enableTax,
//       enableAddCharges,
//     } = req.body;

//     // ✅ Validate
//     if (!customer || !mongoose.Types.ObjectId.isValid(customer)) {
//       return res.status(400).json({ message: "Please fill customer" });
//     }
//     if (!products || products.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Please add at least one product" });
//     }

//     // ✅ Check and update product stock
//     for (const item of products) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//       }

//       if (product.availableQty < item.saleQty) {
//         return res.status(400).json({
//           message: `Not enough stock for ${product.name}. Available: ${product.availableQty}, Requested: ${item.saleQty}`,
//         });
//       }

//       // 🔹 Subtract saleQty from stock
//       product.availableQty -= item.saleQty;
//       await product.save();

//       // 🔹 Stock History Entry
//       await StockHistory.create({
//         product: product._id,
//         type: "SALE",
//         quantity: -item.saleQty,
//         reference: referenceNumber,
//         date: saleDate,
//         notes: `Sale created for ${item.saleQty} qty`,
//       });
//     }

//     // ✅ Create Sale
//     const sale = new Sales({
//       customer,
//       billing,
//       shipping,
//       products,
//       saleDate,
//       status,
//       paymentType,
//       referenceNumber,
//       paidAmount,
//       dueAmount,
//       dueDate,
//       paymentMethod,
//       transactionId,
//       onlineMod,
//       transactionDate,
//       paymentStatus,
//       images,
//       description,
//       cgst,
//       sgst,
//       totalAmount,
//       labourCost,
//       orderTax,
//       orderDiscount,
//       roundOff,
//       roundOffValue,
//       shippingCost,
//       notes,
//       currency,
//       enableTax,
//       enableAddCharges,
//     });

//     await sale.save();

//     // ✅ Payment History Log
//     if (paymentType === "Full" || paymentType === "Partial") {
//       await PaymentHistory.create({
//         sale: sale._id,
//         customer,
//         paymentType,
//         paidAmount,
//         dueAmount,
//         paymentMethod,
//         transactionId,
//         onlineMod,
//         transactionDate,
//         paymentStatus,
//         notes: "Initial payment logged during Sale creation",
//       });
//     }

//     res.status(201).json({ message: "Sale created successfully", sale });
//   } catch (error) {
//     console.error("Error creating sale:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// 🔹 Add Payment to Existing Sale (Partial Payment Update)
exports.addPaymentToSale = async (req, res) => {
  try {
    const { saleId } = req.params;
    const { paidAmount, paymentMethod, transactionId, onlineMod, transactionDate, notes } = req.body;

    const sale = await Sales.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // ✅ Update Paid and Due Amount
    sale.paidAmount += paidAmount;
    sale.dueAmount = sale.totalAmount - sale.paidAmount;

    // ✅ Update Payment Status
    if (sale.dueAmount === 0) {
      sale.paymentStatus = "Paid";
      sale.paymentType = "Full";
    } else {
      sale.paymentStatus = "Partial";
      sale.paymentType = "Partial";
    }

    await sale.save();

    // ✅ Log into Payment History
    await PaymentHistory.create({
      sale: sale._id,
      customer: sale.customer,
      paymentType: sale.paymentType,
      paidAmount,
      dueAmount: sale.dueAmount,
      paymentMethod,
      transactionId,
      onlineMod,
      transactionDate,
      status: sale.paymentStatus,
      notes: notes || "Partial payment received",
    });

    res
      .status(200)
      .json({ message: "Payment added successfully", sale });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getNextReferenceNumber = async (req, res) => {
  try {
    const lastSale = await Sales.findOne({}, { referenceNumber: 1 }).sort({ _id: -1 });
    let newRef = "SL001"; // Default reference number
    if (lastSale && lastSale.referenceNumber) {
      const match = lastSale.referenceNumber.match(/SL(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10) + 1;
        newRef = `SL${num.toString().padStart(3, "0")}`;
      }
    }
    res.status(200).json({ referenceNumber: newRef });
  } catch (error) {
    console.error("Error generating sale reference number:", error);
    res.status(500).json({ error: "Failed to generate sale reference number" });
  }
};


// 🔹 Create Sale
exports.createSale = async (req, res) => {
  try {
    const {
      customer,
      billing,
      shipping,
      products,
      saleDate,
      status,
      paymentType,
      referenceNumber,
      paidAmount,
      dueAmount,
      dueDate,
      paymentMethod,
      transactionId,
      onlineMod,
      transactionDate,
      paymentStatus,
      images,
      description,
      cgst,
      sgst,
      totalAmount,
      labourCost,
      orderTax,
      orderDiscount,
      roundOff,
      roundOffValue,
      shippingCost,
      notes,
      currency,
      enableTax,
      enableAddCharges,
    } = req.body;


    // ✅ Validate
    if (!customer || !mongoose.Types.ObjectId.isValid(customer)) {
      return res.status(400).json({ message: "Please fill customer" });
    }
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Please add at least one product" });
    }
    // ✅ Check and update product stock
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.availableQty < item.saleQty) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.availableQty}, Requested: ${item.saleQty}`,
        });
      }

      // 🔹 Subtract saleQty from stock
      product.availableQty -= item.saleQty;
      await product.save();

      // 🔹 Stock History Entry
      await StockHistory.create({
        product: product._id,
        type: "SALE",
        quantity: -item.saleQty,
        reference: referenceNumber,
        date: saleDate,
        notes: `Sale created for ${item.saleQty} qty`,
      });
    }

    // ✅ Payment History Log
    if (paymentType === "Full" || paymentType === "Partial") {
      await PaymentHistory.create({
        sale: sale._id,
        customer,
        paymentType,
        paidAmount,
        dueAmount,
        paymentMethod,
        transactionId,
        onlineMod,
        transactionDate,
        status: paymentStatus,
        notes: "Initial payment logged during Sale creation",
      });
    }

    // ✅ Create Sale
    const sale = new Sales({
      customer,
      billing,
      shipping,
      products,
      saleDate,
      status,
      paymentType,
      referenceNumber,
      paidAmount,
      dueAmount,
      dueDate,
      paymentMethod,
      transactionId,
      onlineMod,
      transactionDate,
      paymentStatus,
      images,
      description,
      cgst,
      sgst,
      totalAmount,
      labourCost,
      orderTax,
      orderDiscount,
      roundOff,
      roundOffValue,
      shippingCost,
      notes,
      currency,
      enableTax,
      enableAddCharges,
    });

    await sale.save();
    res.status(201).json({ message: "Sale created successfully", sale });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





// Get all sales



exports.getSales = async (req, res) => {
  try {
    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search params
    const search = req.query.search || "";
    const status = req.query.status;
    const paymentStatus = req.query.paymentStatus;
    const customer = req.query.customer;

    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { referenceNumber: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } }
      ];
    }
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (customer) query.customer = customer;

    // Fetch sales with pagination and search
    const total = await Sales.countDocuments(query);
    const sales = await Sales.find(query)
      .populate({ path: 'customer', select: '-password -__v' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      sales,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update sale
exports.updateSale = async (req, res) => {
  try {
    let data = req.body;
    if (data.extraInfo && typeof data.extraInfo === 'string') {
      data.extraInfo = JSON.parse(data.extraInfo);
    }
    const sale = await Sales.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete sale
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sales.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
