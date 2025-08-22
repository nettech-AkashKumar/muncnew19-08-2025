const mongoose = require("mongoose");

const salesHistorySchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        type: {
            type: String,
            enum: ["PURCHASE", "SALE", "RETURN", "ADJUSTMENT"],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        referenceId: {
            type: mongoose.Schema.Types.ObjectId, // e.g. Sale ID / Purchase ID
            required: true,
        },
        note: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SalesHistory", salesHistorySchema);
