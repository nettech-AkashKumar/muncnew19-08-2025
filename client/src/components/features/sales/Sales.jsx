import React from 'react'
import AddSalesModal from '../../../pages/Modal/SalesModal/AddSalesModal'
import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../pages/config/config';
import { useEffect } from 'react';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch sales from backend
  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/sales`, {
        params: { search, page, limit }
      });
      console.log('sales8788', res.data);
      
      setSales(res.data.sales);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      setSales([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line
  }, [search, page, limit]);

  // Pagination controls
  const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setPage(prev => Math.min(prev + 1, pages));

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Sales</h4>
              <h6>Manage Your Sales</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src="assets/img/icons/pdf.svg" alt="img" /></a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src="assets/img/icons/excel.svg" alt="img" /></a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><i className="ti ti-refresh" /></a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
            </li>
          </ul>
          <div className="page-btn">
            <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-sales-new"><i className="ti ti-circle-plus me-1" />Add Sales</a>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              {/* <div className="search-input">
            <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
          </div> */}
              <div className="search-input">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search sales..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
                <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown me-2">
                <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Customer
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Carl Evans</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Minerva Rameriz</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Robert Lamon</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Patricia Lewis</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown me-2">
                <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Staus
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Completed</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Pending</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown me-2">
                <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Payment Status
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Paid</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Unpaid</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Overdue</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Sort By : Last 7 Days
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Recently Added</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Ascending</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Desending</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Last Month</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Last 7 Days</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th>Customer</th>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Grand Total</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Payment Status</th>
                    <th>Biller</th>
                  </tr>
                </thead>
                <tbody className="sales-list">
                  {loading ? (
                    <tr><td colSpan="9" className="text-center">Loading...</td></tr>
                  ) : sales.length > 0 ? (
                    sales.map(sale => (
                      <tr key={sale._id}>
                        <td>{sale.customer?.name || '-'}</td>
                        <td>{sale.referenceNumber}</td>
                        <td>{sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : '-'}</td>
                        <td>{sale.status}</td>
                        <td>{sale.totalAmount || '-'}</td>
                        <td>{sale.paidAmount || '-'}</td>
                        <td>{sale.dueAmount || '-'}</td>
                        <td>{sale.paymentStatus}</td>
                        <td>{sale.billing?.name || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="9" className="text-center">No sales found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination controls */}
            <div className="d-flex justify-content-between align-items-center p-3">
              <button className="btn btn-sm btn-outline-primary" onClick={handlePrev} disabled={page === 1}>Prev</button>
              <span>Page {page} of {pages}</span>
              <button className="btn btn-sm btn-outline-primary" onClick={handleNext} disabled={page === pages}>Next</button>
              <span>Total: {total}</span>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
      <AddSalesModal />
    </div>

  )
}

export default Sales
