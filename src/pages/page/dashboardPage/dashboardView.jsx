import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import Sidebar from '../../../components/sidebar';

const DashboardPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('https://rdo-app-o955y.ondigitalocean.app/sales');
        const data = response.data.Data;
        const formattedData = data.map(item => ({
          date: new Date(item.date).getTime(), // Convert ke timestamp
          total_price: item.total_price
        }));
        setSalesData(formattedData);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    const fetchServiceData = async () => {
      try {
        const response = await axios.get('https://rdo-app-o955y.ondigitalocean.app/service');
        const data = response.data.Data;
        const formattedData = data.map(item => ({
          date: new Date(item.date).getTime(), // Convert ke timestamp
          count: 1
        }));
        setServiceData(formattedData);
      } catch (error) {
        console.error('Error fetching service data:', error);
      }
    };

    fetchSalesData();
    fetchServiceData();
  }, []);

  const dates = [...new Set([...salesData.map(item => item.date), ...serviceData.map(item => item.date)])].sort((a, b) => a - b);

  const salesSeries = dates.map(date => {
    const item = salesData.find(d => d.date === date);
    return item ? item.total_price : 0;
  });

  const serviceSeries = dates.map(date => {
    const count = serviceData.filter(d => d.date === date).length;
    return count;
  });

  return (
    <div className="container-fluid flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        <div className="text-black">Dashboard UD Mojopahit!!!</div>
        <div>
          <LineChart
            xAxis={[{ data: dates }]}
            series={[
              {
                data: salesSeries,
                label: 'Sales',
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
              },
              {
                data: serviceSeries,
                label: 'Service',
                borderColor: 'rgba(192,75,75,1)',
                fill: false,
              },
            ]}
            height={500}
            margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
            grid={{ vertical: true, horizontal: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
