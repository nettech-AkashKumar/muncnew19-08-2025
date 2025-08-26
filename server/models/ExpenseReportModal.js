const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    paymentStatus: { type: String, enum: ["Paid", "Pending", "Failed"], required: true },
    expenseTitle: { type: String, required: true },
    notes: { type: String },
    paymentMode: { type: String },
    paidTo: { type: String },
    amount: { type: Number, required: true },
    receipt: { type: String }, // store image filename
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
