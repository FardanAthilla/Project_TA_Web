import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/sidebar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import DataTable from 'react-data-table-component';
import ClipLoader from 'react-spinners/ClipLoader';

const ServiceView = () => {
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://rdo-app-o955y.ondigitalocean.app/service');
        const result = response.data;

        const formattedServiceData = result.Data.map((service) => ({
          id: service.service_report_id,
          date: format(new Date(service.date), 'eeee, dd MMMM yyyy', { locale: id }),
          person_name: service.person_name,
          machine_number: service.machine_number,
          machine_name: service.machine_name,
          complaints: service.complaints,
          status: service.status,
        }));

        setServiceData(formattedServiceData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const serviceColumns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '5%',
    },
    {
      name: 'Tanggal',
      selector: row => row.date,
      sortable: true,
      width: '15%',
    },
    {
      name: 'Customer',
      selector: row => row.person_name,
      sortable: true,
      width: '15%',
    },
    {
      name: 'Nomor Mesin',
      selector: row => row.machine_number,
      sortable: true,
      width: '15%',
    },
    {
      name: 'Nama Mesin',
      selector: row => row.machine_name,
      sortable: true,
      width: '15%',
    },
    {
      name: 'Keluhan',
      selector: row => row.complaints,
      sortable: true,
      width: '20%',
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      width: '15%',
    },
  ];

  const customStyles = { //ngatur biar dia ke bawah column 
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
  const currentItems = serviceData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(serviceData.length / itemsPerPage);

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
            <h1 className="text-3xl font-bold mb-4">Analitik Service</h1>
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
