import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/sidebar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import DataTable from 'react-data-table-component';

const Page1 = () => {
  const [salesData, setSalesData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesResponse, serviceResponse] = await Promise.all([
          fetch('https://rdo-app-o955y.ondigitalocean.app/sales'), 
          fetch('https://rdo-app-o955y.ondigitalocean.app/service')
        ]);

        const salesResult = await salesResponse.json();
        const serviceResult = await serviceResponse.json();

        const formattedSalesData = salesResult.Data.map((sale) => ({
          id: sale.sales_report_id,
          date: format(new Date(sale.date), 'eeee, dd MMMM yyyy', { locale: id }),
          total_price: new Intl.NumberFormat('id-ID', { //ubah format harga ke Rp
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

        const formattedServiceData = serviceResult.Data.map((service) => ({
          id: service.service_report_id,
          date: format(new Date(service.date), 'eeee, dd MMMM yyyy', { locale: id }), //ubah waktu ke ID
          person_name: service.person_name,
          machine_number: service.machine_number,
          machine_name: service.machine_name,
          complaints: service.complaints,
          status: service.status,
        }));

        setSalesData(formattedSalesData);
        setServiceData(formattedServiceData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const salesColumns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '15%'
    },
    {
      name: 'Barang',
      selector: row => row.items.map((item, index) => (
        <div key={index}>{item.name} ({item.quantity}x)</div>
      )),
      sortable: false,
      width: '45%'
    },
    {
      name: 'Tanggal',
      selector: row => row.date,
      sortable: true,
      width: '20%'
    },
    {
      name: 'Total Harga',
      selector: row => row.total_price,
      sortable: true,
      width: '20%'
    }
  ];

  const serviceColumns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: false,
      width: '10%'
    },
    {
      name: 'Tanggal',
      selector: row => row.date,
      sortable: false,
      width: '20%'
    },
    {
      name: 'Nama Orang',
      selector: row => row.person_name,
      sortable: false,
      width: '20%'
    },
    {
      name: 'Nomor Mesin',
      selector: row => row.machine_number,
      sortable: false,
      width: '20%'
    },
    {
      name: 'Nama Mesin',
      selector: row => row.machine_name,
      sortable: false,
      width: '20%'
    },
    {
      name: 'Keluhan',
      selector: row => row.complaints,
      sortable: false,
      width: '20%'
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: false,
      width: '20%'
    }
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#cfe2ff',
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
  };

  return (
    <div className="h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        {loading ? (
          <div className="text-center text-2xl">Sebentar, sedang memuat yaa</div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">History Penjualan</h1>
            <DataTable
              columns={salesColumns}
              data={salesData}
              customStyles={customStyles}
              pagination
            />
            <h1 className="text-3xl font-bold mt-10 mb-4">History Service</h1>
            <DataTable
              columns={serviceColumns}
              data={serviceData}
              customStyles={customStyles}
              pagination
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Page1;
