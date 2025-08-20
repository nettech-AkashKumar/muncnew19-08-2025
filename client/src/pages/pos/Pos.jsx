import React, { useEffect, useRef, useState } from 'react'
import BASE_URL from "../../pages/config/config";
import axios from "axios";
import { IoSearch } from "react-icons/io5";
import { SlHandbag } from "react-icons/sl";
import { GoPersonAdd } from "react-icons/go";
import { RiDeleteBinLine,RiArrowUpWideLine,RiArrowDownWideLine } from "react-icons/ri";
import { BsPersonSquare } from "react-icons/bs";
import { FaRegHandPaper } from "react-icons/fa";
import { LuScanLine } from "react-icons/lu";
import { AiOutlineTransaction,AiOutlineRetweet } from "react-icons/ai";
import { CgSortAz } from "react-icons/cg";
import { TbArrowsSort } from "react-icons/tb";
import { IoIosSearch } from "react-icons/io";

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

  //customer popup
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

  //cash popup
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //card popup
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //upi popup
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //transaction popup 
  const [transactionpopup, setTransactionPopup] = useState(false);
  const TransactionRef = useRef(null);
  const handleTransactionPopupChange = () => {
    setTransactionPopup(!upipopup);
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

  //fetch products
  const [products, setProducts] = useState([]);
  const [activeTabs, setActiveTabs] = useState({});
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/api/products`);
          setProducts(res.data);
          console.log("Products right:", res.data);
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
  
  //fetch category
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

  //bill details up down arrow
  const [updown, setUpdown] = useState(false);
  const handleUpDown = (value) => {
    setUpdown(value)
  };

  //opt
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

  return (
    <div style={{marginLeft:'-21px',backgroundColor:'#fff'}}>

      {/* Add CSS for loading animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* search & cart */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',border:'1px solid #ccc'}}>

        {/* search bar */}
        <div style={{width:'70%',display:'flex',alignItems:'center',borderRight:'1px solid #ccc',}}>
          <IoSearch style={{fontSize:'24px',marginLeft:'10px',color:'#C2C2C2'}} />
          <input type="text" placeholder="Search by its name, sku, hsn code, mrp, sale price, purchase price..." style={{width:'95%',padding:'8px',fontSize:'16px',border:'none',outline:'none',color:'#C2C2C2'}} />
        </div>

        {/* cart */}
        <div style={{width:'30%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0px 20px',}}>
          <div style={{fontSize:'20px',fontWeight:'600'}}>
            Cart
          </div>
          <div style={{display:'flex',gap:'15px',alignItems:'center'}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer',borderRight:'1px solid #ccc',paddingRight:'15px'}}>
              <SlHandbag/> 
              <span style={{fontSize:'10px'}}>Add Bag</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer',borderRight:'1px solid #ccc',paddingRight:'15px'}} onClick={handlePopupChange}>
              <GoPersonAdd/> 
              <span style={{fontSize:'10px'}} >Customer</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer'}}>
              <RiDeleteBinLine/>
              <span style={{fontSize:'10px'}}>Remove All</span>
            </div>
          </div>
        </div>

      </div>

      {/* products & customer billing */}
      <div style={{display:'flex',justifyContent:'space-between',borderTop:'1px solid white',borderBottom:'1px solid #ccc',borderRight:'1px solid #ccc',height:'83vh'}}>
        
        {/* products */}
        <div style={{position:"relative",width:'70%',display:'flex',borderRight:'1px solid #ccc',}}>

            {/* category */}
            <div style={{width:'20%',padding:'20px 50px 0px 20px',borderRight:'1px solid #ccc',overflowY:'auto'}}>

              {/* all items*/}
              <div style={{lineHeight:'30px'}}>
                <span style={{color:'#676767'}}><b>All Items</b></span>
                <div style={{display:'flex',flexDirection:'column',marginLeft:'10px',borderLeft:'1px solid #0051CF',backgroundColor:'#F7F7F7',borderRadius:'8px',padding:'2px 5px',fontWeight:'600',cursor:'pointer'}}>
                  All Items
                </div>
              </div>

              {/* categories */}
              <div style={{lineHeight:'30px',marginTop:'10px',marginBottom:'20px'}}>
                <span style={{color:'#676767'}}><b>Categories</b></span>
                <div style={{display:'flex',flexDirection:'column',marginLeft:'10px'}}>
                {categories.length === 0 ? (
                <span>No Category Available</span>
                ) : (
                  categories.map((categories) => (
                  <span style={{cursor:'pointer'}}>{categories.categoryName}</span>
                  )))}
                </div>
              </div>
            </div>

            {/* details card */}
            <div style={{width:'80%',backgroundColor:'#F7F7F7',height:'100%',overflowY:'auto'}}>
              
              {/* products */}
              <div style={{height:'78vh',marginTop:'20px'}}>
              <div className='row' style={{gap:'30px',marginLeft:'30px',overflowY:'auto',}}>
              {products.length === 0 ? (
                <span>No Product Available</span>
              ) : (
              products.map((product) => (
                <div className='col-2' style={{border:'2px solid #E6E6E6',backgroundColor:'white',borderRadius:'16px',padding:'10px',cursor:'pointer'}}>

                  <div style={{display:'flex',justifyContent:'center',backgroundColor:'white',width:'100%',height:'100px',alignItems:'center'}}>
                    {product.images?.[0] && (
                      <img
                        src={product.images[0].url}
                        alt={product.productName}
                        style={{ height: "100%", width: "100%",objectFit:'contain' }}
                      />
                    )}
                  </div>

                  <div>
                    <span style={{color:'#676767',fontSize:'10px'}}>{product.category?.categoryName}</span>
                  </div>

                  <div>
                    <span style={{fontSize:'14px'}}>{product.productName}</span>
                  </div>

                  <div style={{marginTop:'8px',marginBottom:'8px'}}>
                    <div style={{width:'100%',borderTop:'2px dotted #C2C2C2'}}></div>
                  </div>

                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{fontSize:'14px'}}>{product.quantity}{product.unit}</span>
                    <span style={{fontSize:'14px'}}>₹{product.sellingPrice}</span>
                  </div>

                </div>
              )))}
              </div>
              </div>

              {/* footer */}
              <div style={{position:'absolute',bottom:'0px',backgroundColor:'#F1F1F1',padding:'10px',width:'80%',display:'flex',justifyContent:'space-around'}}>
                
                  <div style={{border:'1px solid #ccc',backgroundColor:'white',padding:'2px 10px',borderRadius:'8px',display:'flex',gap:'5px',alignItems:'center',cursor:'pointer'}}>
                    <FaRegHandPaper/>
                    Hold
                  </div>
                  <div style={{border:'1px solid #ccc',backgroundColor:'white',padding:'2px 10px',borderRadius:'8px',display:'flex',gap:'5px',alignItems:'center',cursor:'pointer'}}>
                    <LuScanLine/>
                    Scan
                  </div>
                  <div style={{border:'1px solid #ccc',backgroundColor:'white',padding:'2px 10px',borderRadius:'8px',display:'flex',gap:'5px',alignItems:'center',cursor:'pointer'}}>
                    <AiOutlineTransaction/>
                    Credit Scale
                  </div>
                  <div style={{border:'1px solid #ccc',backgroundColor:'white',padding:'2px 10px',borderRadius:'8px',display:'flex',gap:'5px',alignItems:'center',cursor:'pointer'}} onClick={handleTransactionPopupChange}>
                    <AiOutlineRetweet />
                    Transaction
                  </div>
                
              </div>

            </div>

        </div>
      
        {/* billing */}
        <div style={{position:'relative',width:'30%',}}>
          
          {/* customer */}
          <div style={{display:'flex',width:'100%',padding:'10px 10px',gap:'10px',borderBottom:'1px solid #ccc',height:'70px',backgroundColor:'#E3F3FF'}}>
            <div>
            <BsPersonSquare style={{fontSize:'50px'}}/>
            </div>
            <div>
              <span>Name : </span>
              <br/>
              <span>Number : </span>
            </div>
          </div>

          {/* price */}
          <div style={{backgroundColor:'#F1F1F1',border:'1px solid #E6E6E6',borderTopLeftRadius:'16px',borderTopRightRadius:'16px',position:'absolute',bottom:'0px',width:'100%',padding:'10px'}}>

            {/* sales summary */}
            {updown && (
            <>
            <div style={{width:'100%',textAlign:'center',marginTop:'-5px'}} onClick={() => handleUpDown(false)} >
              <span style={{color:'#676767',borderTop:'2px solid #676767',padding:'0px 10px'}}><RiArrowDownWideLine style={{color:'#676767'}} /></span>
            </div>
            <div style={{marginTop:'20px',marginBottom:'10px'}}>
            <div>
              <span style={{fontSize:'20px',fontWeight:'600'}}>Sales Summary</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',color:'#676767'}}>
              <span>Sub Total</span>
              <span>₹00.00</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',color:'#676767'}}>
              <span>Tax</span>
              <span>₹00.00</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',color:'#676767'}}>
              <div>Discount</div>
              <div style={{display:'flex',justifyContent:'space-around',gap:'20px'}}>
                <span>₹00.00</span>
                <span>00.00%</span>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',color:'#676767'}}>
              <span>Round Off</span>
              <span>₹00.00</span>
            </div>
            </div>
            </>
            )}
            
            {!updown && (
            <>
            <div style={{width:'100%',textAlign:'center',marginTop:'-5px'}} onClick={() => handleUpDown(true)}>
              <span style={{color:'#676767',borderTop:'2px solid #676767',padding:'0px 10px'}}><RiArrowUpWideLine  style={{color:'#676767'}}  /></span>
            </div>
            </>
            )}

            <div style={{display:'flex',justifyContent:'space-between',color:'#676767',marginTop:'10px',marginBottom:'10px'}}>
              <div style={{display:'flex',justifyContent:'space-around',gap:'5px',alignItems:'center'}}>
                <span style={{color:'#1368EC',fontSize:'20px',fontWeight:'600'}}>Total</span>
                <span style={{fontSize:'15px',fontWeight:'500'}}>(items - 2, Qty - 2)</span>
              </div>
              <span style={{color:'#1368EC',fontSize:'20px',fontWeight:'600'}}>₹00.00</span>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'#1368EC',borderRadius:'8px',color:'white',marginTop:'5px',cursor:'pointer'}} onClick={handleCashPopupChange}>
              <span>Cash</span>
              <span>[F1]</span>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'100%',gap:'15px',marginTop:'5px',}}>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',cursor:'pointer'}} onClick={handleCardPopupChange}>
                <span>Card</span>
                <span>[F2]</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',cursor:'pointer'}} onClick={handleUpiPopupChange}>
                <span>UPI</span>
                <span>[F3]</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* customers popup */}
      {popup && (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
          }}
          >
          <div ref={formRef} style={{width:'760px',height:'500px',margin:'auto',marginTop:'80px',marginBottom:'80px',padding:'10px 16px',overflowY:'auto'}}>
            <div style={{display:'flex',alignItems:'center',border:'1px solid #E1E1E1',borderRadius:'8px',backgroundColor:'#fff',marginTop:'50px'}}>
              <IoSearch style={{fontSize:'24px',marginLeft:'10px',color:'#C2C2C2'}} />
              <input type="text" placeholder="Search by its name, email, phone number..." style={{width:'90%',padding:'8px',fontSize:'16px',border:'none',outline:'none',color:'#C2C2C2'}} />
            </div>
            <div style={{display:'flex',alignItems:'center',border:'1px solid #E1E1E1',borderRadius:'8px',backgroundColor:'#fff',marginTop:'10px',padding:'0px 10px',cursor:'pointer'}}>
              <GoPersonAdd style={{fontSize:'24px',marginLeft:'10px',color:'#1368EC'}} />
              <div style={{width:'90%',padding:'8px',fontSize:'16px',border:'none',outline:'none',color:'#1368EC'}}>
                Add New Customer
              </div>
            </div>
          </div>
        </div>
      )}

      {/* cash popup */}
      {cashpopup && (
        <>
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={CashRef} style={{width:'500px',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px'}}>
            
            <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid #E1E1E1',padding:'10px 0px'}}>
              <span>Cash details</span>
              <span>₹300.00</span>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'100%',gap:'15px',marginTop:'5px',}}>
              <div style={{width:'100%'}}>
                <span>Amount Received</span>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <span>₹500.00</span>
                </div>
              </div>
              <div style={{width:'100%'}}>
                <span>Change to return</span>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <span>₹200.00</span>
                </div>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',marginTop:'5px',marginBottom:'8px'}}>
              <div></div>
              <div style={{padding:'6px 15px',backgroundColor:'#1368EC',borderRadius:'8px',color:'white'}}>
                <span>Record Payment</span>
              </div>
            </div>

            
          </div>
        </div>
        </>
      )}

      {/* card popup */}
      {cardpopup && (
        <>
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={CardRef} style={{width:'500px',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px'}}>
            
            <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid #E1E1E1',padding:'10px 0px'}}>
              <span>Enter Card details</span>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'100%',gap:'15px',marginTop:'5px',}}>
              <div style={{width:'100%'}}>
                <span>Card Number</span>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <span>1234 5678 9101 1213</span>
                </div>
              </div>
              <div style={{width:'100%'}}>
                <span>Name on Card</span>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <span>Aditya Kumar</span>
                </div>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'50%',gap:'15px',marginTop:'2px',}}>
              <div style={{width:'100%'}}>
                <span>Valid till</span>
                <div style={{display:'flex',justifyContent:'center',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <input type="text" placeholder="12/34" style={{border:'none',outline:'none',width:'100%'}} />
                </div>
              </div>
              <div style={{width:'100%'}}>
                <span>CVV</span>
                <div style={{display:'flex',justifyContent:'center',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <input type="text" placeholder="999" style={{border:'none',outline:'none',width:'100%'}} />
                </div>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',marginTop:'5px',marginBottom:'8px'}}>
              <div></div>
              <div style={{padding:'3px 10px',backgroundColor:'white',border:'2px solid #E6E6E6',borderRadius:'8px',color:'#676767'}}>
                <span>Send OTP</span>
              </div>
            </div>

            <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginTop:'8px'}}>
              <div style={{display:'flex',gap:'15px'}}>
                {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  value={digit}
                  ref={otpRefs[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  placeholder='0'
                  style={{color:'#C2C2C2',width:'60px',height:'60px',textAlign:'center',borderRadius:'8px',padding:'8px',backgroundColor:'#F5F5F5',outline:'none',border:'none',fontSize:'50px'}}
                />
                ))}
              </div>
              <div style={{marginTop:'10px',fontSize:'14px'}}>
                <span>Have not received the OTP? </span>
                <span style={{color:'#1368EC'}}>Send again</span>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',marginTop:'20px',marginBottom:'8px'}}>
              <div></div>
              <div style={{padding:'3px 10px',backgroundColor:'#1368EC',border:'2px solid #E6E6E6',borderRadius:'8px',color:'white'}}>
                <span>Proceed to Pay</span>
              </div>
            </div>

            
          </div>
        </div>
        </>
      )}

      {/* upi popup */}
      {upipopup && (
        <>
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={UpiRef} style={{width:'500px',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px'}}>
            
            <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid #E1E1E1',padding:'10px 0px'}}>
              <span>Enter Card details</span>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'100%',gap:'15px',marginTop:'5px',}}>
              <div style={{width:'100%'}}>
                <span>Card Number</span>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <span>1234 5678 9101 1213</span>
                </div>
              </div>
              <div style={{width:'100%'}}>
                <span>Name on Card</span>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <span>Aditya Kumar</span>
                </div>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0px',width:'50%',gap:'15px',marginTop:'2px',}}>
              <div style={{width:'100%'}}>
                <span>Valid till</span>
                <div style={{display:'flex',justifyContent:'center',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <input type="text" placeholder="12/34" style={{border:'none',outline:'none',width:'100%'}} />
                </div>
              </div>
              <div style={{width:'100%'}}>
                <span>CVV</span>
                <div style={{display:'flex',justifyContent:'center',padding:'10px 15px',backgroundColor:'white',borderRadius:'10px',border:'1px solid #E6E6E6',width:'100%',marginTop:'5px'}}>
                  <input type="text" placeholder="999" style={{border:'none',outline:'none',width:'100%'}} />
                </div>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',marginTop:'5px',marginBottom:'8px'}}>
              <div></div>
              <div style={{padding:'3px 10px',backgroundColor:'white',border:'2px solid #E6E6E6',borderRadius:'8px',color:'#676767'}}>
                <span>Send OTP</span>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',marginTop:'20px',marginBottom:'8px'}}>
              <div></div>
              <div style={{padding:'3px 10px',backgroundColor:'#1368EC',border:'2px solid #E6E6E6',borderRadius:'8px',color:'white'}}>
                <span>Proceed to Pay</span>
              </div>
            </div>

            
          </div>
        </div>
        </>
      )}

      {/* transaction popup */}
      {transactionpopup && (
        <>
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
            alignItems:'center',
          }}
          >
          <div ref={TransactionRef} style={{width:'70vw',height:'80vh',padding:'10px 16px',overflowY:'auto',backgroundColor:'#fff',border:'1px solid #E1E1E1',borderRadius:'8px'}}>
            
            <div style={{display:'flex',justifyContent:'space-between',border:'1px solid #E1E1E1',padding:'5px 0px',borderRadius:'8px',alignItems:'center'}} >
            
                        <div className='' style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
                            <div className="">
                                {searchdrop ? (
                                    <>
                                        <div style={{ border: 'none', marginLeft: '20px', alignItems: 'center', display: 'flex' }}>
                                            <IoIosSearch style={{ fontSize: '25px' }} />
                                            <input type='text' placeholder='Search Here' style={{ border: 'none', outline: 'none', fontSize: '20px' }} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                      <button className="">All</button>
                                    </>
                                )}
                            </div>

                            <div className="" style={{ marginTop: "4px" }}>
                                {searchdrop ? (
                                    <></>) : (<>
                                    <button className="" value={searchdrop} onClick={handleSearchDropChange}><IoSearch /> <CgSortAz style={{ fontSize: '30px' }} /></button>
                                    </>)}
                                    <button className="" onClick={handleClear}><TbArrowsSort /></button>
                            </div>
                        </div>

                        {searchdrop ? (
                            <>
                                <div className='' style={{ display: 'flex', justifyContent: 'space-between', padding: '5px', borderBottom: '2px solid #E6E6E6' }}>

                                    <div className="" style={{ marginTop: "4px", display: 'flex', gap: '10px' }}>
                                        <div style={{ border: '2px solid #ccc', padding: '1px 5px 0px 3px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}>
                                            <button className="" style={{ outline: 'none', border: 'none', color: '#555252' }}> Filter <CgSortAz style={{ fontSize: '30px' }} /></button>
                                        </div>

                                        <div
                                            style={{ border: categoryValue ? '2px dashed #1368EC' : '2px dashed #ccc', padding: '0px 10px 0px 3px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}
                                            value={categoryValue}
                                            onChange={handleCategoryChange}>
                                            <select className="" style={{ outline: 'none', border: 'none', color: categoryValue ? '#1368EC' : '#555252' }}>
                                                <option value="" style={{ color: '#555252' }}>Category</option>
                                                <option value="c1" style={{ color: '#555252' }}>Category 1</option>
                                                <option value="c2" style={{ color: '#555252' }}>Category 2</option>
                                            </select>
                                        </div>

                                        <div
                                            style={{ border: socketValue ? '2px dashed #1368EC' : '2px dashed #ccc', padding: '0px 10px 0px 3px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}
                                            value={socketValue}
                                            onChange={handleSocketChange}>
                                            <select className="" style={{ outline: 'none', border: 'none', color: socketValue ? '#1368EC' : '#555252' }}>
                                                <option value="" style={{ color: '#555252' }}>Socket Level</option>
                                                <option value="sl1" style={{ color: '#555252' }}>Last 7 days</option>
                                            </select>
                                        </div>

                                        <div
                                            style={{ border: warehouseValue ? '2px dashed #1368EC' : '2px dashed #ccc', padding: '0px 10px 0px 3px', alignItems: 'center', display: 'flex', borderRadius: '6px' }}
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

                                    <div className="" style={{ marginTop: "4px" }}>
                                        <button className="">Clear</button>
                                    </div>

                                </div>
                            </>
                        ) : (<></>)}

            </div>

          </div>
        </div>
        </>
      )}

    </div>
  )
}

export default Pos