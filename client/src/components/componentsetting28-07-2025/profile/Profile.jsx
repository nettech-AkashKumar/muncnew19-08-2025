import React, { useEffect, useRef, useState } from "react";
import { LuUser } from "react-icons/lu";
import { CiCirclePlus, CiLocationOn } from "react-icons/ci";
import "./Profile.css";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../../pages/config/config";
import { useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Iconss from "../../../assets/images/Iconss.png"

const UserProfile = () => {
  const { user } = useAuth();
  const id = user?._id || user?.id;
  const [userData, setUserData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFiles, setImageFiles] = useState({ profileImage: null });
  const fileInputRef = useRef(null);
  const handleIconClick = () => {
    fileInputRef.current.click(); // programmatically open file dialog
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1, // Try to keep under 1MB
          maxWidthOrHeight: 800,
          useWebWorker: true,
        });
        const preview = URL.createObjectURL(compressedFile);
        setPreviewUrl(preview);
        setImageFiles({ profileImage: compressedFile });
      } catch (error) {
        console.error("Compresseion failed:", error);
      }
    }
  };

  // for country, state, city
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

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

  // fetch user
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        console.log("User ID from URL:", id);
        const userId = id;
        const res = await axios.get(`${BASE_URL}/api/user/${userId}`);
        // console.log("Fetched user:", res.data);
        setUserData(res.data);
        if (res.data.profileImage?.url) {
          setPreviewUrl(res.data.profileImage.url);
        }
      } catch (error) {
        console.error("Error fetching user", error);
        toast.error("Failed to load user");
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFiles) return toast.warn("Please select an image");
    const formData = new FormData();
    formData.append("profileImage", imageFiles.profileImage);
    try {
      const userId = userData._id;
      await axios.put(`${BASE_URL}/api/user/update/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile image updates");
    } catch (error) {
      toast.error("Failed to update image");
    }
  };

  return (
    <div>
      <div className="profile-container pb-2">
        {userData ? (
          <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="section-top-profile">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px' }}>
                  <span className="pprreofile" style={{ color: '#262626' }}>
                    Profile
                  </span>
                  <span className="pprreofile" style={{ backgroundColor: '#1368EC', borderRadius: '4px', padding: '8px', color: '#FFFFFF' }}>
                    Sales Manager
                  </span>
                </div>
                <hr style={{ color: '#b9b9b9ff', height: '1px', }} />
                <label
                  htmlFor=""
                >
                  <span className="pprreofile" style={{ color: '#262626' }}>Basic Information</span>
                </label>

                <div
                  className=""
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '2px dashed #dadadaff',
                    padding: '20px 20px',
                    borderRadius: '8px',
                    margin: '10px',

                  }}

                >
                  <div
                    className="add-image-circle"
                    style={{
                      display: 'flex',
                      border: "2px solid #1368EC",
                      width: "100px",
                      height: "100px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "grey",
                      cursor: "pointer",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          pointerEvents: "none",
                          borderRadius: '50%'
                        }}
                      />
                    ) : (
                      <>
                        <CiCirclePlus style={{ fontSize: "20px" }} />
                        <span style={{ fontSize: "12px", textAlign: "center" }}>
                          Add Image
                        </span>
                      </>
                    )}
                  </div>

                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />

                  <div style={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: '5px',
                      textAlign: "center",
                      backgroundColor: " #E3F3FF",
                      color: "#1368EC",
                      border: "1px solid #BBE1FF",
                      borderRadius: "15px",
                      width: "150px",
                      height: "45px",
                      cursor: "pointer",
                    }}>
                      <img src={Iconss} alt="" style={{ width: '20px', height: '20px' }} />
                      <span
                        onClick={handleIconClick}
                        className="setting-imgupload-btn"
                      >
                        Upload Image
                      </span>
                    </div>
                    <p style={{ color: '#888888', fontFamily: '"Roboto", sans-serif', fontWeight: 400, fontSize: '12px', marginTop: '10px' }}>
                      Upload an image below 2MB, Accepted File format JPG, PNG
                    </p>
                  </div>
                  <div className="invisible">
                    ;lpk
                  </div>
                </div>
              </div>

              {/* details field */}
              <div className="section-top-profile">
                <div className="profle-details-form py-4 d-flex flex-column gap-3">
                  <div style={{ display: "flex", gap: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "5px",
                      }}
                    >
                      <label className="ffrrstname" style={{ fontWeight: "500" }} htmlFor="">
                        First Name
                      </label>
                      <input className="ffrrstnameinput"
                        readOnly
                        type="text"
                        value={userData?.firstName || ""}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "5px",
                      }}
                    >
                      <label className="ffrrstname" style={{ fontWeight: "500" }} htmlFor="">
                        Last Name
                      </label>
                      <input className="ffrrstnameinput"
                        readOnly
                        style={{
                          border: "1px solid #cbc6c6",
                          padding: "8px 5px",
                        }}
                        type="text"
                        value={userData?.lastName || ""}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "5px",
                      }}
                    >
                      <label className="ffrrstname" style={{ fontWeight: "500" }} htmlFor="">
                        Phone Number
                      </label>
                      <input className="ffrrstnameinput"
                        readOnly
                        type="text"
                        value={userData?.phone || ""}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "5px",
                      }}
                    >
                      <label className="ffrrstname" style={{ fontWeight: "500" }} htmlFor="">
                        Email
                      </label>
                      <input className="ffrrstnameinput"
                        readOnly
                        style={{
                          border: "1px solid #cbc6c6",
                          padding: "8px 5px",
                        }}
                        type="email"
                        value={userData?.email || ""}
                      />
                    </div>
                  </div>
                </div>
                <div className="address-information pb-4" style={{ padding: '0px 13px' }}>
                  <div className="d-flex flex-column gap-3">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                      }}
                    >
                      <label className="ffrrstname" style={{ fontWeight: "500" }} htmlFor="">
                        Address
                      </label>
                      <input className="ffrrstnameinput"
                        readOnly
                        style={{
                          height: '100px',
                          border: "1px solid #cbc6c6",
                          padding: "8px 5px",
                        }}
                        type="text"
                        value={userData?.address || ""}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          gap: "5px",
                        }}
                      >
                        <label className="ffrrstname" style={{ fontWeight: "500" }} htmlFor="">
                          Country
                        </label>
                        <select className="ffrrstnameinput"
                          style={{
                            border: "1px solid #cbc6c6",
                            padding: "8px 5px",
                            borderRadius: "5px",
                          }}
                        >
                          <option value="">Select Country</option>
                          <option value="">India</option>
                          <option value="">Brazil</option>
                          <option value="">Australia</option>
                        </select>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          gap: "5px",
                        }}
                      >
                        <label className="ffrrstname" style={{ fontWeight: "500" }} htmlFor="">
                          State
                        </label>
                        <select className="ffrrstnameinput"
                          style={{
                            border: "1px solid #cbc6c6",
                            padding: "8px 5px",
                            borderRadius: "5px",
                          }}
                        >
                          <option value="">Select State</option>
                          <option value="">Bihar</option>
                          <option value="">Assam</option>
                          <option value="">Jharkhand</option>
                        </select>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          gap: "5px",
                        }}
                      >
                        <label className="ffrrstname" style={{ fontWeight: "500" }} htmlFor="">
                          City
                        </label>
                        <select className="ffrrstnameinput"
                          style={{
                            border: "1px solid #cbc6c6",
                            padding: "8px 5px",
                            borderRadius: "5px",
                          }}
                        >
                          <option value="">Select City</option>
                          <option value="">Patna</option>
                          <option value="">Purnia</option>
                          <option value="">Vaishali</option>
                        </select>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          gap: "5px",
                        }}
                      >
                        <label className="ffrrstname" style={{ fontWeight: "500" }} htmlFor="">
                          Postal Code
                        </label>
                        <input className="ffrrstnameinput"
                          type="number"
                          style={{
                            border: "1px solid #cbc6c6",
                            padding: "8px 5px",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    gap: "10px",
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '14px',
                  }}
                >
                  <button
                    // className="settingbtn"
                    style={{
                      border: "1px solid #E6E6E6",
                      borderRadius: '4px',
                      padding: "8px",
                      backgroundColor: "#FFFFFF",
                      color: "#676767",
                      borderRadius: "5px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    // className="settingbtn"
                    style={{
                      border: "1px solid #676767",
                      borderRadius: '4px',
                      padding: "8px",
                      backgroundColor: "#262626",
                      color: "#FFFFFF",
                      borderRadius: "5px",
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <p>No Data found</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
