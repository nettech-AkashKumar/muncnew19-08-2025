//packages
import React, { useEffect, useRef, useState } from 'react'
import { Country, State, City } from "country-state-city";
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//host
import BASE_URL from "../config/config";
import axios from "axios";

//icons
import { IoSearch } from "react-icons/io5";
import { SlHandbag , SlBag } from "react-icons/sl";
import { GoPersonAdd } from "react-icons/go";
import { RiDeleteBinLine,RiArrowUpWideLine,RiArrowDownWideLine } from "react-icons/ri";
import { BsPersonSquare } from "react-icons/bs";
import { FaRegHandPaper } from "react-icons/fa";
import { LuScanLine } from "react-icons/lu";
import { AiOutlineTransaction,AiOutlineRetweet } from "react-icons/ai";
import { CgSortAz } from "react-icons/cg";
import { TbArrowsSort } from "react-icons/tb";
import { IoIosSearch, IoIosArrowBack , IoIosArrowForward } from "react-icons/io";
import { MdPrint } from "react-icons/md";
import { AiOutlineDownload } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { PiBagThin,PiShoppingBagThin } from "react-icons/pi";

//images
import PaymentDone from '../../assets/img/payment-done.png';
import Upi from '../../assets/img/upi.png';
import Banks from '../../assets/img/banks.png';

