// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import BASE_URL from "../../../../pages/config/config";
// import "./product.css";
// import Select from "react-select";
// import { useDropzone } from "react-dropzone";
// import { MdImageSearch } from "react-icons/md";
// import CategoryModal from "../../../../pages/Modal/categoryModals/CategoryModal";
// import { TbChevronUp, TbRefresh } from "react-icons/tb";
// import { useTranslation } from "react-i18next";

// const EditProduct = () => {
//     const { t } = useTranslation();
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [images, setImages] = useState([]);
//     const steps = [
//         t("descriptionAndMedia"),
//         t("pricing"),
//         t("images"),
//         t("variants")
//     ];
//     const variantTabs = [
//         t("color"),
//         t("size"),
//         t("expiry"),
//         t("material"),
//         t("model"),
//         t("weight"),
//         t("skinType"),
//         t("packagingType"),
//         t("flavour")
//     ];
//     const [step, setStep] = useState(0);
//     const [stepStatus, setStepStatus] = useState(Array(steps.length).fill("pending"));
//     const [activeTab, setActiveTab] = useState("Color");

//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 const res = await axios.get(`${BASE_URL}/api/products/${id}`);
//                 setFormData(res.data);
//                 setLoading(false);
//             } catch (error) {
//                 toast.error("Failed to fetch product");
//                 setLoading(false);
//             }
//         };
//         fetchProduct();
//     }, [id]);

//     const inputChange = (key, value) => {
//         if (step === 3) {
//             const parsedValues = value.split(",").map((v) => v.trim());
//             setFormData((prev) => ({
//                 ...prev,
//                 variants: { ...prev.variants, [key]: parsedValues },
//             }));
//         } else {
//             setFormData((prev) => ({ ...prev, [key]: value }));
//         }
//     };

//     const validateStep = () => {
//         if (step === 0) {
//             return formData.productName;
//         }
//         if (step === 1) {
//             return formData.purchasePrice;
//         }
//         if (step === 2) {
//             return formData.description;
//         }
//         if (step === 3) {
//             return formData.variants[activeTab]?.length > 0;
//         }
//         return true;
//     };

//     const handleNext = () => {
//         const isValid = validateStep();
//         const updatedStatus = [...stepStatus];
//         updatedStatus[step] = isValid ? "complete" : "incomplete";
//         setStepStatus(updatedStatus);
//         if (isValid && step < steps.length - 1) {
//             setStep((prev) => prev + 1);
//         }
//     };

//     const handlePrev = () => {
//         if (step > 0) setStep((prev) => prev - 1);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const formPayload = new FormData();
//             Object.entries(formData).forEach(([key, value]) => {
//                 if (key === "variants") {
//                     formPayload.append(key, JSON.stringify(value));
//                 } else {
//                     formPayload.append(key, value);
//                 }
//             });
//             images.forEach((imgFile) => {
//                 formPayload.append("images", imgFile);
//             });
//             await axios.put(`${BASE_URL}/api/products/${id}`, formPayload, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             toast.success("Product updated successfully!");
//             navigate("/product");
//         } catch (error) {
//             toast.error("Failed to update product");
//         }
//     };
//     // Add this inside your component (before return)
// const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setFormData((prev) => ({
//         ...prev,
//         [name]: type === "checkbox" ? checked : value,
//     }));
// };

//     if (loading) return <div>Loading...</div>;

//     return (
//         <div className="page-wrapper mt-4">
//             <div className="content">
//                 <div className="page-header">
//                     <div className="add-item d-flex">
//                         <div className="page-title">
//                             <h4 className="fw-bold">{t("editProduct")}</h4>
//                             <h6>{t("editProductDetails")}</h6>
//                         </div>
//                     </div>
//                     <div className="table-top-head me-2">
//                         <li>
//                             <button type="button" className="icon-btn"><TbRefresh /></button>
//                         </li>
//                         <li>
//                             <button type="button" className="icon-btn"><TbChevronUp /></button>
//                         </li>
//                     </div>
//                     <div className="page-btn mt-0">
//                         <button className="btn btn-secondary" onClick={() => navigate("/product")}>{t("backToProduct")}</button>
//                     </div>
//                 </div>
//                 <div className="progress-wrapper d-flex justify-content-between align-items-center mb-4 position-relative">
//                     {steps.map((label, index) => {
//                         const status = stepStatus[index];
//                         const isActive = index === step;
//                         const isComplete = status === "complete";
//                         const isIncomplete = status === "incomplete";
//                         return (
//                             <div key={index} className="step-wrapper">
//                                 <div className={`circle ${isComplete ? "complete" : isIncomplete ? "incomplete" : isActive ? "active" : ""}`}>{index + 1}</div>
//                                 <div className="step-text">{label}</div>
//                                 {index < steps.length - 1 && (
//                                     <div className={`progress-line ${status === "complete" ? "line-complete" : status === "incomplete" ? "line-incomplete" : "line-pending"}`} />
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                     <div className="p-3 accordion-item border mb-4">
//                         {/* Step 0 - Basic Info */}
//                         {step === 0 && (
//                             <div className="accordion-body">
//                                 <div className="mb-3">
//                                     <label className="form-label fw-semibold">Item Type</label>
//                                     <div className="d-flex gap-4">
//                                         <div className="form-check">
//                                             <input className="form-check-input" type="radio" name="itemType" value="Good" checked={formData.itemType === "Good"} onChange={handleChange} />
//                                             <label className="form-check-label">Good</label>
//                                         </div>
//                                         <div className="form-check">
//                                             <input className="form-check-input" type="radio" name="itemType" value="Service" checked={formData.itemType === "Service"} onChange={handleChange} />
//                                             <label className="form-check-label">Service</label>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="row">
//                                     <div className="col-sm-6 col-12 mb-3">
//                                         <label className="form-label">Product Name<span className="text-danger">*</span></label>
//                                         <input type="text" className="form-control" name="productName" value={formData.productName || ""} onChange={handleChange} required />
//                                     </div>
//                                     {/* ...other fields as in ProductCreate... */}
//                                 </div>
//                             </div>
//                         )}
//                         {/* ...other steps (pricing, images, variants) as in ProductCreate... */}
//                     </div>
//                     <div className="d-flex justify-content-between">
//                         <button type="button" className="btn btn-secondary" onClick={handlePrev} disabled={step === 0}>Previous</button>
//                         {step < steps.length - 1 ? (
//                             <button type="button" className="btn btn-primary" onClick={handleNext}>Next</button>
//                         ) : (
//                             <button type="submit" className="btn btn-success">Update Product</button>
//                         )}
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditProduct;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import BASE_URL from "../../../../pages/config/config";
// import "./product.css";
// import Select from "react-select";
// import { useDropzone } from "react-dropzone";
// import { MdImageSearch } from "react-icons/md";
// import CategoryModal from "../../../../pages/Modal/categoryModals/CategoryModal";
// import { TbChevronUp, TbRefresh } from "react-icons/tb";
// import { useTranslation } from "react-i18next";

// const EditProduct = () => {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     productName: "",
//     slug: "",
//     sku: "",
//     brand: "",
//     category: "",
//     subCategory: "",
//     supplier: "",
//     itemBarcode: "",
//     store: "",
//     warehouse: "",
//     purchasePrice: "",
//     sellingPrice: "",
//     wholesalePrice: "",
//     retailPrice: "",
//     quantity: "",
//     unit: "",
//     taxType: "",
//     tax: "",
//     discountType: "",
//     discountValue: "",
//     quantityAlert: "",
//     description: "",
//     seoTitle: "",
//     seoDescription: "",
//     variants: {},
//     sellingType: "",
//     barcodeSymbology: "",
//     productType: "Single",
//     itemType: "Good",
//     isAdvanced: false,
//     trackType: "serial",
//     isReturnable: false,
//     leadTime: "",
//     reorderLevel: "",
//     initialStock: "",
//     serialNumber: "",
//     batchNumber: "",
//     returnable: false,
//     expirationDate: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [images, setImages] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedsubCategory, setSelectedsubCategory] = useState(null);
//   const [selectedBrands, setSelectedBrands] = useState(null);
//   const [selectedUnits, setSelectedUnits] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [brandOptions, setBrandOptions] = useState([]);
//   const [unitsOptions, setUnitsOptions] = useState([]);
//   const [categoryName, setCategoryName] = useState("");
//   const [categorySlug, setCategorySlug] = useState("");

