import React, { useEffect, useRef, useState } from 'react';
import { LineChart } from '@mui/x-charts';
import Sidebar from '../../../components/sidebar';
import axios from 'axios';
import moment from 'moment';

const DashboardPage = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [filter, setFilter] = useState('WEEKLY');
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://rdo-app-o955y.ondigitalocean.app/sales');
        const salesData = response.data.Data;
        console.log("API response:", salesData);
        
        let dateLabels = [];
        let totalPrices = [];

        if (filter === 'WEEKLY') {
          const groupedData = groupByWeek(salesData);
          dateLabels = groupedData.map(data => data.week);
          totalPrices = groupedData.map(data => data.total);
        } else if (filter === 'MONTHLY') {
          const groupedData = groupByMonth(salesData);
          dateLabels = groupedData.map(data => data.month);
          totalPrices = groupedData.map(data => data.total);
        } else if (filter === 'YEARLY') {
          const groupedData = groupByYear(salesData);
          dateLabels = groupedData.map(data => data.year);
          totalPrices = groupedData.map(data => data.total);
        }

        const newChartData = {
          labels: dateLabels,
          datasets: [{
            label: 'Total Sales',
            data: totalPrices,
            borderColor: 'rgba(20, 80, 163, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(20, 80, 163, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#1450A3'
          }]
        };

        setChartData(newChartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [filter]);

  const groupByWeek = (data) => {
    let weekly = {};
    data.forEach(item => {
      let week = moment(item.date).isoWeek();
      let year = moment(item.date).year();
      let key = `${year}-W${week}`;
      if (!weekly[key]) weekly[key] = 0;
      weekly[key] += item.total_price;
    });
    return Object.keys(weekly).map(key => ({ week: key, total: weekly[key] }));
  };

  const groupByMonth = (data) => {
    let monthly = {};
    data.forEach(item => {
      let month = moment(item.date).format('YYYY-MM');
      if (!monthly[month]) monthly[month] = 0;
      monthly[month] += item.total_price;
    });
    return Object.keys(monthly).map(key => ({ month: key, total: monthly[key] }));
  };

  const groupByYear = (data) => {
    let yearly = {};
    data.forEach(item => {
      let year = moment(item.date).year();
      if (!yearly[year]) yearly[year] = 0;
      yearly[year] += item.total_price;
    });
    return Object.keys(yearly).map(key => ({ year: key, total: yearly[key] }));
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="container-fluid flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        <div className="text-black"></div>
        <div className="filter-buttons mb-4">
          <button
            className={`py-1 px-4 rounded-lg ${filter === 'WEEKLY' ? 'bg-[#1450A3] text-white border border-[#ffffff]' : 'bg-white text-[#1450A3] border border-[#1450A3]'}`}
            onClick={() => handleFilterChange('WEEKLY')}
          >
            Weekly
          </button>
          <button
            className={`ml-2 py-1 px-4 rounded-lg ${filter === 'MONTHLY' ? 'bg-[#1450A3] text-white border border-gray-600' : 'bg-white text-[#1450A3] border border-[#1450A3]'}`}
            onClick={() => handleFilterChange('MONTHLY')}
          >
            Monthly
          </button>
          <button
            className={`ml-2 py-1 px-4 rounded-lg ${filter === 'YEARLY' ? 'bg-[#1450A3] text-white border border-gray-600' : 'bg-white text-[#1450A3] border border-[#1450A3]'}`}
            onClick={() => handleFilterChange('YEARLY')}
          >
            Yearly
          </button>
        </div>
        <div>
          <LineChart
            series={[
              {
                data: chartData.datasets[0]?.data || [],
                label: 'Total Sales',
                borderColor: 'rgba(20, 80, 163, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(20, 80, 163, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#1450A3'
              }
            ]}
            xAxisLabel={filter === 'WEEKLY' ? 'Week' : filter === 'MONTHLY' ? 'Month' : 'Year'}
            yAxisLabel="Total Sales"
            width={1000}
            height={500}
            margin={{ left: 60, right: 20, top: 20, bottom: 20 }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
