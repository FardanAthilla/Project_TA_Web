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
          dateLabels = groupedData.map(data => data.day);
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
            label: 'Total penjuaan',
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
    const weekStart = moment().startOf('isoWeek');
    for (let i = 0; i < 7; i++) {
      const day = weekStart.clone().add(i, 'days').format('YYYY-MM-DD');
      weekly[day] = 0;
    }

    data.forEach(item => {
      const day = moment(item.date).format('YYYY-MM-DD');
      if (weekly[day] !== undefined) {
        weekly[day] += item.total_price;
      }
    });

    return Object.keys(weekly).map(key => ({ day: key, total: weekly[key] }));
  };

  const groupByMonth = (data) => {
    let monthly = {};
    for (let i = 0; i < 12; i++) {
      const month = moment().subtract(i, 'months').format('YYYY-MM');
      monthly[month] = 0;
    }

    data.forEach(item => {
      const month = moment(item.date).format('YYYY-MM');
      if (!monthly[month]) monthly[month] = 0;
      monthly[month] += item.total_price;
    });

    return Object.keys(monthly).map(key => ({ month: key, total: monthly[key] }));
  };

  const groupByYear = (data) => {
    let yearly = {};
    for (let i = 0; i < 10; i++) {
      const year = moment().subtract(i, 'years').year();
      yearly[year] = 0;
    }

    data.forEach(item => {
      const year = moment(item.date).year();
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
        <div className="filter-dropdown mb-4 flex items-center">
          <div className="dropdown dropdown-hover ml-5">
            <div
              tabIndex={0}
              role="button"
              className="btn"
              style={{ minWidth: '200px' }}
            >
              {filter}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={() => handleFilterChange('WEEKLY')}>Weekly</a>
              </li>
              <li>
                <a onClick={() => handleFilterChange('MONTHLY')}>Monthly</a>
              </li>
              <li>
                <a onClick={() => handleFilterChange('YEARLY')}>Yearly</a>
              </li>
            </ul>
          </div>
        </div>
        <div>
          {chartData.labels.length === 0 ? (
            <div className="text-center text-xl">Tidak ada data untuk periode yang dipilih.</div>
          ) : (
            <LineChart
              series={[
                {
                  data: chartData.datasets[0]?.data || [],
                  // label: 'Total penjualan',
                  borderColor: 'rgba(20, 80, 163, 1)',
                  borderWidth: 2,
                  pointBackgroundColor: 'rgba(20, 80, 163, 1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: '#1450A3'
                }
              ]}
              xAxisLabel={filter === 'WEEKLY' ? 'Day' : filter === 'MONTHLY' ? 'Month' : 'Year'}
              yAxisLabel="Total penjualan"
              width={1000}
              height={500}
              margin={{ left: 60, right: 20, top: 20, bottom: 20 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