//   const steps = [
//     t("descriptionAndMedia"),
//     t("pricing"),
//     t("images"),
//     t("variants"),
//   ];
//   const variantTabs = [
//     t("color"),
//     t("size"),
//     t("expiry"),
//     t("material"),
//     t("model"),
//     t("weight"),
//     t("skinType"),
//     t("packagingType"),
//     t("flavour"),
//   ];
//   const [step, setStep] = useState(0);
//   const [stepStatus, setStepStatus] = useState(Array(steps.length).fill("pending"));
//   const [activeTab, setActiveTab] = useState("Color");

//   // Fetch product data
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/products/${id}`);
//         const product = res.data;
//         setFormData({
//           ...formData,
//           ...product,
//           variants: product.variants || {},
//         });
//         // Set selected options for react-select
//         if (product.category) {
//           setSelectedCategory({
//             value: product.category._id || product.category,
//             label: product.category.categoryName || product.category,
//           });
//         }
//         if (product.subCategory) {
//           setSelectedsubCategory({
//             value: product.subCategory._id || product.subCategory,
//             label: product.subCategory.subCategoryName || product.subCategory,
//           });
//         }
//         if (product.brand) {
//           setSelectedBrands({
//             value: product.brand._id || product.brand,
//             label: product.brand.brandName || product.brand,
//           });
//         }
//         if (product.unit) {
//           setSelectedUnits({
//             value: product.unit.shortName || product.unit,
//             label: product.unit.unitsName
//               ? `${product.unit.unitsName} (${product.unit.shortName})`
//               : product.unit,
//           });
//         }
//         // Set existing images
//         if (product.images) {
//           setImages(product.images.map((img) => ({ preview: img })));
//         }
//         setLoading(false);
//       } catch (error) {
//         toast.error("Failed to fetch product");
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   // Fetch categories, brands, and units
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/api/category/categories`);
//         const data = await res.json();
//         const options = data.map((category) => ({
//           value: category._id,
//           label: category.categoryName,
//         }));
//         setCategories(options);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     const fetchBrands = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${BASE_URL}/api/brands/active-brands`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         const options = data.brands.map((brand) => ({
//           value: brand._id,
//           label: brand.brandName,
//         }));
//         setBrandOptions(options);
//       } catch (error) {
//         console.error("Failed to load active brands:", error);
//       }
//     };

//     const fetchUnits = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/unit/units/status/active`);
//         const options = res.data.units.map((unit) => ({
//           value: unit.shortName,
//           label: `${unit.unitsName} (${unit.shortName})`,
//         }));
//         setUnitsOptions(options);
//       } catch (error) {
//         console.error("Failed to fetch active units:", error);
//       }
//     };

//     fetchCategories();
//     fetchBrands();
//     fetchUnits();
//   }, []);

//   // Fetch subcategories when category changes
//   useEffect(() => {
//     if (selectedCategory) {
//       fetchSubcategoriesByCategory(selectedCategory.value);
//     } else {
//       setSubcategories([]);
//       setSelectedsubCategory(null);
//     }
//   }, [selectedCategory]);

