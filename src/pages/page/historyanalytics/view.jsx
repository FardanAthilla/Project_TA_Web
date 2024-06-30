import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/sidebar';

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
          date: sale.date,
          total_price: sale.total_price,
          items: sale.SalesReportItems.map((item) => ({
            name: item.item_name,
            quantity: item.quantity,
            price: item.price,
            category: item.category
          }))
        }));
        setSalesData(formattedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-2xl">Loading...</div>;
  }

  return (
    <div className="h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        <h1 className="text-3xl font-bold mb-4">History Penjualan</h1>
        <table className="table-fixed w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-1/6 px-4 py-2 border border-gray-200">ID</th>
              <th className="w-1/6 px-4 py-2 border border-gray-200">Date</th>
              <th className="w-1/6 px-4 py-2 border border-gray-200">Total Price</th>
              <th className="w-1/2 px-4 py-2 border border-gray-200">Items</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border border-gray-200">{sale.id}</td>
                <td className="px-4 py-2 border border-gray-200">{sale.date}</td>
                <td className="px-4 py-2 border border-gray-200">{sale.total_price}</td>
                <td className="px-4 py-2 border border-gray-200">
                  {sale.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      {item.name} ({item.quantity}x)
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page1;
