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

  //customer popup-------------------------------------------------------------------------------------------------------------
  const [popup, setPopup] = useState(false);
  const formRef = useRef(null);
  const handlePopupChange = () => {
    setPopup(!popup);
  }
  const closeForm = () => {
    setPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        closeForm();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //cash popup------------------------------------------------------------------------------------------------------------------
  const [cashpopup, setCashPopup] = useState(false);
  const CashRef = useRef(null);
  const handleCashPopupChange = () => {
    setCashPopup(!cashpopup);
  }
  const closeCash = () => {
    setCashPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (CashRef.current && !CashRef.current.contains(event.target)) {
        closeCash();
      }
    };
    
  const handleKeyDown = (event) => {
    if (event.key === "F1") {
      event.preventDefault();
      setCashPopup((prev) => !prev);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

//bag popup-------------------------------------------------------------------------------------------------------------------
  const [bagpopup, setBagPopup] = useState(false);
  const BagRef = useRef(null);
  const handleBagPopupChange = () => {
    setBagPopup(!bagpopup);
  }
  const closeBag = () => {
    setBagPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (BagRef.current && !BagRef.current.contains(event.target)) {
        closeBag();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //card popup-----------------------------------------------------------------------------------------------------------------------
  const [cardpopup, setCardPopup] = useState(false);
  const CardRef = useRef(null);
  const handleCardPopupChange = () => {
    setCardPopup(!cardpopup);
  }
  const closeCard = () => {
    setCardPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (CardRef.current && !CardRef.current.contains(event.target)) {
        closeCard();
      }
    };
    
  const handleKeyDown = (event) => {
    if (event.key === "F2") {
      event.preventDefault();
      setCardPopup((prev) => !prev);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

//upi popup--------------------------------------------------------------------------------------------------------------------------
  const [upipopup, setUpiPopup] = useState(false);
  const UpiRef = useRef(null);
  const handleUpiPopupChange = () => {
    setUpiPopup(!upipopup);
  }
  const closeUpi = () => {
    setUpiPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (UpiRef.current && !UpiRef.current.contains(event.target)) {
        closeUpi();
      }
    };
    
  const handleKeyDown = (event) => {
    if (event.key === "F3") {
      event.preventDefault();
      setUpiPopup((prev) => !prev);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

//add customer popup--------------------------------------------------------------------------------------------------------------
  const [addcustomerpopup, setAddCustomerPopup] = useState(false);
  const AddCustomerRef = useRef(null);
  const handleAddCustomerPopupChange = () => {
    setAddCustomerPopup(!addcustomerpopup);
  }
  const closeAddCustomer = () => {
    setAddCustomerPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (AddCustomerRef.current && !AddCustomerRef.current.contains(event.target)) {
        closeAddCustomer();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

//discount popup--------------------------------------------------------------------------------------------------------------------
  const [discountpopup, setDiscountPopup] = useState(false);
  const [selectedItemForDiscount, setSelectedItemForDiscount] = useState(null);
  const [discountQuantity, setDiscountQuantity] = useState(1);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountFixed, setDiscountFixed] = useState(0);
  const [discountType, setDiscountType] = useState('Fixed');
  
  const DiscountRef = useRef(null);
  const handleProductDiscountClick = (item) => {
    // setSelectedItemForDiscount(item);
    const product = products.find(p => p._id === item._id); // Find the product in the products array
  setSelectedItemForDiscount({
    ...item,
    availableQuantity: product ? product.quantity : 0, // Store the available quantity
  });
    setDiscountQuantity(item.quantity);
    setDiscountPercentage(item.discountType === 'Percentage' ? item.discountValue : 0);
    setDiscountFixed(item.discountType === 'Fixed' ? item.discountValue : 0);
    setDiscountType(item.discountType || 'Fixed');
    setDiscountPopup(true);
  }
  const closeDiscount = () => {
    setDiscountPopup(false);
    setSelectedItemForDiscount(null);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      setDiscountQuantity(newQuantity);
    }
  };

  const handleDiscountPercentageChange = (value) => {
    setDiscountPercentage(Number(value) || 0);
    setDiscountType('Percentage');
  };

  const handleDiscountFixedChange = (value) => {
    setDiscountFixed(Number(value) || 0);
    setDiscountType('Fixed');
  };

  const applyDiscountChanges = () => {
    if (selectedItemForDiscount) {
      const updatedItems = selectedItems.map(item => 
        item._id === selectedItemForDiscount._id 
          ? {
              ...item,
              quantity: discountQuantity,
              discountValue: discountType === 'Percentage' ? discountPercentage : discountFixed,
              discountType: discountType,
              totalPrice: discountQuantity * item.sellingPrice,
              totalTax: (item.tax * discountQuantity * item.sellingPrice) / 100,
              totalDiscount: discountType === 'Percentage' 
                ? (discountQuantity * item.sellingPrice * discountPercentage) / 100
                : discountFixed * discountQuantity
            }
          : item
      );
      setSelectedItems(updatedItems);
      closeDiscount();
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (DiscountRef.current && !DiscountRef.current.contains(event.target)) {
        closeDiscount();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

//payment done popup-------------------------------------------------------------------------------------------------------
  const [paymentpopup, setPaymentPopup] = useState(false);
  const PaymentRef = useRef(null);
  const handlePaymentPopupChange = () => {
    setPaymentPopup(!paymentpopup);
  }
  const closePayment = () => {
    setPaymentPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (PaymentRef.current && !PaymentRef.current.contains(event.target)) {
        closePayment();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
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
  

//fetch category of products----------------------------------------------------------------------------------------------------
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/category/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  // Category filtering functionality
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    if (selectedCategory && selectedCategory._id === category._id) {
      // If same category is clicked again, show all products
      setSelectedCategory(null);
      setProducts(allProducts);
    } else {
      // Filter products by selected category
      setSelectedCategory(category);
      const filteredProducts = allProducts.filter(product => 
        product.category && product.category._id === category._id
      );
      setProducts(filteredProducts);
    }
  };

  const handleAllItemsClick = () => {
    setSelectedCategory(null);
    setProducts(allProducts);
  };


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

//opt structure-----------------------------------------------------------------------------------------------------------------
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];
  const [otp, setOtp] = useState(["", "", "", ""]);
  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value && index < 5) {
        otpRefs[index + 1].current.focus();
      }

    }
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

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setSearchQuery(customer.name || '');
    setShowDropdown(false);
    setPopup(false); // Close popup after selection
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
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

  //set address
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  
    useEffect(() => {
      setCountryList(Country.getAllCountries());
    }, []);
  
    useEffect(() => {
      if (selectedCountry) {
        setStateList(State.getStatesOfCountry(selectedCountry));
      }
    }, [selectedCountry]);
  
    useEffect(() => {
      if (selectedState) {
        setCityList(City.getCitiesOfState(selectedCountry, selectedState));
      }
    }, [selectedState]);

//company details-----------------------------------------------------------------------------------------------------------------

  const [companyData , setCompanyData] = useState({
    companyName: "",
    companyemail: "",
    companyphone: "",
    companyfax: "",
    companywebsite: "",
    companyaddress: "",
    companycountry: "",
    companystate: "",
    companycity: "",
    companypostalcode: "",
    gstin: "",
    cin: "",
    companydescription: "",
    upiId: "",
  });

  const fetchCompanyProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/companyprofile/get`);
      console.log("Fetched company profile data:", res.data);
      const profile = res.data.data;
      if (profile) {
        setCompanyData({
          companyName: profile.companyName || "",
          companyemail: profile.companyemail || "",
          companyphone: profile.companyphone || "",
          companyfax: profile.companyfax || "",
          companywebsite: profile.companywebsite || "",
          companyaddress: profile.companyaddress || "",
          companycountry: profile.companycountry || "",
          companystate: profile.companystate || "",
          companycity: profile.companycity || "",
          companypostalcode: profile.companypostalcode || "",
          gstin: profile.gstin || "",
          cin: profile.cin || "",
          companydescription: profile.companydescription || "",
          upiId: profile.upiId || "adityasng420.ak@okicici", //company upi id
        });

      }
    } catch (error) {
      toast.error("No existing company profile or error fetching it:", error);
    }
  };
  useEffect(() => {
    fetchCompanyProfile();
  }, []);

//upi qr code generation----------------------------------------------------------------------------------------------------------

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  
  async function generatePaymentQRCode(paymentData) {
        try {
            const qrCodeString = await QRCode.toDataURL(JSON.stringify(paymentData));
            // You can then display this qrCodeString (Data URL) in an <img> tag or save it as an image.
            console.log(qrCodeString);
        } catch (err) {
            console.error(err);
        }
    }
  useEffect(() => {
    if (companyData?.companyName && companyData?.upiId && roundedAmount > 0) {
      // Build UPI Payment String
      const upiString = `upi://pay?pa=${companyData.upiId}&pn=${encodeURIComponent(
        companyData.companyName
      )}&am=${roundedAmount}&cu=INR`;

      // Generate QR Code
      QRCode.toDataURL(upiString)
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error("Error generating QR code:", err);
        });
    }
  }, [roundedAmount, companyData]);

//invoice popup----------------------------------------------------------------------------------------------------------------------

const [invoicepopup, setInvoicePopup] = useState(false);
const InvoiceRef = useRef(null);

  const handleInvoicePopupChange = () => {
    setInvoicePopup(!invoicepopup);
  }
  const closeInvoice = () => {
    setInvoicePopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (InvoiceRef.current && !InvoiceRef.current.contains(event.target)) {
        closeInvoice();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  
const totalDiscountinvoice = selectedSale?.items?.reduce(
  (acc, item) => acc + (item.discount || 0),
  0
);

const totalTaxinvoice = selectedSale?.items?.reduce(
  (acc, item) => acc + (item.tax || 0),
  0
);

//print and download invoice----------------------------------------------------------------------------------------------------------------------

const [isGenerating, setIsGenerating] = useState(false);

// Download PDF function
const handleDownloadPDF = async () => {
  if (isGenerating) return;
  
  // Ensure invoicepopup is open
  setInvoicePopup(true);

  // Wait for the DOM to update (small delay to ensure rendering)
  setTimeout(async () => {
    if (!InvoiceRef.current) {
      console.error('InvoiceRef is null or undefined');
      toast.error('Cannot generate PDF: Invoice content is not available');
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    const element = InvoiceRef.current;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 297],
    });

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 70;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 5;
      doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 10;
      while (heightLeft > 0) {
        doc.addPage();
        position = heightLeft - imgHeight + 5;
        doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 10;
      }

      doc.save('invoice.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF: ' + error.message);
    } finally {
      setIsGenerating(false);
      // Optionally close invoicepopup after generating
      setInvoicePopup(false);
    }
  }, 100); // Small delay to ensure DOM rendering
};

// Print Preview function
const handleInvoicePrint = async () => {
  if (isGenerating) return;

  // Ensure invoicepopup is open
  setInvoicePopup(true);

  // Wait for the DOM to update
  setTimeout(async () => {
    if (!InvoiceRef.current) {
      console.error('InvoiceRef is null or undefined');
      toast.error('Cannot print: Invoice content is not available');
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(InvoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Invoice</title>
            <style>
              body {
                margin: 5mm;
                padding: 0;
                font-family: Arial, sans-serif;
                font-size: 10px;
                color: #333;
              }
              .invoice-container {
                max-width: 70mm;
                margin: 0 auto;
                background-color: #fff;
                padding: 5mm;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 5px;
                margin-bottom: 5px;
              }
              th, td {
                padding: 3px;
                text-align: left;
                font-size: 10px;
              }
              th {
                border-bottom: 1px solid #E1E1E1;
              }
              .text-right {
                text-align: right;
              }
              .text-center {
                text-align: center;
              }
              .section-title {
                font-size: 14px;
                font-weight: 600;
                margin-top: 5px;
              }
              .border-bottom {
                border-bottom: 1px solid #E1E1E1;
              }
              @media print {
                @page {
                  size: A5;
                  margin: 5mm;
                }
                .invoice-container {
                  box-shadow: none;
                  max-width: 70mm;
                }
                body {
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <img src="${imgData}" style="width: 100%; height: auto;" />
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Error generating print preview:', error);
      toast.error('Failed to generate print preview: ' + error.message);
    } finally {
      setIsGenerating(false);
      // Optionally close invoicepopup after printing
      setInvoicePopup(false);
    }
  }, 100); // Small delay to ensure DOM rendering
};

//add customers---------------------------------------------------------------------------------------------------------------

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch(`${BASE_URL}/api/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        email: form.email,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Customer saved successfully ✅");
      setForm({
        name: '',
        email: '',
        phone: '',
        status: true,
      });
  fetchCustomers(); 
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong ❌");
  } finally {
    setLoading(false);
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

            <div style={{border:'1px solid #ccc',marginTop:'10px',borderRadius:'8px',height:'68vh',overflowY:'auto'}}>
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