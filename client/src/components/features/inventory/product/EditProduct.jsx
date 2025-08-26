import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../../../pages/config/config";
import "./product.css";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { MdImageSearch } from "react-icons/md";
import CategoryModal from "../../../../pages/Modal/categoryModals/CategoryModal";
import { TbChevronUp, TbRefresh } from "react-icons/tb";
import { useTranslation } from "react-i18next";

const EditProduct = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const steps = [
        t("descriptionAndMedia"),
        t("pricing"),
        t("images"),
        t("variants")
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
        t("flavour")
    ];
    const [step, setStep] = useState(0);
    const [stepStatus, setStepStatus] = useState(Array(steps.length).fill("pending"));
    const [activeTab, setActiveTab] = useState("Color");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/products/${id}`);
                setFormData(res.data);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch product");
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

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

    const validateStep = () => {
        if (step === 0) {
            return formData.productName;
        }
        if (step === 1) {
            return formData.purchasePrice;
        }
        if (step === 2) {
            return formData.description;
        }
        if (step === 3) {
            return formData.variants[activeTab]?.length > 0;
        }
        return true;
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formPayload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "variants") {
                    formPayload.append(key, JSON.stringify(value));
                } else {
                    formPayload.append(key, value);
                }
            });
            images.forEach((imgFile) => {
                formPayload.append("images", imgFile);
            });
            await axios.put(`${BASE_URL}/api/products/${id}`, formPayload, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Product updated successfully!");
            navigate("/product");
        } catch (error) {
            toast.error("Failed to update product");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-wrapper mt-4">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4 className="fw-bold">{t("editProduct")}</h4>
                            <h6>{t("editProductDetails")}</h6>
                        </div>
                    </div>
                    <div className="table-top-head me-2">
                        <li>
                            <button type="button" className="icon-btn"><TbRefresh /></button>
                        </li>
                        <li>
                            <button type="button" className="icon-btn"><TbChevronUp /></button>
                        </li>
                    </div>
                    <div className="page-btn mt-0">
                        <button className="btn btn-secondary" onClick={() => navigate("/product")}>{t("backToProduct")}</button>
                    </div>
                </div>
                <div className="progress-wrapper d-flex justify-content-between align-items-center mb-4 position-relative">
                    {steps.map((label, index) => {
                        const status = stepStatus[index];
                        const isActive = index === step;
                        const isComplete = status === "complete";
                        const isIncomplete = status === "incomplete";
                        return (
                            <div key={index} className="step-wrapper">
                                <div className={`circle ${isComplete ? "complete" : isIncomplete ? "incomplete" : isActive ? "active" : ""}`}>{index + 1}</div>
                                <div className="step-text">{label}</div>
                                {index < steps.length - 1 && (
                                    <div className={`progress-line ${status === "complete" ? "line-complete" : status === "incomplete" ? "line-incomplete" : "line-pending"}`} />
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
                                            <input className="form-check-input" type="radio" name="itemType" value="Good" checked={formData.itemType === "Good"} onChange={handleChange} />
                                            <label className="form-check-label">Good</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="itemType" value="Service" checked={formData.itemType === "Service"} onChange={handleChange} />
                                            <label className="form-check-label">Service</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6 col-12 mb-3">
                                        <label className="form-label">Product Name<span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" name="productName" value={formData.productName || ""} onChange={handleChange} required />
                                    </div>
                                    {/* ...other fields as in ProductCreate... */}
                                </div>
                            </div>
                        )}
                        {/* ...other steps (pricing, images, variants) as in ProductCreate... */}
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-secondary" onClick={handlePrev} disabled={step === 0}>Previous</button>
                        {step < steps.length - 1 ? (
                            <button type="button" className="btn btn-primary" onClick={handleNext}>Next</button>
                        ) : (
                            <button type="submit" className="btn btn-success">Update Product</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
