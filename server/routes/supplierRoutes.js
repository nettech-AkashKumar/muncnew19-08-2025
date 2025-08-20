const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

const upload = require("../middleware/Multer/multer");


// Create supplier
router.post('/', upload.array('images'), supplierController.createSupplier);

// GSTIN verify and fetch real data
router.post('/verify-gstin', supplierController.verifyGSTIN);

// Fetch all suppliers
router.get('/', supplierController.getAllSuppliers);
router.get('/active', supplierController.getActiveSuppliers);// router.get("/suppliers/active-dropdown", supplierController.getActiveSuppliersDropdown);


// Get single supplier
router.get('/:id', supplierController.getSupplierById);

// Edit supplier
router.put('/:id', upload.array('images'), supplierController.updateSupplier);

// Delete supplier
router.delete('/:id', supplierController.deleteSupplier);



module.exports = router;