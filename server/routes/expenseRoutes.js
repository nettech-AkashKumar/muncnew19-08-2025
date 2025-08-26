const express = require("express");
const multer = require("multer");
const Expense = require("../models/ExpenseReportModal.js");

const router = express.Router();

// multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// POST expense
router.post("/", upload.single("receipt"), async (req, res) => {
  try {
    const newExpense = new Expense({
      date: req.body.date,
      paymentStatus: req.body.paymentStatus,
      expenseTitle: req.body.expenseTitle,
      notes: req.body.notes,
      paymentMode: req.body.paymentMode,
      paidTo: req.body.paidTo,
      amount: req.body.amount,
      receipt: req.file ? req.file.filename : null,
    });

    await newExpense.save();
    res.status(201).json({ message: "Expense saved successfully", newExpense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
