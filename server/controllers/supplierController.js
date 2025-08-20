const Supplier = require('../models/supplierModel');
const cloudinary = require("../utils/cloudinary/cloudinary");
const axios = require('axios');

// Create supplier
exports.createSupplier = async (req, res) => {
  try {
    let supplierData = req.body;

    // Parse nested fields if sent as string
    if (typeof supplierData.billing === 'string') {
      supplierData.billing = JSON.parse(supplierData.billing);
    }
    if (typeof supplierData.shipping === 'string') {
      supplierData.shipping = JSON.parse(supplierData.shipping);
    }
    if (typeof supplierData.bank === 'string') {
      supplierData.bank = JSON.parse(supplierData.bank);
    }

    // Auto-generate supplierCode
    const lastSupplier = await Supplier.findOne(
      { supplierCode: { $ne: null } },
      {},
      { sort: { createdAt: -1 } }
    );
    let supplierCode = 'SUP001';
    if (lastSupplier && lastSupplier.supplierCode) {
      const lastNum = parseInt(lastSupplier.supplierCode.replace('SUP', '')) || 0;
      supplierCode = 'SUP' + String(lastNum + 1).padStart(3, '0');
    }
    supplierData.supplierCode = supplierCode;

    // Cloudinary Image Upload (Single or Multiple Files)
    const uploadedImages = req.files?.length
      ? await Promise.all(
          req.files.map((file) =>
            cloudinary.uploader.upload(file.path, {
              folder: "suppliers",
            })
          )
        )
      : req.file
      ? [await cloudinary.uploader.upload(req.file.path, { folder: "suppliers" })]
      : [];

    supplierData.images = uploadedImages.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
    }));

    const supplier = await Supplier.create(supplierData);
    res.status(201).json(supplier);
  } catch (err) {
    console.error('Create supplier error:', err);
    res.status(500).json({
      error: 'Failed to create supplier',
      details: err.message,
    });
  }
};

// Get all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate('billing.country')
      .populate('billing.state')
      .populate('billing.city')
      .populate('shipping.country')
      .populate('shipping.state')
      .populate('shipping.city');
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch suppliers', details: err.message });
  }
};

// Get single supplier
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('billing.country')
      .populate('billing.state')
      .populate('billing.city')
      .populate('shipping.country')
      .populate('shipping.state')
      .populate('shipping.city');
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch supplier', details: err.message });
  }
};


// GET ACTIVE USERS
// Get only active suppliers for dropdown/modal
exports.getActiveSuppliers = async (req, res) => {
  try {
    // Only fetch suppliers with status: true, and only needed fields
    const activeSuppliers = await Supplier.find({ status: true })
      .populate('_id firstName lastName supplierCode companyName') // add more fields if needed
      .sort({ companyName: 1 }); // or sort as you wish

    res.status(200).json({
      message: "Active suppliers fetched successfully",
      total: activeSuppliers.length,
      suppliers: activeSuppliers,
    });
  } catch (error) {
    console.error("Get Active Suppliers Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  try {
    let updateData = req.body;
    if (typeof updateData.billing === 'string') {
      updateData.billing = JSON.parse(updateData.billing);
    }
    if (typeof updateData.shipping === 'string') {
      updateData.shipping = JSON.parse(updateData.shipping);
    }
    if (typeof updateData.bank === 'string') {
      updateData.bank = JSON.parse(updateData.bank);
    }

    // Cloudinary Image Upload (Single or Multiple Files)
    let uploadedImages = [];
    if (req.files?.length) {
      uploadedImages = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: "suppliers",
          })
        )
      );
    } else if (req.file) {
      uploadedImages = [await cloudinary.uploader.upload(req.file.path, { folder: "suppliers" })];
    }

    if (uploadedImages.length > 0) {
      updateData.images = uploadedImages.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));
    }

    const supplier = await Supplier.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('billing.country')
      .populate('billing.state')
      .populate('billing.city')
      .populate('shipping.country')
      .populate('shipping.state')
      .populate('shipping.city');
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update supplier', details: err.message });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete supplier', details: err.message });
  }
};

// GSTIN verification (example, adjust to your API)
exports.verifyGSTIN = async (req, res) => {
  const { gstin } = req.body;
  try {
    // Basic GSTIN format check
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin)) {
      return res.status(400).json({ error: 'Invalid GSTIN format' });
    }
    // Replace with your GST API logic
    // For demo, return valid
    res.json({
      gstin,
      valid: true,
      name: 'Demo Supplier',
      address: 'Demo Address',
      state: 'Demo State',
      businessType: 'Demo Type'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify GSTIN', details: err.message });
  }
};