//   const fetchSubcategoriesByCategory = async (categoryId) => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/subcategory/by-category/${categoryId}`);
//       if (!res.ok) {
//         throw new Error(`Server error: ${res.status}`);
//       }
//       const data = await res.json();
//       const options = data.map((subcat) => ({
//         value: subcat._id,
//         label: subcat.subCategoryName,
//       }));
//       setSubcategories(options);
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//     }
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const inputChange = (key, value) => {
//     if (step === 3) {
//       const parsedValues = value.split(",").map((v) => v.trim());
//       setFormData((prev) => ({
//         ...prev,
//         variants: { ...prev.variants, [key]: parsedValues },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [key]: value }));
//     }
//   };

//   // Validate steps
//   const validateStep = () => {
//     if (step === 0) {
//       return formData.productName && formData.slug && formData.sku && selectedCategory && selectedsubCategory;
//     }
//     if (step === 1) {
//       return formData.purchasePrice && formData.sellingPrice && formData.quantity && selectedUnits;
//     }
//     if (step === 2) {
//       return formData.description;
//     }
//     if (step === 3) {
//       return formData.variants[activeTab]?.length > 0;
//     }
//     return true;
//   };

//   // Navigation handlers
//   const handleNext = () => {
//     const isValid = validateStep();
//     const updatedStatus = [...stepStatus];
//     updatedStatus[step] = isValid ? "complete" : "incomplete";
//     setStepStatus(updatedStatus);
//     if (isValid && step < steps.length - 1) {
//       setStep((prev) => prev + 1);
//     } else {
//       toast.error("Please complete all required fields");
//     }
//   };

//   const handlePrev = () => {
//     if (step > 0) setStep((prev) => prev - 1);
//   };

//   const handleSaveDraft = () => {
//     toast.info("Saved as draft!");
//   };

//   // Image handling
//   const onDrop = (acceptedFiles) => {
//     const mapped = acceptedFiles.map((file) =>
//       Object.assign(file, { preview: URL.createObjectURL(file) })
//     );
//     setImages((prev) => [...prev, ...mapped]);
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: { "image/*": [] },
//     onDrop,
//   });

//   // Form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateStep()) {
//       toast.error("Please complete all required fields before saving");
//       return;
//     }
//     try {
//       const formPayload = new FormData();
//       formPayload.append("productName", formData.productName);
//       formPayload.append("slug", formData.slug);
//       formPayload.append("sku", formData.sku);
//       formPayload.append("brand", selectedBrands?.value || formData.brand);
//       formPayload.append("category", selectedCategory?.value || formData.category);
//       formPayload.append("subcategory", selectedsubCategory?.value || formData.subCategory);
//       formPayload.append("supplier", formData.supplier);
//       formPayload.append("itemBarcode", formData.itemBarcode);
//       formPayload.append("store", formData.store);
//       formPayload.append("warehouse", formData.warehouse);
//       formPayload.append("purchasePrice", Number(formData.purchasePrice));
//       formPayload.append("sellingPrice", Number(formData.sellingPrice));
//       formPayload.append("wholesalePrice", Number(formData.wholesalePrice));
//       formPayload.append("retailPrice", Number(formData.retailPrice));
//       formPayload.append("quantity", Number(formData.quantity));
//       formPayload.append("unit", selectedUnits?.value || formData.unit);
//       formPayload.append("taxType", formData.taxType);
//       formPayload.append("tax", formData.tax);
//       formPayload.append("discountType", formData.discountType);
//       formPayload.append("discountValue", Number(formData.discountValue));
//       formPayload.append("quantityAlert", Number(formData.quantityAlert));
//       formPayload.append("description", formData.description);
//       formPayload.append("seoTitle", formData.seoTitle);
//       formPayload.append("seoDescription", formData.seoDescription);
//       formPayload.append("itemType", formData.itemType);
//       formPayload.append("isAdvanced", formData.isAdvanced);
//       formPayload.append("trackType", formData.trackType);
//       formPayload.append("isReturnable", formData.isReturnable);
//       formPayload.append("leadTime", formData.leadTime);
//       formPayload.append("reorderLevel", formData.reorderLevel);
//       formPayload.append("initialStock", formData.initialStock);
//       formPayload.append("serialNumber", formData.serialNumber);
//       formPayload.append("batchNumber", formData.batchNumber);
//       formPayload.append("returnable", formData.returnable);
//       formPayload.append("expirationDate", formData.expirationDate);
//       formPayload.append("variants", JSON.stringify(formData.variants));
//       images.forEach((imgFile) => {
//         if (imgFile instanceof File) {
//           formPayload.append("images", imgFile);
//         }
//       });

//       await axios.put(`${BASE_URL}/api/products/${id}`, formPayload, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("Product updated successfully!");
//       navigate("/product");
//     } catch (error) {
//       toast.error("Failed to update product");
//       console.error("Product update error:", error.response?.data || error.message);
//     }
//   };

//   // SKU and Barcode generation
//   const generateSKU = () => {
//     const category = selectedCategory?.label || formData.category || "GEN";
//     const name = formData.productName || "PRD";
//     const randomNum = Math.floor(Math.random() * 9000) + 1000;
//     const sku = `${category.toUpperCase().slice(0, 3)}-${name.toUpperCase().slice(0, 3)}-${randomNum}`;
//     setFormData((prev) => ({ ...prev, sku }));
//   };

//   const generateBarcode = () => {
//     const prefix = "BR";
//     const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);
//     return `${prefix}${randomNumber}`;
//   };

//   // Auto-generate SKU when product name or category changes
//   useEffect(() => {
//     if (formData.productName || selectedCategory) {
//       generateSKU();
//     }
//   }, [formData.productName, selectedCategory]);

//   // Category modal submission
//   const categorySubmit = async (e) => {
//     e.preventDefault();
//     if (!categoryName || !categorySlug) {
//       toast.error("All fields are required");
//       return;
//     }
//     try {
//       await axios.post(`${BASE_URL}/api/category/categories`, {
//         categoryName,
//         categorySlug,
//       });
//       toast.success("Category created successfully!");
//       setCategoryName("");
//       setCategorySlug("");
//       fetchCategories();
//       window.$("#categoryModal").modal("hide");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error creating category");
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="page-wrapper mt-4">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4 className="fw-bold">{t("editProduct")}</h4>
//               <h6>{t("editProductDetails")}</h6>
//             </div>
//           </div>
//           <div className="table-top-head me-2">
//             <li>
//               <button type="button" className="icon-btn">
//                 <TbRefresh />
//               </button>
//             </li>
//             <li>
//               <button type="button" className="icon-btn">
//                 <TbChevronUp />
//               </button>
//             </li>
//           </div>
//           <div className="page-btn mt-0">
//             <button className="btn btn-secondary" onClick={() => navigate("/product")}>
//               {t("backToProduct")}
//             </button>
//           </div>
//         </div>
//         <div className="progress-wrapper d-flex justify-content-between align-items-center mb-4 position-relative">
//           {steps.map((label, index) => {
//             const status = stepStatus[index];
//             const isActive = index === step;
//             const isComplete = status === "complete";
//             const isIncomplete = status === "incomplete";
//             return (
//               <div key={index} className="step-wrapper">
//                 <div className={`circle ${isComplete ? "complete" : isIncomplete ? "incomplete" : isActive ? "active" : ""}`}>
//                   {index + 1}
//                 </div>
//                 <div className="step-text">{label}</div>
//                 {index < steps.length - 1 && (
//                   <div className={`progress-line ${status === "complete" ? "line-complete" : status === "incomplete" ? "line-incomplete" : "line-pending"}`} />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="p-3 accordion-item border mb-4">
//             {/* Step 0 - Basic Info */}
//             {step === 0 && (
//               <div className="accordion-body">
//                 <div className="mb-3">
//                   <label className="form-label fw-semibold">{t("itemType")}</label>
//                   <div className="d-flex gap-4">
//                     <div className="form-check">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="itemType"
//                         value="Good"
//                         checked={formData.itemType === "Good"}
//                         onChange={handleChange}
//                       />
//                       <label className="form-check-label">{t("good")}</label>
//                     </div>
//                     <div className="form-check">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="itemType"
//                         value="Service"
//                         checked={formData.itemType === "Service"}
//                         onChange={handleChange}
//                       />
//                       <label className="form-check-label">{t("service")}</label>
//                     </div>
//                   </div>
//                 </div>
//                 {formData.itemType === "Good" ? (
//                   <div className="row">
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">
//                         {t("productName")}<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="productName"
//                         className="form-control"
//                         value={formData.productName}
//                         onChange={handleChange}
//                         placeholder={t("enterProductName")}
//                       />
//                     </div>
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">
//                         {t("slug")}<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="slug"
//                         className="form-control"
//                         value={formData.slug}
//                         onChange={handleChange}
//                         placeholder={t("enterSlug")}
//                       />
//                     </div>
//                     <div className="col-sm-6 col-12">
//                       <div className="mb-3 list position-relative">
//                         <label className="form-label">
//                           {t("sku")}<span className="text-danger ms-1">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           name="sku"
//                           className="form-control"
//                           value={formData.sku}
//                           onChange={handleChange}
//                           placeholder={t("enterSKU")}
//                           disabled
//                         />
//                         <button  disabled type="button" onClick={generateSKU} className="btn btn-primaryadd">
//                           {t("generate")}
//                         </button>
//                       </div>
//                     </div>
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">{t("brandOrManufacture")}</label>
//                       <Select
//                         options={brandOptions}
//                         value={selectedBrands}
//                         onChange={(selected) => setSelectedBrands(selected)}
//                         isSearchable
//                         placeholder={t("searchOrSelectBrands")}
//                       />
//                     </div>
//                     <div className="col-sm-6 col-12 mb-3">
//                       <div className="d-flex justify-content-between align-items-center">
//                         <label className="form-label">
//                           {t("category")}<span className="text-danger">*</span>
//                         </label>
//                         <a
//                           href="javascript:void(0);"
//                           data-bs-toggle="modal"
//                           data-bs-target="#categoryModal"
//                           onClick={() => {
//                             setCategoryName("");
//                             setCategorySlug("");
//                           }}
//                         >
//                           <i data-feather="plus-circle" className="plus-down-add" />
//                           <span>{t("addNew")}</span>
//                         </a>
//                       </div>
//                       <Select
//                         options={categories}
//                         value={selectedCategory}
//                         onChange={(selected) => {
//                           setSelectedCategory(selected);
//                           setSelectedsubCategory(null);
//                         }}
//                         placeholder={t("searchOrSelectCategory")}
//                       />
//                     </div>
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">
//                         {t("subCategory")}<span className="text-danger">*</span>
//                       </label>
//                       <Select
//                         options={subcategories}
//                         value={selectedsubCategory}
//                         onChange={(selected) => setSelectedsubCategory(selected)}
//                         placeholder={t("searchOrSelectSubcategory")}
//                       />
//                     </div>
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">
//                         {t("supplier")}<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className="form-select"
//                         name="supplier"
//                         value={formData.supplier}
//                         onChange={handleChange}
//                       >
//                         <option value="">{t("select")}</option>
//                         <option value="supplier1">{t("supplier1")}</option>
//                         <option value="supplier2">{t("supplier2")}</option>
//                       </select>
//                     </div>
//                     <div className="col-lg-6 col-sm-6 col-12">
//                       <div className="mb-3 list position-relative">
//                         <label className="form-label">
//                           {t("itemBarcode")}<span className="text-danger ms-1">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           name="itemBarcode"
//                           value={formData.itemBarcode}
//                           readOnly
//                           placeholder={t("itemBarcodePlaceholder")}
//                         />
//                         <button
//                           type="button"
//                           className="btn btn-primaryadd"
//                           onClick={() => setFormData((prev) => ({ ...prev, itemBarcode: generateBarcode() }))}
//                         >
//                           {t("generate")}
//                         </button>
//                       </div>
//                     </div>
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">
//                         {t("store")}<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className="form-select"
//                         name="store"
//                         value={formData.store}
//                         onChange={handleChange}
//                       >
//                         <option value="">{t("select")}</option>
//                         <option value="India Mart">{t("indiaMart")}</option>
//                         <option value="India Gadgets">{t("indiaGadgets")}</option>
//                       </select>
//                     </div>
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">
//                         {t("warehouseOrLocation")}<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className="form-select"
//                         name="warehouse"
//                         value={formData.warehouse}
//                         onChange={handleChange}
//                       >
//                         <option value="">{t("select")}</option>
//                         <option value="Warehouse1">{t("warehouse1")}</option>
//                       </select>
//                     </div>
//                     <div className="d-flex align-items-center mb-4" style={{ gap: "1rem" }}>
//                       <label className="form-label fw-bold mb-0" htmlFor="advanceSwitch">
//                         {t("advance")}
//                       </label>
//                       <div className="form-check form-switch m-0">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           id="advanceSwitch"
//                           checked={formData.isAdvanced}
//                           onChange={(e) => setFormData((prev) => ({ ...prev, isAdvanced: e.target.checked }))}
//                         />
//                       </div>
//                     </div>
//                     {formData.isAdvanced && (
//                       <>
//                         <div className="col-sm-6 col-12 mb-3">
//                           <label className="form-label">{t("leadTime")}</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder={t("enterLeadTime")}
//                             name="leadTime"
//                             value={formData.leadTime}
//                             onChange={handleChange}
//                           />
//                         </div>
//                         <div className="col-sm-6 col-12 mb-3">
//                           <label className="form-label">{t("reorderLevel")}</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder={t("enterReorderLevel")}
//                             name="reorderLevel"
//                             value={formData.reorderLevel}
//                             onChange={handleChange}
//                           />
//                         </div>
//                         <div className="col-sm-6 col-12 mb-3">
//                           <label className="form-label">{t("initialStock")}</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder={t("enterInitialStock")}
//                             name="initialStock"
//                             value={formData.initialStock}
//                             onChange={handleChange}
//                           />
//                         </div>
//                         <div className="col-sm-6 col-12 mb-3">
//                           <label className="form-label fw-bold d-block mb-2">{t("trackName")}</label>
//                           <div className="form-check form-check-inline">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="trackType"
//                               value="serial"
//                               checked={formData.trackType === "serial"}
//                               onChange={handleChange}
//                             />
//                             <label className="form-check-label">{t("serialNo")}</label>
//                           </div>
//                           <div className="form-check form-check-inline">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="trackType"
//                               value="batch"
//                               checked={formData.trackType === "batch"}
//                               onChange={handleChange}
//                             />
//                             <label className="form-check-label">{t("batchNo")}</label>
//                           </div>
//                           <div className="form-check form-check-inline">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="trackType"
//                               value="status"
//                               checked={formData.trackType === "status"}
//                               onChange={handleChange}
//                             />
//                             <label className="form-check-label">{t("status")}</label>
//                           </div>
//                         </div>
//                         {formData.trackType === "serial" && (
//                           <div className="col-sm-6 col-12 mb-3">
//                             <label className="form-label">{t("serialNo")}</label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               placeholder={t("enterSerialNumber")}
//                               name="serialNumber"
//                               value={formData.serialNumber}
//                               onChange={handleChange}
//                             />
//                           </div>
//                         )}
//                         {formData.trackType === "batch" && (
//                           <div className="col-sm-6 col-12 mb-3">
//                             <label className="form-label">{t("batchNo")}</label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               placeholder={t("enterBatchNumber")}
//                               name="batchNumber"
//                               value={formData.batchNumber}
//                               onChange={handleChange}
//                             />
//                           </div>
//                         )}
//                         {formData.trackType === "status" && (
//                           <div className="form-check mb-3">
//                             <input
//                               className="form-check-input"
//                               type="checkbox"
//                               id="returnable"
//                               checked={formData.isReturnable}
//                               onChange={(e) => setFormData((prev) => ({ ...prev, isReturnable: e.target.checked }))}
//                             />
//                             <label className="form-check-label" htmlFor="returnable">
//                               {t("returnable")}
//                             </label>
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 ) : (
//                   <>
//                     <div className="mb-3">
//                       <label className="form-label">{t("expireDate")}</label>
//                       <input
//                         type="date"
//                         className="form-control"
//                         name="expirationDate"
//                         value={formData.expirationDate}
//                         onChange={handleChange}
//                         placeholder={t("enterExpireDate")}
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <label className="form-label">{t("brand")}</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="brand"
//                         value={formData.brand}
//                         onChange={handleChange}
//                         placeholder={t("enterBrand")}
//                       />
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}
//             {/* Step 1 - Pricing */}
//             {step === 1 && (
//               <div className="row">
//                 {[
//                   { label: t("purchasePrice"), name: "purchasePrice" },
//                   { label: t("sellingPrice"), name: "sellingPrice" },
//                   { label: t("wholesalePrice"), name: "wholesalePrice" },
//                   { label: t("retailPrice"), name: "retailPrice" },
//                 ].map((field, idx) => (
//                   <div key={idx} className="col-sm-6 col-12 mb-3">
//                     <label className="form-label">
//                       {field.label}
//                       <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name={field.name}
//                       value={formData[field.name] || ""}
//                       onChange={handleChange}
//                       placeholder={t(`enter${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`)}
//                     />
//                   </div>
//                 ))}
//                 <div className="col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("quantity")}<span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="quantity"
//                     value={formData.quantity}
//                     onChange={handleChange}
//                     placeholder={t("enterQuantity")}
//                   />
//                 </div>
//                 <div className="col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("unit")}<span className="text-danger">*</span>
//                   </label>
//                   <Select
//                     options={unitsOptions}
//                     value={selectedUnits}
//                     onChange={(selected) => setSelectedUnits(selected)}
//                     isSearchable
//                     placeholder={t("searchOrSelectUnits")}
//                   />
//                 </div>
//                 <div className="col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("taxType")}<span className="text-danger">*</span>
//                   </label>
//                   <select
//                     className="form-select"
//                     name="taxType"
//                     value={formData.taxType}
//                     onChange={handleChange}
//                   >
//                     <option value="">{t("select")}</option>
//                     <option>{t("exclusive")}</option>
//                     <option>{t("inclusive")}</option>
//                   </select>
//                 </div>
//                 <div className="col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("taxRate")}<span className="text-danger">*</span>
//                   </label>
//                   <select
//                     className="form-select"
//                     name="tax"
//                     value={formData.tax}
//                     onChange={handleChange}
//                   >
//                     <option value="">{t("select")}</option>
//                     <option>{t("igst8")}</option>
//                     <option>{t("gst5")}</option>
//                     <option>{t("sgst4")}</option>
//                     <option>{t("cgst16")}</option>
//                     <option>{t("gst18")}</option>
//                   </select>
//                 </div>
//                 <div className="col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("discountType")}<span className="text-danger">*</span>
//                   </label>
//                   <select
//                     className="form-select"
//                     name="discountType"
//                     value={formData.discountType}
//                     onChange={handleChange}
//                   >
//                     <option value="">{t("select")}</option>
//                     <option>{t("percentage")}</option>
//                     <option>{t("fixed")}</option>
//                   </select>
//                 </div>
//                 <div className="col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("discountValue")}<span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="discountValue"
//                     value={formData.discountValue}
//                     onChange={handleChange}
//                     placeholder={t("enterDiscountValue")}
//                   />
//                 </div>
//                 <div className="col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("quantityAlert")}<span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="quantityAlert"
//                     value={formData.quantityAlert}
//                     onChange={handleChange}
//                     placeholder={t("enterQuantityAlert")}
//                   />
//                 </div>
//               </div>
//             )}
//             {/* Step 2 - Images and SEO */}
//             {step === 2 && (
//               <>
//                 <div
//                   {...getRootProps({
//                     className: "dropzone p-4 text-center image-upload image-upload-two mb-3",
//                   })}
//                 >
//                   <input {...getInputProps()} />
//                   <MdImageSearch style={{ fontSize: "50px" }} />
//                   <p>{t("dragImageHere")}</p>
//                   <p>{t("supportsImageTypes")}</p>
//                 </div>
//                 <div className="row mt-3">
//                   {images.map((file, i) => (
//                     <div className="col-3 mb-3" key={i}>
//                       <img
//                         src={file.preview}
//                         className="img-thumbnail"
//                         style={{ height: 120, objectFit: "cover" }}
//                       />
//                     </div>
//                   ))}
//                 </div>
//                 <div className="col-lg-12 mb-3">
//                   <label>{t("description")}</label>
//                   <textarea
//                     name="description"
//                     className="form-control"
//                     maxLength={300}
//                     value={formData.description}
//                     onChange={handleChange}
//                     placeholder={t("enterDescription")}
//                   />
//                 </div>
//                 <div className="row">
//                   <div className="col-sm-6 col-12 mb-3">
//                     <label className="form-label">{t("seoMetaTitle")}</label>
//                     <input
//                       type="text"
//                       name="seoTitle"
//                       className="form-control"
//                       value={formData.seoTitle || ""}
//                       onChange={handleChange}
//                       placeholder={t("enterSeoMetaTitle")}
//                     />
//                   </div>
//                   <div className="col-sm-6 col-12 mb-3">
//                     <label className="form-label">{t("seoMetaDescription")}</label>
//                     <input
//                       type="text"
//                       name="seoDescription"
//                       className="form-control"
//                       value={formData.seoDescription || ""}
//                       onChange={handleChange}
//                       placeholder={t("enterSeoMetaDescription")}
//                     />
//                   </div>
//                 </div>
//               </>
//             )}
//             {/* Step 3 - Variants */}
//             {step === 3 && (
//               <>
//                 <div className="variant-tabs mb-3 d-flex flex-wrap gap-2">
//                   {variantTabs.map((tab) => (
//                     <button
//                       type="button"
//                       key={tab}
//                       className={`variant-tab btn btn-sm ${activeTab === tab ? "btn-success" : "btn-outline-secondary"}`}
//                       onClick={() => setActiveTab(tab)}
//                     >
//                       {tab}
//                     </button>
//                   ))}
//                 </div>
//                 <div className="mb-3">
//                   <label>{t("enterVariants", { tab: activeTab })}</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={formData.variants[activeTab]?.join(", ") || ""}
//                     onChange={(e) => inputChange(activeTab, e.target.value)}
//                     placeholder={t("enterVariantsPlaceholder", { tab: activeTab })}
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//           <div className="mt-4 d-flex justify-content-between">
//             <button type="button" className="btn btn-outline-primary" onClick={handlePrev} disabled={step === 0}>
//               {t("previous")}
//             </button>
//             <div>
//               <button type="button" className="btn btn-outline-secondary me-2" onClick={handleSaveDraft}>
//                 {t("saveAsDraft")}
//               </button>
//               {step < steps.length - 1 ? (
//                 <button type="button" className="btn btn-primary" onClick={handleNext}>
//                   {t("next")}
//                 </button>
//               ) : (
//                 <button type="submit" className="btn btn-success">
//                   {t("updateProduct")}
//                 </button>
//               )}
//             </div>
//           </div>
//         </form>
//         <CategoryModal
//           modalId="categoryModal"
//           title={t("addCategory")}
//           categoryName={categoryName}
//           categorySlug={categorySlug}
//           onCategoryChange={(e) => setCategoryName(e.target.value)}
//           onSlugChange={(e) => setCategorySlug(e.target.value)}
//           onSubmit={categorySubmit}
//           submitLabel={t("addCategory")}
//         />
//       </div>
//     </div>
//   );
// };

