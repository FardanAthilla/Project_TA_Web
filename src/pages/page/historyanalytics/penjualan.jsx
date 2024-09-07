import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/sidebar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import ClipLoader from 'react-spinners/ClipLoader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchSalesByOrderId } from '../../../service/fetchapi';

const PenjualanView = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errMessage, setErrMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://rdo-app-o955y.ondigitalocean.app/sales');
        const result = await response.json();
  
        const formattedSalesData = result.Data.map((sale) => ({
          id: sale.sales_report_id,
          rawDate: new Date(sale.date),
          date: format(new Date(sale.date), 'eeee, dd MMMM yyyy', { locale: id }),
          total_price: new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(sale.total_price),
          items: sale.SalesReportItems.map((item) => ({
            name: item.item_name,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
          })),
        }));
  
        setSalesData(formattedSalesData);
        setFilteredData(formattedSalesData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  const handleDetailClick = (penjualan) => {
    navigate('/penjualan/detail', { state: { penjualan } });
  };

  useEffect(() => {
    filterDataByDate();
  }, [startDate, endDate]);

  const filterDataByDate = () => {
    if (startDate && endDate) {
      const endDateWithTime = new Date(endDate);
      endDateWithTime.setHours(23, 59, 59, 999);

      const filtered = salesData.filter((sale) => {
        const saleDate = new Date(sale.rawDate);
        return saleDate >= startDate && saleDate <= endDateWithTime;
      });
      setFilteredData(filtered);
      setCurrentPage(1);
    } else {
      setFilteredData(salesData);
    }
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage + Math.floor(maxVisiblePages / 2) >= totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(maxVisiblePages / 2);
      endPage = currentPage + Math.floor(maxVisiblePages / 2);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  };

  const clearDateFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredData(salesData);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && searchQuery !== '') {
      e.preventDefault();
      setLoadingData(true);
      const response = await fetchSalesByOrderId(searchQuery);
      if (response.status == 200) {
        const formattedSalesData = response.data.map((sale) => ({
          id: sale.sales_report_id,
          rawDate: new Date(sale.date),
          date: format(new Date(sale.date), 'eeee, dd MMMM yyyy', { locale: id }),
          total_price: new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(sale.total_price),
          items: sale.SalesReportItems.map((item) => ({
            name: item.item_name,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
          })),
        }));

        setSalesData(formattedSalesData);
        setFilteredData(formattedSalesData);
        setErrMessage(null);
        setLoadingData(false);
      } else if (response.status == 404) {
        setErrMessage("Data Tidak Ditemukan");
        setLoadingData(false);
      }
    } else if (e.key === 'Enter') {
        setLoadingData(true);
        const response = await fetch('https://rdo-app-o955y.ondigitalocean.app/sales');
        const result = await response.json();
  
        const formattedSalesData = result.Data.map((sale) => ({
          id: sale.sales_report_id,
          rawDate: new Date(sale.date),
          date: format(new Date(sale.date), 'eeee, dd MMMM yyyy', { locale: id }),
          total_price: new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(sale.total_price),
          items: sale.SalesReportItems.map((item) => ({
            name: item.item_name,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
          })),
        }));
  
        setSalesData(formattedSalesData);
        setErrMessage(null);
        setFilteredData(formattedSalesData);
        setLoadingData(false);
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const salesColumns = [
    {
      name: 'No',
      selector: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
      width: '10%',
    },
    {
      name: 'ID',
      selector: (row) => row.id,
      width: '10%',
    },
    {
      name: 'Barang & kuantitas',
      selector: (row) =>
          <div>
            {row.items[0].name}{' '}
            <span style={{ color: 'blue', fontWeight: 'medium' }}>
              {row.items[0].quantity > 0 ? `(${row.items[0].quantity}) pcs` : row.items[0].quantity}
            </span>
          </div>,
      width: '20%',
    },
    {
      name: 'Tanggal',
      selector: (row) => row.date,
      width: '20%',
    },
    {
      name: 'Harga',
      selector: (row) =>
          <div>
            <span style={{ fontWeight: 'medium' }}>
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(row.items[0].price)}
              /pcs
            </span>
          </div>,
      width: '20%',
    },
    {
      name: 'Aksi',
      selector: row => (
        <button
          className="text-blue-500"
          onClick={() => handleDetailClick(row)}
        >
          Lihat Detail
        </button>
      ),
      width: '20%',
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#cfe2ff',
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        padding: '12px 16px',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
      },
    },
  };



  return (
    <div className="h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">

      {loading ? (
          <div className="text-center">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : (
          <>
              <h1 className="text-3xl font-bold">Rekap Penjualan</h1> 
              <div className="flex justify-between space-x-4 mb-4">
                <div className="flex items-end space-x-4 ">
                  <label className="relative flex items-center w-80">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={searchQuery}
                      placeholder="Cari Penjualan by ID"
                      onKeyDown={handleKeyDown}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="p-2 border rounded w-full border-gray-500"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4 opacity-70 cursor-pointer absolute right-3"
                      onClick={handleKeyDown}
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </label>
                </div>
                <div className="flex items-end space-x-4">
                <button
                  onClick={clearDateFilters}
                  className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Reset
                </button>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Tanggal Awal</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    className="mt-1 p-2 border rounded w-full border-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Tanggal Akhir</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    className="mt-1 p-2 border rounded w-full border-gray-500"
                  />
                </div>
                </div>
              </div>
            {loadingData ?
            (
              <div className="text-center">
                <span className="loading loading-dots loading-lg"></span>
              </div>
            ) : 
            errMessage == null ?
            <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative">
              <DataTable
                columns={salesColumns}
                data={currentItems}
                customStyles={customStyles}
              />
            </div>
            : <div className="text-center mt-5">
            Data Tidak Ditemukan
          </div>
            }
            
            {
              loadingData ?
              <div></div>
               : errMessage == null ? <>
               {filteredData.length > 0 && ( // Conditionally render pagination
                <div className="flex justify-center mt-4">
                  <div className="join pt-5">
                    <button
                      className="join-item btn"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      «
                    </button>
                    {getPageNumbers().map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`join-item btn ${pageNumber === currentPage ? "active" : ""}`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      className="join-item btn"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
              </>
              :  <div >
            
            </div>
            }
            
          </>
        )}
      </div>
    </div>
  );
};

export default PenjualanView;
