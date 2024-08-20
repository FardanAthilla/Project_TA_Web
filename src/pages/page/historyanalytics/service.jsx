import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/sidebar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import DataTable from 'react-data-table-component';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ServiceView = () => {
  const [serviceData, setServiceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://rdo-app-o955y.ondigitalocean.app/service');
        const result = response.data;

        const formattedServiceData = result.Data.map((service) => ({
          id: service.service_report_id,
          rawDate: new Date(service.date), // Save raw date for sorting
          date: format(new Date(service.date), 'eeee, dd MMMM yyyy', { locale: id }),
          customer_name: service.name,
          worker_name: service.User.username,
          machine_number: service.machine_number,
          machine_name: service.machine_name,
          complaints: service.complaints,
          status: service.Status.status_name,
          worker_image: `https://rdo-app-o955y.ondigitalocean.app/${service.User.image}`,
        })).sort((a, b) => b.rawDate - a.rawDate); // Sort by date, newest first

        setServiceData(formattedServiceData);
        setFilteredData(formattedServiceData);
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
      endDateWithTime.setHours(23, 59, 59, 999); // Set waktu akhir hari

      const filtered = serviceData.filter((service) => {
        const serviceDate = new Date(service.rawDate);
        return serviceDate >= startDate && serviceDate <= endDateWithTime;
      });
      setFilteredData(filtered);
      setCurrentPage(1);
    } else {
      setFilteredData(serviceData);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Belum Selesai':
        return 'bg-red-500 text-white';
      case 'Sudah Selesai':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-green-400 text-white';
    }
  };

  const handleDetailClick = (service) => {
    navigate('/service/detail', { state: { service } });
  };

  const serviceColumns = [
    {
      name: 'No',
      selector: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
      width: '5%',
    },
    {
      name: 'Pekerja',
      selector: row => (
        <div className="flex items-center">
          <img src={row.worker_image} alt="Worker" className="w-10 h-10 rounded-full mr-2" />
          <span>{row.worker_name}</span>
        </div>
      ),
      width: '12%',
    },
    {
      name: 'Tanggal',
      selector: row => row.date,
      width: '15%',
    },
    {
      name: 'Nama Pelanggan',
      selector: row => row.customer_name,
      width: '20%',
    },
    {
      name: 'Nama Mesin',
      selector: row => row.machine_name,
      width: '23%',
    },
    {
      name: 'Status',
      selector: row => (
        <div className={`p-2 rounded ${getStatusStyle(row.status)}`}>
          {row.status}
        </div>
      ),
      width: '15%',
    },
    {
      name: 'Keluhan',
      selector: row => (
        <button
          className="text-blue-500"
          onClick={() => handleDetailClick(row)}
        >
          Lihat Detail
        </button>
      ),
      width: '10%',
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
              <h1 className="text-3xl font-bold">Rekap Service</h1>
              <div className="flex items-end space-x-4">
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
                <button
                  onClick={filterDataByDate}
                  className="btn btn-active btn-neutral">Confirm</button>
              </div>
            </div>
            <DataTable
              columns={serviceColumns}
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

export default ServiceView;