// export default EditProduct;

import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import BASE_URL from "../../../../pages/config/config";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { TbChevronUp, TbEye, TbRefresh } from "react-icons/tb";
import Select from "react-select";
import { MdImageSearch } from "react-icons/md";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Declare steps and variantTabs before useState calls
  const steps = [
    t("descriptionAndMedia"),
    t("pricing"),
    t("images"),
    t("variants"),
  ];
  const variantTabs = [
    t("color"),
    t("size"),
    t("expiry"),
    t("material"),
    t("model"),
    t("weight"),
    t("skinType"),
    t("packagingType"),
    t("flavour"),
  ];
  // Now safe to use steps in useState
  const [step, setStep] = useState(0);
  const [stepStatus, setStepStatus] = useState(
    Array(steps.length).fill("pending")
  );
  const [activeTab, setActiveTab] = useState("Color");
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    brand: "",
    category: "",
    subCategory: "",
    supplier: "",
    itemBarcode: "",
    store: "",
    warehouse: "",
    purchasePrice: "",
    sellingPrice: "",
    wholesalePrice: "",
    retailPrice: "",
    quantity: "",
    unit: "",
    taxType: "",
    tax: "",
    discountType: "",
    discountValue: "",
    quantityAlert: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    variants: {},
    sellingType: "",
    barcodeSymbology: "",
    productType: "Single",
    itemType: "Good",
    isAdvanced: false,
    trackType: "serial",
    isReturnable: false,
    leadTime: "",
    reorderLevel: "",
    initialStock: "",
    serialNumber: "",
    batchNumber: "",
    returnable: false,
    expirationDate: "",
    hsn: "",
  });
  const [loading, setLoading] = useState(true);
  // Dropdown states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedsubCategory, setSelectedsubCategory] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState(null);
  const [selectedUnits, setSelectedUnits] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [unitsOptions, setUnitsOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [optionsware, setOptionsWare] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [optionsHsn, setOptionsHsn] = useState([]);
  const [selectedHSN, setSelectedHSN] = useState(null);
  const [showHSNModal, setShowHSNModal] = useState(false);
  const [brandId, setBrandId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [supplierId, setSupplierId] = useState(null);
  const [warehouseId, setWarehouseId] = useState(null);

  // Image state
  const [images, setImages] = useState([]);

  // Add useDropzone for image upload
  const onDrop = (acceptedFiles) => {
    const mapped = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setImages((prev) => [...prev, ...mapped]);
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products/${id}`);
        const data = res.data;
        setFormData({ ...formData, ...data });
        // if (data.brand)  setSelectedBrands({ value: data.brand._id || data.brand, label: data.brand.brandName || data.brand });
        if (data.brand) {
          setBrandId(data.brand._id || data.brand);
        }
        
        if (data.subcategory) {
  setSubCategoryId(data.subcategory._id || data.subcategory);
}
        if (data.category) {
          setCategoryId(data.category._id || data.category);
        }

        if (data.unit) setSelectedUnits({ value: data.unit, label: data.unit });
        // if (data.supplier) setSelectedSupplier({ value: data.supplier._id || data.supplier, label: data.supplier.firstName ? `${data.supplier.firstName}${data.supplier.lastName} (${data.supplier.supplierCode})` : data.supplier });
        if (data.supplier) {
          setSupplierId(data.supplier._id || data.supplier);
        }

        // if (data.warehouse) setSelectedWarehouse({ value: data.warehouse._id || data.warehouse, label: data.warehouse.warehouseName || data.warehouse });
        if (data.warehouse) {
          setWarehouseId(data.warehouse._id || data.warehouse);
        }
        if (data.hsn) {
          const hsnOption = optionsHsn.find(
            (opt) => opt.value === (data.hsn._id || data.hsn)
          );
          if (hsnOption) setSelectedHSN(hsnOption);
        }

        if (data.images && data.images.length > 0) {
          const existingImages = data.images.map((img) => ({
            preview: img.url, // Dropzone expects `preview`
            url: img.url, // Keep original URL if you need
            public_id: img.public_id,
          }));
          setImages(existingImages);
        }

        // if (data.hsnCode) setSelectedHSN({ value: data.hsnCode._id || data.hsnCode, label: data.hsnCode.hsnCode ? `${data.hsnCode.hsnCode} - ${data.hsnCode.description || ''}` : data.hsnCode });
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch product");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch dropdown options (categories, brands, units, suppliers, warehouses, HSN)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/category/categories`);
        const options = res.data.map((category) => ({
          value: category._id,
          label: category.categoryName,
        }));
        setCategories(options);
      } catch (error) { }
    };
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/brands/active-brands`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const options = res.data.brands.map((brand) => ({
          value: brand._id,
          label: brand.brandName,
        }));
        setBrandOptions(options);
      } catch (error) { }
    };
    const fetchUnits = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/unit/units/status/active`);
        const options = res.data.units.map((unit) => ({
          value: unit.shortName,
          label: `${unit.unitsName} (${unit.shortName})`,
        }));
        setUnitsOptions(options);
      } catch (error) { }
    };
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/suppliers/active`);
        const options = res.data.suppliers.map((supplier) => ({
          value: supplier._id,
          label: `${supplier.firstName}${supplier.lastName} (${supplier.supplierCode})`,
        }));
        setOptions(options);
      } catch (error) { }
    };
    const fetchWarehouses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/warehouse/active`);
        if (res.data.success) {
          const options = res.data.data.map((wh) => ({
            value: wh._id,
            label: wh.warehouseName,
          }));
          setOptionsWare(options);
        }
      } catch (error) { }
    };
    const fetchHSN = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/hsn/all`);
        console.log("hsnd", res.data.data);
        if (res.data.success) {
          const options = res.data.data.map((item) => ({
            value: item._id,
            label: `${item.hsnCode} - ${item.description || ""}`,
          }));
          setOptionsHsn(options);
        }
      } catch (error) { }
    };

    fetchCategories();
    fetchBrands();
    fetchUnits();
    fetchSuppliers();
    fetchWarehouses();
    fetchHSN();
  }, []);

  useEffect(() => {
    if (brandOptions.length > 0 && brandId) {
      const found = brandOptions.find((opt) => opt.value === brandId);
      if (found) {
        setSelectedBrands(found);
      }
    }
  }, [brandOptions, brandId]);

  // category
  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const foundCat = categories.find((opt) => opt.value === categoryId);
      if (foundCat) {
        setSelectedCategory(foundCat);
        console.log("⚡ Fetching subcategories for:", foundCat.value);
        // Fetch subcategories for this category
        fetchSubcategoriesByCategory(foundCat.value);
      }
    }
  }, [categoryId, categories]);


  // Subcategory fetch logic
  const fetchSubcategoriesByCategory = async (categoryId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/subcategory/by-category/${categoryId}`
      );
      console.log("sbcategryfd", res.data);
      const options = res.data.map((subcat) => ({
        value: subcat._id,
        label: subcat.subCategoryName,
      }));
      setSubcategories(options);
    } catch (error) {
      setSubcategories([]);
    }
  };

  // ✅ Effect: once subcategories + subCategoryId are both ready → preselect
  useEffect(() => {
    if (subCategoryId && subcategories.length > 0) {
      const found = subcategories.find((opt) => opt.value === subCategoryId);
      if (found) {
        setSelectedsubCategory(found);
        console.log("✅ Preselected subcategory:", found);
      }
    }
  }, [subCategoryId, subcategories]);

  //supplier
  useEffect(() => {
    if (supplierId && options.length > 0) {
      const found = options.find((opt) => opt.value === supplierId);
      if (found) {
        setSelectedSupplier(found);
      }
    }
  }, [supplierId, options]);

  useEffect(() => {
    if (warehouseId && optionsware.length > 0) {
      const found = optionsware.find((opt) => opt.value === warehouseId);
      if (found) setSelectedWarehouse(found);
    }
  }, [warehouseId, optionsware]);

  useEffect(() => {
    if (optionsHsn.length > 0 && formData.hsn) {
      const hsnValue =
        typeof formData.hsn === "object" ? formData.hsn._id : formData.hsn;
      const found = optionsHsn.find((opt) => opt.value === hsnValue);
      if (found) setSelectedHSN(found);
    }
  }, [optionsHsn, formData.hsn]);

  // Handlers for dropdowns
  const handleBrandChange = (selectedOption) =>
    setSelectedBrands(selectedOption);
  const handleUnitChange = (selectedOption) => setSelectedUnits(selectedOption);
  const handleSupplierChange = (selectedOption) =>
    setSelectedSupplier(selectedOption);
  const handleWarehouseChange = (selectedOption) =>
    setSelectedWarehouse(selectedOption);
  const handleHSNChange = (selectedOption) => setSelectedHSN(selectedOption);
  const subCategoryChange = (selectedOption) =>
    setSelectedsubCategory(selectedOption);

  // Generic input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Variant input change (for step 3)
  const inputChange = (key, value) => {
    if (step === 3) {
      const parsedValues = value.split(",").map((v) => v.trim());
      setFormData((prev) => ({
        ...prev,
        variants: { ...prev.variants, [key]: parsedValues },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Step validation logic
  const validateStep = () => {
    // if (step === 0) {
    //     return formData.productName;
    // }
    // if (step === 1) {
    //     return formData.purchasePrice;
    // }
    // if (step === 2) {
    //     return formData.description;
    // }
    // if (step === 3) {
    //     return formData.variants[activeTab]?.length > 0;
    // }
    return true;
  };

  // Step navigation logic
  const handleNext = () => {
    const isValid = validateStep();
    const updatedStatus = [...stepStatus];
    updatedStatus[step] = isValid ? "complete" : "incomplete";
    setStepStatus(updatedStatus);
    if (isValid && step < steps.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleSaveDraft = () => {
    toast.info("Saved as draft!");
  };

  // SKU generator
  const generateSKU = () => {
    const category = formData.category || "GEN";
    const name = formData.productName || "PRD";
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const sku = `${category.toUpperCase().slice(0, 3)}-${name
      .toUpperCase()
      .slice(0, 3)}-${randomNum}`;
    setFormData((prevProduct) => ({
      ...prevProduct,
      sku,
    }));
  };

  // Barcode generator
  const generateBarcode = () => {
    const prefix = "BR";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    console.log("SUBMIT: selectedBrands", selectedBrands);
    console.log("SUBMIT: selectedCategory", selectedCategory);
    console.log("SUBMIT: selectedsubCategory", selectedsubCategory);
    console.log("SUBMIT: selectedSupplier", selectedSupplier);
    console.log("SUBMIT: selectedWarehouse", selectedWarehouse);
    console.log("SUBMIT: selectedUnits", selectedUnits);
    console.log("SUBMIT: selectedHSN", selectedHSN);
    console.log(
      "SUBMIT: subcategory value sent:",
      selectedsubCategory?.value || ""
    );
    e.preventDefault();
    const formPayload = new FormData();
    // Only append fields that have changed (non-empty or non-null)
    if (formData.productName)
      formPayload.append("productName", formData.productName);
    if (formData.sku) formPayload.append("sku", formData.sku);
    formPayload.append("brand", selectedBrands?.value || "");
    formPayload.append("category", selectedCategory?.value || "");
    formPayload.append("subcategory", selectedsubCategory?.value || "");
    formPayload.append("supplier", selectedSupplier?.value || "");
    if (formData.itemBarcode)
      formPayload.append("itemBarcode", formData.itemBarcode);
    if (formData.store) formPayload.append("store", formData.store);
    formPayload.append("warehouse", selectedWarehouse?.value || "");
    if (formData.purchasePrice)
      formPayload.append("purchasePrice", formData.purchasePrice);
    if (formData.sellingPrice)
      formPayload.append("sellingPrice", formData.sellingPrice);
    if (formData.wholesalePrice)
      formPayload.append("wholesalePrice", formData.wholesalePrice);
    if (formData.retailPrice)
      formPayload.append("retailPrice", formData.retailPrice);
    if (formData.quantity) formPayload.append("quantity", formData.quantity);
    formPayload.append("unit", selectedUnits?.value || "");
    if (formData.taxType) formPayload.append("taxType", formData.taxType);
    if (formData.tax)
      formPayload.append(
        "tax",
        parseFloat(formData.tax.replace(/\D/g, "")) || 0
      );
    if (formData.discountType)
      formPayload.append("discountType", formData.discountType);
    if (formData.discountValue)
      formPayload.append("discountValue", formData.discountValue);
    if (formData.quantityAlert)
      formPayload.append("quantityAlert", formData.quantityAlert);
    if (formData.description)
      formPayload.append("description", formData.description);
    if (formData.seoTitle) formPayload.append("seoTitle", formData.seoTitle);
    if (formData.seoDescription)
      formPayload.append("seoDescription", formData.seoDescription);
    if (formData.itemType) formPayload.append("itemType", formData.itemType);
    if (formData.isAdvanced)
      formPayload.append("isAdvanced", formData.isAdvanced ? true : false);
    if (formData.trackType) formPayload.append("trackType", formData.trackType);
    if (formData.isReturnable)
      formPayload.append("isReturnable", formData.isReturnable ? true : false);
    if (formData.leadTime) formPayload.append("leadTime", formData.leadTime);
    if (formData.reorderLevel)
      formPayload.append("reorderLevel", formData.reorderLevel);
    if (formData.initialStock)
      formPayload.append("initialStock", formData.initialStock);
    if (formData.serialNumber)
      formPayload.append("serialNumber", formData.serialNumber);
    if (formData.batchNumber)
      formPayload.append("batchNumber", formData.batchNumber);
    if (formData.returnable)
      formPayload.append("returnable", formData.returnable ? true : false);
    if (formData.expirationDate)
      formPayload.append("expirationDate", formData.expirationDate);
    formPayload.append("hsn", selectedHSN?.value || "");
    if (formData.variants && Object.keys(formData.variants).length > 0)
      formPayload.append("variants", JSON.stringify(formData.variants));
    // append new images only
    images.forEach((imgFile) => {
      if (imgFile instanceof File) {
        // only new uploads
        formPayload.append("images", imgFile);
      }
    });

    // append existing images as URLs
    const existingImageUrls = images
      .filter((img) => !(img instanceof File))
      .map((img) => img.url); // only URL

    formPayload.append("existingImages", JSON.stringify(existingImageUrls));
    try {
      await axios.put(`${BASE_URL}/api/products/${id}`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully!");
      navigate("/product");
    } catch (err) {
      console.log(err.response?.data);
      toast.error("Failed to update product");
    }
  };

  if (loading) return <p>Loading...</p>;

  // remove image
  const handleRemoveImage = async (file) => {
    if (file.public_id) {
      try {
        const res = await axios.delete(
          `${BASE_URL}/api/products/${productId}/images`,
          {
            data: { public_id: file.public_id },
          }
        );
        setImages(res.data.images);
      } catch (error) {
        console.error("Failed to delete image", error);
      }
    } else {
      setImages((prev) => prev.filter((f) => f !== file));
    }
  };

  return (
    <div className="page-wrapper mt-4">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">{t("Edit Product")}</h4>
              <h6>{t("createNewProduct")}</h6>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li>
              <button
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Refresh"
                className="icon-btn"
              >
                <TbRefresh />
              </button>
            </li>
            <li>
              <button
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Collapse"
                id="collapse-header"
                className="icon-btn"
              >
                <TbChevronUp />
              </button>
            </li>
          </div>

          <div className="page-btn mt-0">
            <button className="btn btn-secondary">
              <Link to="back"></Link>
              {t("backToProduct")}
            </button>
          </div>
        </div>
        {/* <h5 className="mb-3">{steps[step]}</h5> */}

        <div className="progress-wrapper d-flex justify-content-between align-items-center mb-4 position-relative">
          {steps.map((label, index) => {
            const status = stepStatus[index];
            const isActive = index === step;
            const isComplete = status === "complete";
            const isIncomplete = status === "incomplete";

            return (
              <div key={index} className="step-wrapper">
                <div
                  className={`circle ${isComplete
                    ? "complete"
                    : isIncomplete
                      ? "incomplete"
                      : isActive
                        ? "active"
                        : ""
                    }`}
                >
                  {index + 1}
                </div>
                <div className="step-text">{label}</div>
                {index < steps.length - 1 && (
                  <div
                    className={`progress-line ${status === "complete"
                      ? "line-complete"
                      : status === "incomplete"
                        ? "line-incomplete"
                        : "line-pending"
                      }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-3 accordion-item border mb-4">
            {/* Step 0 - Basic Info */}
            {step === 0 && (
              <div className="accordion-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Item Type</label>
                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="itemType"
                        value="Good"
                        checked={formData.itemType === "Good"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            itemType: e.target.value,
                          }))
                        }
                      />
                      <label className="form-check-label">Good</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="itemType"
                        value="Service"
                        checked={formData.itemType === "Service"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            itemType: e.target.value,
                          }))
                        }
                      />
                      <label className="form-check-label">Service</label>
                    </div>
                  </div>
                </div>
                {/* Conditional Fields */}
                {formData.itemType === "Good" ? (
                  <div className="row">
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("productName")}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="productName"
                        className="form-control"
                        value={formData.productName}
                        onChange={handleChange}
                        placeholder={t("enterProductName")}
                      />
                    </div>

                    {/* HSNCODE */}

                    <div className="col-sm-6 col-12 mb-3 d-flex align-items-end gap-2">
                      <div style={{ flex: 3, maxWidth: "100%", minWidth: 0 }}>
                        <label className="form-label">
                          {t("HSN")}
                          <span className="text-danger">*</span>
                        </label>
                        <div style={{ position: "relative", width: "100%" }}>
                          <Select
                            options={optionsHsn}
                            isLoading={loading}
                            value={selectedHSN}
                            isSearchable
                            placeholder="Select HSN..."
                            onChange={handleHSNChange}
                            styles={{
                              control: (base) => ({
                                ...base,
                                maxWidth: "100%",
                                minWidth: 0,
                                overflow: "hidden",
                              }),
                              singleValue: (base) => ({
                                ...base,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "100%",
                              }),
                            }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-info btn-sm d-flex align-items-center gap-1"
                        onClick={() => setShowHSNModal(true)}
                        disabled={!selectedHSN}
                        style={{ height: "38px" }}
                      >
                        <TbEye size={18} />
                        {/* View */}
                      </button>
                    </div>

                    {/* HSN View Modal */}
                    {showHSNModal && selectedHSN && (
                      <div
                        className="modal fade show"
                        style={{
                          display: "block",
                          background: "rgba(0,0,0,0.3)",
                        }}
                        tabIndex="-1"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div
                            className="modal-content"
                            style={{
                              borderRadius: "12px",
                              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                            }}
                          >
                            <div
                              className="modal-header bg-info text-white"
                              style={{
                                borderTopLeftRadius: "12px",
                                borderTopRightRadius: "12px",
                              }}
                            >
                              <h5 className="modal-title">HSN Details</h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowHSNModal(false)}
                              ></button>
                            </div>
                            <div className="modal-body">
                              <div className="mb-3">
                                <label className="fw-bold">HSN Code:</label>
                                <div className="fs-5 text-primary">
                                  {selectedHSN.label.split(" - ")[0]}
                                </div>
                              </div>
                              <div className="mb-3">
                                <label className="fw-bold">Description:</label>
                                <div className="fs-6 text-secondary">
                                  {selectedHSN.label.split(" - ")[1] || "N/A"}
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowHSNModal(false)}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="col-sm-6 col-12">
                      <div className="mb-3 list position-relative">
                        <label className="form-label">
                          {t("sku")}
                          <span className="text-danger ms-1">*</span>
                        </label>
                        <input
                          type="text"
                          name="sku"
                          className="form-control"
                          value={formData.sku}
                          onChange={(e) =>
                            setFormData({ ...formData, sku: e.target.value })
                          }
                          placeholder={t("enterSKU")}
                        />
                        <button
                          type="submit"
                          onClick={generateSKU}
                          className="btn btn-primaryadd"
                        >
                          {t("generate")}
                        </button>
                      </div>
                    </div>

                    {/* Brand */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("brandOrManufacture")}
                      </label>
                      <Select
                        options={brandOptions}
                        value={selectedBrands}
                        onChange={handleBrandChange}
                        isSearchable
                        placeholder={t("searchOrSelectBrands")}
                      />
                    </div>

                    {/* Category */}
                    <div className="col-sm-6 col-12 mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label">
                          {t("category")}
                          <span className="text-danger">*</span>
                        </label>
                        <a
                          href="javascript:void(0);"
                          data-bs-toggle="modal"
                          data-bs-target="#add-category"
                          onClick={() => {
                            setCategoryName("");
                            setCategorySlug("");
                          }}
                        >
                          <i
                            data-feather="plus-circle"
                            className="plus-down-add"
                          />
                          <span>{t("addNew")}</span>
                        </a>
                      </div>
                      <Select
                        options={categories}
                        value={selectedCategory}
                        onChange={(selected) => {
                          setSelectedCategory(selected);
                          setSelectedSubcategory(null);
                        }}
                        placeholder={t("searchOrSelectCategory")}
                      />
                    </div>

                    {/* Subcategory */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("subCategory")}
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={subcategories}
                        value={selectedsubCategory}
                        onChange={subCategoryChange}
                        placeholder={t("searchOrSelectSubcategory")}
                      />
                    </div>

                    {/* Supplier */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("supplier")}
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={options}
                        value={selectedSupplier}
                        onChange={handleSupplierChange}
                        placeholder="Choose a supplier..."
                        isClearable
                      />
                    </div>

                    <div className="col-lg-6 col-sm-6 col-12">
                      <div className="mb-3 list position-relative">
                        <label className="form-label">
                          {t("itemBarcode")}
                          <span className="text-danger ms-1">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="itemBarcode"
                          value={formData.itemBarcode}
                          readOnly
                          placeholder={t("itemBarcodePlaceholder")}
                        />
                        <button
                          type="button"
                          className="btn btn-primaryadd"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              itemBarcode: generateBarcode(),
                            }))
                          }
                        >
                          {t("generate")}
                        </button>
                      </div>
                    </div>

                    {/* Store */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("store")}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="store"
                        value={formData.store}
                        onChange={handleChange}
                      >
                        <option value="">{t("select")}</option>
                        <option value="India Mart">{t("indiaMart")}</option>
                        <option value="India Gadgets">
                          {t("indiaGadgets")}
                        </option>
                      </select>
                    </div>

                    {/* Warehouse */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("warehouseOrLocation")}
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={optionsware}
                        value={selectedWarehouse}
                        isLoading={loading}
                        isSearchable
                        placeholder="Select Warehouse..."
                        onChange={handleWarehouseChange}
                      />
                    </div>
                    {/* Advance Toggle */}
                    <div
                      className="d-flex align-items-center mb-4"
                      style={{ gap: "1rem" }}
                    >
                      <label
                        className="form-label fw-bold mb-0"
                        htmlFor="advanceSwitch"
                      >
                        {t("advance")}
                      </label>
                      <div className="form-check form-switch m-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="advanceSwitch"
                          // checked={isAdvanced}
                          // onChange={() => setIsAdvanced(!isAdvanced)}
                          checked={formData.isAdvanced}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              isAdvanced: e.target.checked,
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Advanced Section */}
                    {formData.isAdvanced && (
                      <>
                        <div className="col-sm-6 col-12 mb-3">
                          <label className="form-label">{t("leadTime")}</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={t("enterLeadTime")}
                            name="leadTime"
                            value={formData.leadTime}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-sm-6 col-12 mb-3">
                          <label className="form-label">
                            {t("reorderLevel")}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={t("enterReorderLevel")}
                            name="reorderLevel"
                            value={formData.reorderLevel}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-sm-6 col-12 mb-3">
                          <label className="form-label">
                            {t("initialStock")}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={t("enterInitialStock")}
                            name="initialStock"
                            value={formData.initialStock}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Track Name */}
                        <div className="col-sm-6 col-12 mb-3">
                          <label className="form-label fw-bold d-block mb-2">
                            Track Name
                          </label>

                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="track"
                              value="serial"
                              // checked={trackType === "serial"}
                              // onChange={() => setTrackType("serial")}
                              id="serial"
                              checked={formData.trackType === "serial"}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  trackType: e.target.value,
                                }))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="serial"
                            >
                              Serial No
                            </label>
                          </div>

                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="track"
                              value="batch"
                              // checked={trackType === "batch"}
                              // onChange={() => setTrackType("batch")}
                              id="batch"
                              checked={formData.trackType === "batch"}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  trackType: e.target.value,
                                }))
                              }
                            />
                            <label className="form-check-label" htmlFor="batch">
                              Batch No
                            </label>
                          </div>

                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="track"
                              value="status"
                              // checked={trackType === "status"}
                              // onChange={() => setTrackType("status")}
                              id="status"
                              checked={formData.trackType === "status"}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  trackType: e.target.value,
                                }))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="status"
                            >
                              Status
                            </label>
                          </div>
                        </div>

                        {/* Serial No Input */}
                        {formData.trackType === "serial" && (
                          <div className="col-sm-6 col-12 mb-3">
                            <label className="form-label">
                              {t("serialNo")}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("enterSerialNumber")}
                              name="serialNumber"
                              value={formData.serialNumber}
                              onChange={handleChange}
                            />
                          </div>
                        )}

                        {/* Batch No Input */}
                        {formData.trackType === "batch" && (
                          <div className="col-sm-6 col-12 mb-3">
                            <label className="form-label">{t("batchNo")}</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("enterBatchNumber")}
                              name="batchNumber"
                              value={formData.batchNumber}
                              onChange={handleChange}
                            />
                          </div>
                        )}

                        {/* Returnable checkbox */}
                        {formData.trackType === "status" && (
                          <div className="form-check mb-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="returnable"
                              checked={formData.isReturnable}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  isReturnable: e.target.checked,
                                }))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="returnable"
                            >
                              {t("returnable")}
                            </label>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium">
                        {t("expireDate")}
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded"
                        placeholder={t("enterExpireDate")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        {t("brand")}
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder={t("enterBrand")}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 1 - Pricing */}
            {step === 1 && (
              <div className="row">
                {[
                  { label: t("purchasePrice"), name: "purchasePrice" },
                  { label: t("sellingPrice"), name: "sellingPrice" },
                  { label: t("wholesalePrice"), name: "wholesalePrice" },
                  { label: t("retailPrice"), name: "retailPrice" },
                ].map((field, idx) => (
                  <div key={idx} className=" col-sm-6 col-12 mb-3">
                    <label className="form-label">
                      {field.label}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={t(
                        `enter${field.name.charAt(0).toUpperCase() +
                        field.name.slice(1)
                        }`
                      )}
                    />
                  </div>
                ))}

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("quantity")}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder={t("enterQuantity")}
                  />
                </div>
                <div className="col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("unit")}
                    <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={unitsOptions}
                    value={selectedUnits}
                    onChange={handleUnitChange}
                    isSearchable
                    placeholder={t("searchOrSelectUnits")}
                  />
                </div>

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("taxType")}
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="taxType"
                    value={formData.taxType}
                    onChange={handleChange}
                  >
                    <option value="">{t("select")}</option>
                    <option>{t("exclusive")}</option>
                    <option>{t("inclusive")}</option>
                  </select>
                </div>

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("taxRate")}
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="tax"
                    value={formData.tax}
                    onChange={handleChange}
                  >
                    <option value="">{t("select")}</option>
                    <option>{t("igst8")}</option>
                    <option>{t("gst5")}</option>
                    <option>{t("sgst4")}</option>
                    <option>{t("cgst16")}</option>
                    <option>{t("gst18")}</option>
                  </select>
                </div>

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("discountType")}
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                  >
                    <option value="">{t("select")}</option>
                    <option>{t("percentage")}</option>
                    <option>{t("fixed")}</option>
                  </select>
                </div>

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("discountValue")}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder={t("enterDiscountValue")}
                  />
                </div>

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("quantityAlert")}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="quantityAlert"
                    value={formData.quantityAlert}
                    onChange={handleChange}
                    placeholder={t("enterQuantityAlert")}
                  />
                </div>
              </div>
            )}

            {/* Step 2 - Images and SEO */}
            {step === 2 && (
              <>
                <div
                  {...getRootProps({
                    className:
                      "dropzone p-4 text-center image-upload image-upload-two mb-3",
                  })}
                >
                  <input {...getInputProps()} />
                  <MdImageSearch style={{ fontSize: "50px" }} />
                  <p>Drag your image here, or browse</p>
                  <p>Supports JPEG, PNG, JPG</p>
                </div>

                <div className="row mt-3">
                  {images.map((file, i) => (
                    <div className="col-3 mb-3" key={i}>
                      <img
                        src={file.url || file.preview}
                        className="img-thumbnail"
                        style={{ height: 120, objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="position-absolute"
                        style={{
                          cursor: "pointer",
                          marginLeft: "-20px",
                          border: "none",
                          borderRadius: "50%",
                          backgroundColor: "red",
                          color: "white",
                        }}
                        onClick={() => handleRemoveImage(file)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                <div className="col-lg-12 mb-3">
                  <label>{t("description")}</label>
                  <textarea
                    name="description"
                    className="form-control"
                    maxLength={300}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t("enterDescription")}
                  />
                </div>

                <div className="row">
                  <div className="col-sm-6 col-12 mb-3">
                    <label className="form-label">{t("seoMetaTitle")}</label>
                    <input
                      type="text"
                      name="seoTitle"
                      className="form-control"
                      value={formData.seoTitle || ""}
                      onChange={handleChange}
                      placeholder={t("enterSeoMetaTitle")}
                    />
                  </div>
                  <div className="col-sm-6 col-12 mb-3">
                    <label className="form-label">
                      {t("seoMetaDescription")}
                    </label>
                    <input
                      type="text"
                      name="seoDescription"
                      className="form-control"
                      value={formData.seoDescription || ""}
                      onChange={handleChange}
                      placeholder={t("enterSeoMetaDescription")}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3 - Variants */}
            {step === 3 && (
              <>
                <div className="variant-tabs mb-3 d-flex flex-wrap gap-2">
                  {variantTabs.map((tab) => (
                    <button
                      type="button"
                      key={tab}
                      className={`variant-tab btn btn-sm ${activeTab === tab
                        ? "btn-success"
                        : "btn-outline-secondary"
                        }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="mb-3">
                  <label>{t("enterVariants", { tab: activeTab })}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.variants[activeTab]?.join(", ") || ""}
                    onChange={(e) => inputChange(activeTab, e.target.value)}
                    placeholder={t("enterVariantsPlaceholder", {
                      tab: activeTab,
                    })}
                  />
                </div>
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-4 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handlePrev}
              disabled={step === 0}
            >
              {t("previous")}
            </button>
            <div>
              <button
                type="button"
                className="btn btn-outline-secondary me-2"
                onClick={handleSaveDraft}
              >
                {t("saveAsDraft")}
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (validateStep()) {
                      handleNext();
                    } else {
                      toast.error("Please complete all required fields");
                    }
                  }}
                >
                  {t("next")}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={(e) => {
                    if (validateStep()) {
                      handleSubmit(e); // manually call submit
                    } else {
                      toast.error(
                        "Please complete all required fields before saving"
                      );
                    }
                  }}
                >
                  {t("save")}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
