import React, { useEffect, useState } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbTrash } from "react-icons/tb";
import "../../../../styles/category/category.css";
import BASE_URL from "../../../../pages/config/config";
import Select from "react-select";
import { CiCirclePlus } from "react-icons/ci";
import { FiXSquare } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";

const SubCategory = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [subCategoryName, setSubCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/category/categories`);
      const data = await res.json();
      // console.log('data from subcategory', data)

      // Map data for react-select
      const options = data.map((category) => ({
        value: category._id, // or category.categoryName
        label: category.categoryName,
        code:category.categoryCode,
        original:category
      }));

      setCategories(options);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    console.log("Selected category:", selectedOption);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!selectedCategory || !subCategoryName || !description) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const formData = new FormData();
      formData.append("subCategoryName", subCategoryName);
      formData.append("description", description);
      formData.append("status", status);

      images.forEach((file) => formData.append("images", file));

      const res = await fetch(
        `${BASE_URL}/api/subcategory/categories/${selectedCategory.value}/subcategories`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      toast.success(result.message);

      // ✅ Reset form fields
      setSubCategoryName("");
      setDescription("");
      setStatus(true); // or whatever default
      setImages([]);
      setSelectedCategory(null);
      fetchSubcategories();
      window.$("#add-category").modal("hide");
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(error.message || "Failed to add subcategory");
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/subcategory/subcategories`);
      const data = await res.json();
      setSubcategories(data);
    } catch (error) {
      console.error("Failed to load subcategories:", error);
    }
  };

  
  const filteredSubCategories = subcategories.filter(
    (subcat) =>
      subcat.subCategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subcat.description &&
        subcat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedSubCategories = filteredSubCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        subCategoryName: editingSubCategory.subCategoryName,
        description: editingSubCategory.description,
        status: editingSubCategory.status,
        categoryId:
          editingSubCategory.category?._id || editingSubCategory.categoryId,
      };
      const res = await axios.put(
        `${BASE_URL}/api/subcategory/${editingSubCategory._id}`,
        payload
      );
      toast.success("Subcategory updated successfully!");
      fetchSubcategories(); 
      window.$("#edit-category").modal("hide");
    } catch (error) {
      toast.error(error.message || "Failed to update subcategory");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Sub Category</h4>
              <h6>Manage your sub categories</h6>
            </div>
          </div>
          <div className="page-btn">
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#add-category"
            >
              <i className="ti ti-circle-plus me-1" />
              Add Sub Category
            </a>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search subcategory..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr style={{ textAlign: "center" }}>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input type="checkbox" id="select-all" />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Category Code</th>
                    {/* <th>Image</th> */}
                    <th>Category</th>
                    <th>Sub Category</th>
                    <th>Description</th>
                    <th>Action</th>
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>
                  {paginatedSubCategories.length > 0 ? (
                    paginatedSubCategories.map((subcat) => (
                      <tr style={{ textAlign: "center" }}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td>{subcat.category?.categoryCode}</td>

                        {/* <td>
                          {subcat.images?.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="subcat-img"
                              height="50"
                              width="50"
                              className="me-1"
                            />
                          ))}
                        </td> */}

                        <td>{subcat.category?.categoryName}</td>
                        <td>{subcat.subCategoryName}</td>
                        <td>{subcat.description}</td>
                        {/* <td>
                          <span className="badge bg-success fw-medium fs-10">
                            Active
                          </span>
                        </td> */}
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a
                              className="me-2 p-2"
                              data-bs-toggle="modal"
                              data-bs-target="#edit-category"
                              onClick={() => setEditingSubCategory(subcat)}
                            >
                              <TbEdit />
                            </a>
                            <a className="p-2">
                              <TbTrash />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center p-3">
              <div className="d-flex justify-content-end align-items-center">
                <label className="me-2">Items per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // reset to first page
                  }}
                  className="form-select w-auto"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div>
                <button
                  className="btn btn-light btn-sm me-2"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm me-1 ${
                      currentPage === i + 1
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn btn-light btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* /product list */}
        {/* addd */}
        <div className="modal" id="add-category">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div className="page-title">
                  <h4>Add Sub Category</h4>
                </div>
                <button
                  type="button"
                  className="close bg-danger text-white fs-16"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-0"></div>
                  <div className="mb-3">
                    <label className="form-label">
                      Category<span className="text-danger ms-1">*</span>
                    </label>

                    <Select
                      id="category"
                      options={categories}
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      isSearchable
                      placeholder="Search or select category..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Sub Category Name
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={subCategoryName}
                      onChange={(e) => setSubCategoryName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Description<span className="text-danger ms-1">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="user2"
                        className="check"
                        defaultChecked
                        checked={status}
                        onChange={() => setStatus(!status)}
                      />
                      <label htmlFor="user2" className="checktoggle" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn me-2 btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* edit */}
        <div className="modal" id="edit-category">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div className="page-title">
                  <h4>Edit Sub Category</h4>
                </div>
                <button
                  type="button"
                  className="close bg-danger text-white fs-16"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Category<span className="text-danger ms-1">*</span>
                    </label>

                    <Select
                      id="category"
                      options={categories}
                      isSearchable
                      placeholder="Search or select category..."
                     value={categories.find((opt) => opt.value === (editingSubCategory?.category?._id || editingSubCategory?.categoryId)) || null}
                     onChange={(selectedOption) => setEditingSubCategory({
                      ...editingSubCategory,
                      categoryId:selectedOption.value,
                      category:{...editingSubCategory.category, _id: selectedOption.value, categoryCode:selectedOption.code, categoryName:selectedOption.label}
                     })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Sub Category<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingSubCategory?.subCategoryName || ""}
                      onChange={(e) =>
                        setEditingSubCategory({
                          ...editingSubCategory,
                          subCategoryName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Category Code<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={categories.find((opt) => opt.value === (editingSubCategory?.category?._id || editingSubCategory?.categoryId))?.code || ""} readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Description<span className="text-danger ms-1">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      value={editingSubCategory?.description || ""}
                      onChange={(e) =>
                        setEditingSubCategory({
                          ...editingSubCategory,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="user3"
                        className="check"
                        checked={editingSubCategory?.status || false}
                        onChange={(e) =>
                          setEditingSubCategory({
                            ...editingSubCategory,
                            status: e.target.checked,
                          })
                        }
                      />
                      <label htmlFor="user3" className="checktoggle" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn me-2 btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategory;
