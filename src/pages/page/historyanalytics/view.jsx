import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/sidebar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import DataTable from 'react-data-table-component';

const Page1 = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://rdo-app-o955y.ondigitalocean.app/sales');
        const result = await response.json();
        const formattedData = result.Data.map((sale) => ({
          id: sale.sales_report_id,
          date: format(new Date(sale.date), 'eeee, dd MMMM yyyy', { locale: id }),
          total_price: new Intl.NumberFormat('id-ID', { //ini ngubah format angka ke Rp
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
        setSalesData(formattedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
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
          <div className="text-center text-2xl">Loading...</div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">History Penjualan</h1>
            <DataTable
              columns={columns}
              data={salesData}
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