function Pos() {

    const [searchdrop, setSearchDrop] = useState(false);
    const handleSearchDropChange = () => {
        setSearchDrop(true);
    }

    const [categoryValue, setCategoryValue] = useState('');
    const handleCategoryChange = (e) => {
        setCategoryValue(e.target.value);
    };

    const [socketValue, setSocketValue] = useState('');
    const handleSocketChange = (e) => {
        setSocketValue(e.target.value);
    };

    const [warehouseValue, setWarehouseValue] = useState('');
    const handleWarehouseChange = (e) => {
        setWarehouseValue(e.target.value);
    };

    const [exprationValue, setExprationValue] = useState('');
    const handleExprationChange = (e) => {
        setExprationValue(e.target.value);
    };

    const handleClear = () => {
        setSearchDrop(false);
        setCategoryValue('');
        setSocketValue('');
        setWarehouseValue('');
        setExprationValue('');
    };



//transaction popup---------------------------------------------------------------------------------------------------------------
  const [transactionpopup, setTransactionPopup] = useState(false);
  const TransactionRef = useRef(null);
  const handleTransactionPopupChange = () => {
    setTransactionPopup(!transactionpopup);
  }
  const closeTransaction = () => {
    setTransactionPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (TransactionRef.current && !TransactionRef.current.contains(event.target)) {
        closeTransaction();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


//fetch products details---------------------------------------------------------------------------------------------------------
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for filtering
  const [activeTabs, setActiveTabs] = useState({});
  
// Search functionality
 
  const [productSearchQuery, setProductSearchQuery] = useState('')

  const [transactionSearchQuery, setTransactionSearchQuery] = useState('');
      // Product search functionality
  const handleProductSearch = (query) => {
    setProductSearchQuery(query);
    
    if (!query.trim()) {
      setProducts(allProducts);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filteredProducts = allProducts.filter(product => {
      return (
        product.productName?.toLowerCase().includes(searchTerm) ||
        (product.brand && typeof product.brand === 'object' && product.brand.name?.toLowerCase().includes(searchTerm)) ||
        (product.brand && typeof product.brand === 'string' && product.brand.toLowerCase().includes(searchTerm)) ||
        product.seoTitle?.toLowerCase().includes(searchTerm) ||
        product.seoDescription?.toLowerCase().includes(searchTerm) ||
        (product.category && typeof product.category === 'object' && product.category.name?.toLowerCase().includes(searchTerm)) ||
        (product.category && typeof product.category === 'string' && product.category.toLowerCase().includes(searchTerm)) ||
        (product.subcategory && typeof product.subcategory === 'object' && product.subcategory.name?.toLowerCase().includes(searchTerm)) ||
        (product.subcategory && typeof product.subcategory === 'string' && product.subcategory.toLowerCase().includes(searchTerm))
      );
    });
    
    setProducts(filteredProducts);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`);
        setProducts(res.data);
        setAllProducts(res.data); // Store all products
        // console.log("Products right:", res.data);
        // Log first product to see image structure
        if (res.data.length > 0) {
          // console.log("First product structure:", res.data[0]);
          // console.log("First product images:", res.data[0].images);
        }
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
  


// Product selection and cart functionality---------------------------------------------------------------------------------
  const [selectedItems, setSelectedItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [roundedAmount, setRoundedAmount] = useState(0);
  const [totalTax, setTotalTax] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [bagCharge, setBagCharge] = useState(0);
  const [posSales, setPosSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const handleProductClick = (product) => {
    const existingItemIndex = selectedItems.findIndex(item => item._id === product._id);
    
    if (existingItemIndex !== -1) {
      // Product already exists, increment quantity
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].sellingPrice;
      updatedItems[existingItemIndex].totalDiscount = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].discountValue;
      updatedItems[existingItemIndex].totalTax = (updatedItems[existingItemIndex].sellingPrice * updatedItems[existingItemIndex].tax * updatedItems[existingItemIndex].quantity) / 100;
      setSelectedItems(updatedItems);
    } else {
      // Add new product to cart
      const newItem = {
        ...product,
        quantity: 1,
        totalPrice: product.sellingPrice,
        totalDiscount: product.discountValue,
        totalTax: (product.sellingPrice * product.tax) / 100,
      };
      setSelectedItems([...selectedItems, newItem]);
    }
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or negative
      setSelectedItems(selectedItems.filter(item => item._id !== itemId));
    } else {
      const updatedItems = selectedItems.map(item => 
        item._id === itemId 
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.sellingPrice, totalTax: (item.tax * newQuantity * item.sellingPrice)/100, totalDiscount: newQuantity * item.discountValue }
          : item
      );
      setSelectedItems(updatedItems);
    }
  };

  const removeItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item._id !== itemId));
  };

  // Calculate totals whenever selectedItems changes
  useEffect(() => {
    const subtotal = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = selectedItems.reduce((sum, item) => sum + item.totalDiscount, 0);
    const tax = selectedItems.reduce((sum, item) => sum + item.totalTax, 0);
    const items = selectedItems.length;
    const quantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    setSubTotal(subtotal)
    setDiscount(discount)
    setTotalTax(tax);
    setTotalItems(items);
    setTotalQuantity(quantity);
    
    const calculatedTotal = (subtotal - discount) + tax + bagCharge;
    setTotalAmount(calculatedTotal);
    
    // Calculate rounded amount based on decimal part
    const decimalPart = calculatedTotal - Math.floor(calculatedTotal);
    if (decimalPart <= 0.49) {
      setRoundedAmount(Math.floor(calculatedTotal));
    } else {
      setRoundedAmount(Math.ceil(calculatedTotal));
    }
  }, [selectedItems, bagCharge]);

const [amountReceived, setAmountReceived] = useState("");

const changeToReturn = Math.max((Number(amountReceived) || 0) - roundedAmount, 0);
const dueAmount = Math.max(roundedAmount - (Number(amountReceived) || 0), 0);

//bill details up down arrow-----------------------------------------------------------------------------------------------------
  const [updown, setUpdown] = useState(false);
  const handleUpDown = (value) => {
    setUpdown(value)
  };


//customers selection--------------------------------------------------------------------------------------------------------------
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

const fetchCustomers = async () => {
  
  try {
    const res = await axios.get(`${BASE_URL}/api/customers`);
    setCustomers(res.data);
  } catch (err) {
    setCustomers([]);
  }
};

  useEffect(() => {
    fetchCustomers();
    fetchPosSales();
  }, []);

  // Customer search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // Filter customers based on search query
    const filtered = customers.filter(customer => {
      const searchTerm = query.toLowerCase();
      return (
        customer.name?.toLowerCase().includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm) ||
        customer.phone?.toLowerCase().includes(searchTerm)
      );
    });

    setSearchResults(filtered);
    setShowDropdown(filtered.length > 0);
  };


// Fetch sales transactions-------------------------------------------------------------------------------------------------
  const fetchPosSales = async (page = 1, searchQuery = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: page,
        limit: 10
      });
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery);
      }
      
      const response = await axios.get(`${BASE_URL}/api/pos-sales/transactions?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosSales(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalSales(response.data.pagination.totalSales);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching POS sales:', error);
    } finally {
      setLoading(false);
    }
  };

// Transaction search functionality
  const handleTransactionSearch = (query) => {
    setTransactionSearchQuery(query);
    fetchPosSales(1, query);
  };

// Create POS sale---------------------------------------------------------------------------------------------------------------------
  const createPosSale = async (paymentMethod, amountReceived = 0, changeReturned = 0) => {
    try {
      if (!selectedCustomer || selectedItems.length === 0) {
        alert('Please select a customer and items before proceeding');
        return;
      }

      // Ensure numeric values are numbers and map to correct property names
      const saleData = {
        customerId: selectedCustomer._id,
        items: selectedItems.map(item => ({
          productId: item._id,
          quantity: Number(item.quantity),
          sellingPrice: Number(item.sellingPrice),
          totalPrice: Number(item.totalPrice),
          discountValue: Number(item.totalDiscount || 0), // Map totalDiscount to discountValue
          discountType: 'Fixed', // Default to Fixed
          tax: Number(item.totalTax || 0) // Map totalTax to tax
        })),
        paymentMethod,
        amountReceived: Number(amountReceived || 0),
        changeReturned: Number(changeReturned || 0),
        bagCharge: Number(bagCharge || 0),
        subtotal: Number(subTotal || 0),
        discount: Number(discount || 0),
        tax: Number(totalTax || 0),
        totalAmount: Number(roundedAmount || 0)
      };

      console.log('Frontend sending sale data:', saleData);
      console.log('Data types:', {
        customerId: typeof saleData.customerId,
        itemsLength: saleData.items.length,
        paymentMethod: typeof saleData.paymentMethod,
        subtotal: typeof saleData.subtotal,
        totalAmount: typeof saleData.totalAmount
      });

      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_URL}/api/pos-sales/create`, saleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Clear cart and show payment success
        setSelectedItems([]);
        setSelectedCustomer(null);
        setBagCharge(0);
        setAmountReceived('');
        setSelectedSale(response.data.data);
        handlePaymentPopupChange();
        // Refresh transactions
        fetchPosSales(1, transactionSearchQuery);
      }
    } catch (error) {
      console.error('Error creating POS sale:', error);
      
      // Show detailed validation errors if available
      if (error.response?.data?.details) {
        const errorDetails = error.response.data.details;
        if (typeof errorDetails === 'object') {
          const errorMessages = Object.entries(errorDetails)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n');
          alert('Validation Error:\n' + errorMessages);
        } else {
          alert('Error creating sale: ' + errorDetails);
        }
      } else {
        alert('Error creating sale: ' + (error.response?.data?.message || error.message));
      }
    }
  };

// Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchPosSales(newPage, transactionSearchQuery);
    }
  };



  return ( //page code starts from here-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    <div >
      {!transactionpopup && (
        <>
        <div style={{
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={TransactionRef} style={{width:'95vw',height:'88vh',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px',position:'relative'}}>

            <div style={{ border: '1px solid #E1E1E1', padding: '5px 0px', borderRadius: '8px', alignItems: 'center', marginTop: '5px' }} >

                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '5px 20px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {searchdrop ? (
                      <>
                        <div style={{ border: 'none', marginLeft: '10px', alignItems: 'center', display: 'flex', width: '600px' }}>
                          <IoIosSearch style={{ fontSize: '25px' }} />
                          <input 
                            type='text' 
                            placeholder='Search by invoice ID, customer name, phone, or item name...' 
                            value={transactionSearchQuery}
                            onChange={(e) => handleTransactionSearch(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '20px', width: '100%', color: '#333' }} 
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                          <div style={{ backgroundColor: '#ccc', color: 'black', padding: '5px 8px', borderRadius: '6px' }}>All</div>
                          <div style={{ color: 'black', padding: '5px 8px', }}>Recents</div>
                          <div style={{ color: 'black', padding: '5px 8px', }}>Paid</div>
                          <div style={{ color: 'black', padding: '5px 8px', }}>Due</div>
                    <div 
                      style={{ 
                        color: 'black', 
                        padding: '5px 8px', 
                        cursor: 'pointer',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px'
                      }}
                      onClick={() => fetchPosSales(currentPage, transactionSearchQuery)}
                      title="Refresh"
                    >
                      ↻
                    </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {searchdrop ? (
                      <></>) : (<>
                        <div style={{ color: 'black', padding: '3px 8px', borderRadius: '6px', border: '2px solid #ccc', display: 'flex', gap: '10px', alignItems: 'center', cursor:'pointer' }} value={searchdrop} onClick={handleSearchDropChange}>
                          <IoSearch />
                          <CgSortAz style={{ fontSize: '25px' }} />
                        </div>
                      </>)}
                    <div style={{ color: 'black', padding: '7px 8px', borderRadius: '6px', border: '2px solid #ccc', display: 'flex', gap: '10px', alignItems: 'center', cursor:'pointer' }} onClick={handleClear}><TbArrowsSort /></div>
                  </div>
                </div>

                {searchdrop ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', }}>

                      <div style={{ marginTop: "4px", display: 'flex', gap: '10px' }}>
                        <div style={{ border: '2px solid #ccc', padding: '1px 5px 0px 8px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}>
                          <div style={{ outline: 'none', border: 'none', color: '#555252' }}> Filter <CgSortAz style={{ fontSize: '30px' }} /></div>
                        </div>

                        <div
                          style={{ border: categoryValue ? '2px dashed #1368EC' : '2px dashed #ccc', padding: '0px 10px 0px 8px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}
                          value={categoryValue}
                          onChange={handleCategoryChange}>
                          <select className="" style={{ outline: 'none', border: 'none', color: categoryValue ? '#1368EC' : '#555252' }}>
                            <option value="" style={{ color: '#555252' }}>Category</option>
                            <option value="c1" style={{ color: '#555252' }}>Category 1</option>
                            <option value="c2" style={{ color: '#555252' }}>Category 2</option>
                          </select>
                        </div>

                        <div
                          style={{ border: socketValue ? '2px dashed #1368EC' : '2px dashed #ccc', padding: '0px 10px 0px 8px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}
                          value={socketValue}
                          onChange={handleSocketChange}>
                          <select className="" style={{ outline: 'none', border: 'none', color: socketValue ? '#1368EC' : '#555252' }}>
                            <option value="" style={{ color: '#555252' }}>Socket Level</option>
                            <option value="sl1" style={{ color: '#555252' }}>Last 7 days</option>
                          </select>
                        </div>

                        <div
                          style={{ border: warehouseValue ? '2px dashed #1368EC' : '2px dashed #ccc', padding: '0px 10px 0px 8px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}
                          value={warehouseValue}
                          onChange={handleWarehouseChange}>
                          <select className="" style={{ outline: 'none', border: 'none', color: warehouseValue ? '#1368EC' : '#555252' }}>
                            <option value="" style={{ color: '#555252' }}>Warehouse</option>
                            <option value="wh1" style={{ color: '#555252' }}>Warehouse 1</option>
                          </select>
                        </div>

                        <div
                          style={{ border: exprationValue ? '2px dashed #1368EC' : '2px dashed #ccc', padding: '0px 10px 0px 3px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}
                          value={exprationValue}
                          onChange={handleExprationChange}>
                          <select className="" style={{ outline: 'none', border: 'none', color: exprationValue ? '#1368EC' : '#555252' }}>
                            <option value="" style={{ color: '#555252' }}>Expiration</option>
                            <option value="e1" style={{ color: '#555252' }}>Expiration 1</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ color: 'black', padding: '2px 8px', borderRadius: '6px', border: '2px solid #ccc', display: 'flex', alignItems: 'center', cursor:'pointer' }}>
                        <span>Clear</span>
                      </div>

                    </div>
                  </>
                ) : (<></>)}

            </div>

            <div style={{border:'1px solid #ccc',marginTop:'10px',borderRadius:'8px',height:'67vh',overflowY:'auto'}}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#E6E6E6' }}>
                    <tr style={{ color: "#676767", }}>
                      <th style={{ padding: '8px', borderTopLeftRadius: '8px' }}>Invoice ID</th>
                      <th>Customer</th>
                      <th>Sold Items</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Total Amount</th>
                      <th>Due Amount</th>
                      <th style={{ borderTopRightRadius: '8px' }}>Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                          Loading...
                        </td>
                    </tr>
                    ) : posSales.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      posSales.map((sale) => (
                        <tr key={sale._id} style={{ borderTop: '1px solid #E6E6E6' }}>
                          <td style={{ padding: '8px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#1368EC' }}>
                              {sale.invoiceNumber || 'N/A'}
                            </div>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <div>
                              <div style={{ fontWeight: '600' }}>{sale.customer?.name || 'N/A'}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>{sale.customer?.phone || 'N/A'}</div>
                            </div>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <div style={{ fontSize: '12px' }}>
                              {sale.items?.map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                  {item.images && item.images.length > 0 ? (
                                    <img 
                                      src={item.images[0]} 
                                      alt={item.productName} 
                                      style={{ 
                                        width: '30px', 
                                        height: '30px', 
                                        objectFit: 'cover', 
                                        borderRadius: '4px',
                                        border: '1px solid #ddd'
                                      }} 
                                    />
                                  ) : null}
                                  <div>
                                    <div style={{ fontWeight: '500' }}>{item.productName || 'N/A'}</div>
                                    <div style={{ fontSize: '11px', color: '#666' }}>
                                      Qty: {item.quantity} × ₹{item.unitPrice?.toFixed(2) || '0.00'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td>
                            {new Date(sale.saleDate).toLocaleDateString('en-IN')}
                            <br />
                            <span style={{ fontSize: '12px', color: '#666' }}>
                              {new Date(sale.saleDate).toLocaleTimeString('en-IN')}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: sale.status === 'Paid' ? '#d4edda' : 
                                               sale.status === 'Due' ? '#fff3cd' : '#f8d7da',
                              color: sale.status === 'Paid' ? '#155724' : 
                                     sale.status === 'Due' ? '#856404' : '#721c24',
                              fontSize: '12px'
                            }}>
                              {sale.status}
                            </span>
                          </td>
                          <td>₹{sale.totals?.totalAmount?.toFixed(2) || '0.00'}</td>
                          <td>
                            {sale.paymentDetails?.dueAmount > 0 ? (
                              <span style={{ color: '#dc3545', fontWeight: '600' }}>
                                ₹{sale.paymentDetails.dueAmount.toFixed(2)}
                              </span>
                            ) : (
                              <span style={{ color: '#28a745' }}>₹0.00</span>
                            )}
                          </td>
                          <td>{sale.paymentDetails?.paymentMethod || 'N/A'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
            </div>

            <div style={{display:'flex',justifyContent:'end',marginTop:'10px',padding:'0px 10px',gap:'10px',}}>
              <div
              style={{
                padding: "6px 12px",
                borderRadius: "5px",
                border: "1px solid #E6E6E6",
                backgroundColor: "#FFFFFF",
                color: "#333",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
              }}
              >
                10 per page
              </div>
              <div
              style={{
                padding: "6px 12px",
                borderRadius: "5px",
                border: "1px solid #E6E6E6",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                color: "#333",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
              }}
              >
                <span>{((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, totalSales)} of {totalSales}</span> 
                <span style={{color:'#ccc'}}>|</span> 
                <IoIosArrowBack 
                  style={{
                    color: currentPage > 1 ? '#333' : '#ccc',
                    cursor: currentPage > 1 ? "pointer" : "not-allowed"
                  }} 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                /> 
                <IoIosArrowForward 
                  style={{
                    color: currentPage < totalPages ? '#333' : '#ccc',
                    cursor: currentPage < totalPages ? "pointer" : "not-allowed"
                  }}
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                />
              </div>
            </div>

          </div>
        </div>
        </>
      )}

    
    </div>
    
  )
}

export default Pos