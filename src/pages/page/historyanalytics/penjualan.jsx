import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/sidebar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import DataTable from 'react-data-table-component';
import ClipLoader from 'react-spinners/ClipLoader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PenjualanView = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://rdo-app-o955y.ondigitalocean.app/sales');
        const result = await response.json();

        const formattedSalesData = result.Data.map((sale) => ({
          id: sale.sales_report_id,
          rawDate: new Date(sale.date), // Save raw date for filtering
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

  const filterDataByDate = () => {
    if (startDate && endDate) {
      const endDateWithTime = new Date(endDate);
      endDateWithTime.setHours(23, 59, 59, 999); // Set end time to the end of the day

      const filtered = salesData.filter((sale) => {
        const saleDate = new Date(sale.rawDate);
        return saleDate >= startDate && saleDate <= endDateWithTime;
      });
      setFilteredData(filtered);
      setCurrentPage(1); // Reset to the first page when filtering
    } else {
      setFilteredData(salesData);
    }
  };

  const salesColumns = [
    {
      name: 'No',
      selector: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
      width: '10%',
    },
    {
      name: 'Barang',
      selector: row => row.items.map((item, index) => (
        <div key={index}>{item.name} ({item.quantity}x)</div>
      )),
      width: '40%',
    },
    {
      name: 'Tanggal',
      selector: row => row.date,
      width: '25%',
    },
    {
      name: 'Total Harga',
      selector: row => row.total_price,
      width: '25%',
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
        whiteSpace: 'normal',
        wordWrap: 'break-word',
      },
    },
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader size={50} color={"#123abc"} loading={loading} />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Analitik Penjualan</h1>
              <div className="flex items-end space-x-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Tanggal Awal</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
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
                    dateFormat="dd/MM/yyyy"
                    className="mt-1 p-2 border rounded w-full border-gray-500"
                  />
                </div>
                <button
                  onClick={filterDataByDate}
                  className="btn btn-active btn-neutral">Confirm</button>
              </div>
            </div>
            <DataTable
              columns={salesColumns}
              data={currentItems}
              customStyles={customStyles}
              pagination={false}
            />
            <div className="flex justify-center mt-4">
              <div className="join pt-5">
                <button
                  className="join-item btn"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={index}
                      onClick={() => paginate(pageNumber)}
                      className={`join-item btn ${pageNumber === currentPage ? "active" : ""}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  className="join-item btn"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PenjualanView;
