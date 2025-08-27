// final
import { useEffect, useState } from "react";
import axios from "axios";
import { FaFileExcel, FaFilePdf, FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import "../../../../styles/product/product-list.css";
import BASE_URL from "../../../../pages/config/config";
import { CiCirclePlus } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

function ProductList() {
  const [products, setProducts] = useState([]);
  console.log("Products:", products);
  const [activeTabs, setActiveTabs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`);
        setProducts(res.data);
        // Initialize all to "general"
        const initialTabs = res.data.reduce((acc, product) => {
          acc[product._id] = "general";
          return acc;
        }, {});
        setActiveTabs(initialTabs);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleTabClick = (productId, tab) => {
    setActiveTabs((prev) => ({ ...prev, [productId]: tab }));
  };

  return (
    <div className="page-wrapper ">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Products</h4>
              <h6>Manage your products</h6>
            </div>
          </div>

          <div className="table-top-head me-2">
            <li><button type="button" className="icon-btn" title="Pdf"><FaFilePdf /></button></li>
            <li><label className="icon-btn m-0" title="Import Excel"><input type="file" accept=".xlsx, .xls" hidden /><FaFileExcel style={{ color: "green" }} /></label></li>
            <li><button type="button" className="icon-btn" title="Export Excel"><FaFileExcel /></button></li>
          </div>
          <div className="d-flex gap-2">
            <a className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-purchase"><CiCirclePlus className="me-1" />Add Products</a>
            <a className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#view-notes"><i data-feather="download" className="me-2" />Import Purchase</a>
          </div>
        </div>

        {products.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          products.map((product) => (
            <div className="">
              {/* All Content */}
              <div className="contents gap-2">
                {/* Tabs */}
                <div className="button-group">
                  {["general", "pricing", "description", "variants"].map(
                    (tab) => (
                      <div
                        key={tab}
                        className={`button-${activeTabs[product._id] === tab ? "active" : "inactive"
                          } button-${tab}`}
                        onClick={() => handleTabClick(product._id, tab)}
                      >
                        <p>
                          {tab === "general"
                            ? "General Information"
                            : tab === "pricing"
                              ? "Pricing & Tax"
                              : tab === "description"
                                ? "Description & Media"
                                : "Variants"}
                        </p>
                      </div>
                    )
                  )}
                </div>

                {/* Toggle Sections */}
                <div className="toggle-section mb-3">
                  {activeTabs[product._id] === "general" && (
                    <div className="section-container">
                      {/* Heading */}
                      <div className="section-header">
                        <div className="section-title">
                          <div className="icon-container">
                            <FaShoppingBag />
                          </div>
                          <div>
                            <h1 className="section-title-text">
                              {product.productName}
                            </h1>
                            <p className="section-subtitle">
                              {/* SKU-KAPL-021 • Goods • Available Qty - 76kg */}
                              SKU-{product.sku} • Available Qty -{" "}
                              {product.quantity} {product.unit}
                            </p>
                          </div>
                        </div>
                        <div className="edit-icon" style={{ cursor: "pointer" }} onClick={() => navigate(`/product/edit/${product._id}`)}>
                          <FaPencilAlt />
                        </div>
                      </div>

                      {/* All Categories */}
                      <div className="categories">
                        {/* Category */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Category</p>
                            <p className="value">
                              {product.category?.categoryName}
                            </p>
                          </div>
                          <div className="category-item">
                            <p className="label">Supplier SKU</p>
                            <p className="value">KAPL-011</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Reorder Level</p>
                            <p className="value">{product.reorderLevel}</p>
                          </div>
                        </div>

                        {/* Brands */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Brands/Manufacturer</p>
                            <p className="value">{product.brand?.brandName}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Barcode</p>
                            <p className="value">{product.itemBarcode}</p>
                            {/* <p className="value">EAN - 1234 5678 9090</p> */}
                          </div>
                          <div className="category-item">
                            <p className="label">Initial Stock Quantity</p>
                            <p className="value">{product.initialStock}</p>
                          </div>
                        </div>

                        {/* Product Type */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Product Type</p>
                            <p className="value">{product.itemType}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Warehouse Location</p>
                            <p className="value">{product.warehouse}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Track by</p>
                            <p className="value">Serial No.</p>
                          </div>
                        </div>

                        {/* Supplier & Warehouse */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Supplier</p>
                            <p className="value">{product.supplierName || '-'}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Warehouse</p>
                            <p className="value">{product.warehouseName || '-'}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Lead Time</p>
                            <p className="value">{product.leadTime}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Status</p>
                            <p className="value">{product.trackType}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTabs[product._id] === "pricing" && (
                    <div className="section-container">
                      {/* Heading */}
                      <div className="section-header">
                        <div className="section-title">
                          <div className="icon-container">
                            <FaShoppingBag />
                          </div>
                          <div>
                            <p className="section-title-text">{product.productName}</p>
                            <p className="section-subtitle">
                              SKU-{product.sku} • Available Qty -{" "}
                              {product.quantity} {product.unit}
                            </p>
                          </div>
                        </div>
                        <div className="edit-icon">
                          <FaPencilAlt />
                        </div>
                      </div>

                      {/* All Categories */}
                      <div className="categories">
                        {/* Category */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Purchase Price</p>
                            <p className="value">{product.purchasePrice}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Unit</p>
                            <p className="value">{product.unit}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">HSN / SAC</p>
                            <p className="value">{product.hsnCode || '-'}</p>
                          </div>
                        </div>

                        {/* Brands */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Selling price</p>
                            <p className="value">{product.sellingPrice}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Discount</p>
                            <p className="value">{product.discountValue}</p>
                            {/* <p className="value">EAN - 1234 5678 9090</p> */}
                          </div>
                          <div className="category-item">
                            <p className="label">GST Rate</p>
                            <p className="value">{product.tax}</p>
                          </div>
                        </div>

                        {/* Product Type */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Wholesale Price / Bulk Price</p>
                            <p className="value">{product.wholesalePrice}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Discount Period</p>
                            {/* <p className="value">{product.purchasePrice}</p> */}
                          </div>
                        </div>

                        {/* Supplier */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Quantity</p>
                            <p className="value"> {product.quantity}</p>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {activeTabs[product._id] === "description" && (
                    <div className="section-container">
                      {/* Description & Media Content */}
                      <div className="section-header">
                        <div className="section-title">
                          <div className="icon-container">
                            <FaShoppingBag />
                          </div>
                          <div>
                            <h1 className="section-title-text">
                              {product.productName}
                            </h1>
                            <p className="section-subtitle">
                              SKU-{product.sku} • Available Qty -{" "}
                              {product.quantity} {product.unit}
                            </p>
                          </div>
                        </div>
                        <div className="edit-icon">
                          <FaPencilAlt />
                        </div>
                      </div>
                      <div>
                        <div className="media-content">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0].url}
                              alt={product.productName}
                              className="media-image"
                              style={{ height: "250px", width: "255px" }}
                            />
                          )}

                          <div>
                            <div className="seo-content">
                              <div>
                                <p className="label">SEO META TITLE</p>
                                <p className="value">{product.seoTitle}</p>
                              </div>
                              <div>
                                <p className="label">SEO META Description</p>
                                <p className="value">{product.seoDescription}</p>
                              </div>
                            </div>
                            <div>
                              <p className="label">Description</p>
                              <p className="value">{product.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTabs[product._id] === "variants" && product.variants && (
                    <div className="section-container">
                      {/* Variants Content */}
                      <div className="section-header">
                        <div className="section-title">
                          <div className="icon-container">
                            <FaShoppingBag />
                          </div>
                          <div>
                            <h1 className="section-title-text">
                              {product.productName}
                            </h1>
                            <p className="section-subtitle">
                              SKU-{product.sku} • Available Qty -{" "}
                              {product.quantity} {product.unit}
                            </p>
                          </div>
                        </div>
                        <div className="edit-icon">
                          <FaPencilAlt />
                        </div>
                      </div>
                      <div className="variants mb-4">
                        <div className="variants-header">
                          <p className="label">Variant</p>
                        </div>
                        {Object.entries(product.variants).map(
                          ([variant, qty]) => (
                            <div key={variant} className="variants-content">
                              <p>{variant}</p>
                              <p>{qty}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* new section is here */}
      <div>
      

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            marginTop: "20px",
          }}
        >
          <h5 style={{ marginBottom: "15px", fontWeight: "600", color: "#333" }}>
           Products
          </h5>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "0",
              }}
            >
              <thead>
                <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Product Name</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>SKU</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Available QTY</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Category</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Brands/Manufacturer</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Product Type</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Supplier</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Supplier SKU</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Barcode</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Warehouse Location</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Warehouse</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Reorder Level</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Initial Stock Quantity</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Track by</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Lead Time</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Status</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Purchase Price</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Selling price</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Wholesale Price / Bulk Price</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Quantity</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Unit</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Discount</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Discount Period</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>HSN / SAC</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>GST Rate</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>SEO META TITLE</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>SEO META Description</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Description</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Varient</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Action</th>
                  
                </tr>
              </thead>
              <tbody>
              {products.map((product,idx)=>( 
                <tr key={product} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px", display:"flex" }}>{product.productName}  {product.images?.[0] && (
                            <img
                              src={product.images[0].url}
                              alt={product.productName}
                              className="media-image"
                              style={{ height: "40px", width: "45px" }}
                            />
                          )} </td>
                  <td style={{ padding: "12px" }}>{product.sku}</td>
                  <td style={{ padding: "12px" }}>{product.quantity} {product.unit}</td>
                  <td style={{ padding: "12px" }}>{product.category?.categoryName}</td>
                  <td style={{ padding: "12px" }}>{product.brand?.brandName}</td>
                  <td style={{ padding: "12px" }}>{product.itemType}</td>
                  <td style={{ padding: "12px" }}>{product.supplierName || '-'}</td>
                  <td style={{ padding: "12px" }}>KAPL-011</td>
                  <td style={{ padding: "12px" }}>{product.itemBarcode}</td>
                  <td style={{ padding: "12px" }}>{product.warehouse}</td>
                  <td style={{ padding: "12px" }}>{product.warehouseName || '-'}</td>
                  <td style={{ padding: "12px" }}>{product.reorderLevel}</td>
                  <td style={{ padding: "12px" }}>{product.initialStock}</td>
                  <td style={{ padding: "12px" }}>Serial No.</td>
                  <td style={{ padding: "12px" }}>{product.leadTime}</td>
                  <td style={{ padding: "12px" }}>{product.trackType}</td>
                  <td style={{ padding: "12px" }}>{product.purchasePrice}</td>
                  <td style={{ padding: "12px" }}>{product.sellingPrice}</td>
                  <td style={{ padding: "12px" }}>{product.wholesalePrice}</td>
                  <td style={{ padding: "12px" }}>{product.quantity}</td>
                  <td style={{ padding: "12px" }}>{product.unit}</td>
                  <td style={{ padding: "12px" }}>{product.discountValue}</td>
                  <td style={{ padding: "12px" }}>{product.purchasePrice}</td>
                  <td style={{ padding: "12px" }}>{product.hsnCode || '-'}</td>
                  <td style={{ padding: "12px" }}>{product.tax}</td>
                  <td style={{ padding: "12px" }}>{product.seoTitle}</td>
                  <td style={{ padding: "12px" }}>{product.seoDescription}</td>
                  <td style={{ padding: "12px" }}>{product.description}</td>
                  {/* <td style={{ padding: "12px" }}>{Object.entries(product.variants).map(
                          ([variant, qty]) => (
                            <div key={variant} >
                             <td><span>{variant} - {qty}</span></td> 
                            </div>
                          )
                        )}</td> */}
                  <td style={{ padding: "12px" , display:"flex"}}>                
                     <button
                      style={{
                        // background: "#007bff",
                        // color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                    >
                      <IoEyeOutline />
                    </button>
                    <button
                      style={{
                        // background: "#007bff",
                        // color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                    >
                      <FiEdit />
                    </button>
                    <button
                      style={{
                        // background: "#dc3545",
                        // color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductList;
