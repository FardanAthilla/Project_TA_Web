import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../../../components/sidebar';
import { fetchSalesData, fetchServiceData } from '../../../service/fetchapi';

const DashboardPage = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ categories: [], salesData: [], serviceData: [] });
  const [selectedRange, setSelectedRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLoad = async () => {
      setIsLoading(true);
      try {
        console.log('Loading data for range:', selectedRange);
        const { days, months, years } = getRangeParams(selectedRange);
        const [salesData, serviceData] = await Promise.all([
          fetchSalesData(days, months, years),
          fetchServiceData(days, months, years),
        ]);

        const processedSalesData = processChartData(salesData, 'sales');
        const processedServiceData = processChartData(serviceData, 'service');

        setChartData({
          categories: processedSalesData.categories,
          salesData: processedSalesData.seriesData,
          serviceData: processedServiceData.seriesData,
        });
      } catch (error) {
        console.error('Error loading chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleLoad();
  }, [selectedRange]);

  useEffect(() => {
    if (!isLoading && chartData.categories.length) {
      buildChart(chartData.categories, chartData.salesData, chartData.serviceData);
    }
  }, [chartData, isLoading]);

  const getRangeParams = (range) => {
    console.log('Selected range:', range);
    switch (range) {
      case '7d': return { days: 7, months: 0, years: 0 };
      case '1m': return { days: 0, months: 1, years: 0 };
      case '12m': return { days: 0, months: 12, years: 0 };
      default: return { days: 7, months: 0, years: 0 };
    }
  };

  const handleRangeChange = (range) => {
    console.log('Range changed to:', range);
    setSelectedRange(range);
  };


  const processChartData = (data, type) => {
    if (!Array.isArray(data) || data.length === 0) {
      return { categories: [], seriesData: [] };
    }
  
    let categories = [];
    let seriesData = [];
  
    if (selectedRange === '7d') {
      const today = new Date();
      const lastSevenDays = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - (6 - i));
        return date;
      });
  
      categories = lastSevenDays.map(date => date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));
      seriesData = Array(7).fill(0);
  
      data.forEach((entry) => {
        const entryDate = new Date(entry.date);
        const index = lastSevenDays.findIndex(date => date.toDateString() === entryDate.toDateString());
  
        if (index !== -1) {
          const value = type === 'sales'
            ? Array.isArray(entry.SalesReportItems)
              ? entry.SalesReportItems.reduce((sum, item) => sum + item.quantity, 0)
              : 0
            : 1; // Replace with the relevant field for service data
  
          seriesData[index] += value;
  
          // Add console log for debugging
          console.log(`Processing ${type} data for ${entryDate.toLocaleDateString('id-ID')} with value: ${value}`);
        }
      });
    } else if (selectedRange === '1m') {
      const today = new Date();
      const weeksInMonth = 4;
      const startDate = new Date();
      startDate.setDate(today.getDate() - 27);
  
      const lastFourWeeks = Array.from({ length: weeksInMonth }).map((_, i) => {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + (i * 7));
        return weekStart;
      });
  
      categories = lastFourWeeks.map(date =>
        `${date.getDate()}-${date.getDate() + 6} ${date.toLocaleDateString('id-ID', { month: 'short' })}`
      );
  
      seriesData = Array(weeksInMonth).fill(0);
  
      data.forEach((entry) => {
        const entryDate = new Date(entry.date);
        const index = lastFourWeeks.findIndex((start) =>
          entryDate >= start && entryDate < new Date(start.getTime() + (7 * 24 * 60 * 60 * 1000))
        );
  
        if (index !== -1) {
          const value = type === 'sales'
            ? Array.isArray(entry.SalesReportItems)
              ? entry.SalesReportItems.reduce((sum, item) => sum + item.quantity, 0)
              : 0
            : 1;
  
          seriesData[index] += value;
  
          // Add console log for debugging
          console.log(`Processing ${type} data for ${entryDate.toLocaleDateString('id-ID')} with value: ${value}`);
        }
      });
    } else if (selectedRange === '12m') {
      const monthsInYear = 12;
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
  
      categories = Array.from({ length: monthsInYear }).map((_, i) => {
        const monthIndex = (currentMonth - i + 12) % 12;
        const year = currentYear - Math.floor((i + 12 - currentMonth) / 12);
        return new Date(year, monthIndex, 1).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
      }).reverse();
  
      seriesData = Array(monthsInYear).fill(0);
  
      data.forEach((entry) => {
        const entryDate = new Date(entry.date);
        const index = categories.findIndex(category => {
          const [month, year] = category.split(' ');
          return entryDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) === `${month} ${year}`;
        });
  
        if (index !== -1) {
          const value = type === 'sales'
            ? Array.isArray(entry.SalesReportItems)
              ? entry.SalesReportItems.reduce((sum, item) => sum + item.quantity, 0)
              : 0
            : 1;
  
          seriesData[index] += value;
  
          // Add console log for debugging
          console.log(`Processing ${type} data for ${entryDate.toLocaleDateString('id-ID')} with value: ${value}`);
        }
      });
    }
  
    return { categories, seriesData };
  };
  
  const buildChart = (categories, salesData, serviceData) => {
    const is7Days = selectedRange === '7d';
    const maxDataValue = Math.max(...[...salesData, ...serviceData]);

    const maxYAxisValue = is7Days
      ? maxDataValue <= 7 ? 7 : Math.ceil(maxDataValue / 7) * 7
      : Math.ceil(maxDataValue / 7) * 7;

    if (chartRef.current) {
      window.ApexCharts && new window.ApexCharts(chartRef.current, {
        chart: {
          height: 550,
          width: 700,
          type: 'area',
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        series: [
          { name: 'Penjualan', data: salesData },
          { name: 'Service', data: serviceData }
        ],
        legend: { show: true },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        grid: { strokeDashArray: 6 },
        fill: {
          type: 'gradient',
          gradient: {
            type: 'vertical',
            shadeIntensity: 1,
            opacityFrom: 0.1,
            opacityTo: 0.8
          }
        },
        xaxis: {
          type: 'category',
          tickPlacement: 'on',
          categories: categories,
          axisBorder: { show: false },
          axisTicks: { show: false },
          crosshairs: { stroke: { dashArray: 0 } },
          tooltip: { enabled: false },
          labels: {
            style: {
              colors: '#9ca3af',
              fontSize: '13px',
              fontFamily: 'Inter, ui-sans-serif',
              fontWeight: 400
            }
          }
        },
        yaxis: {
          min: 0,
          max: maxYAxisValue, // Dynamic max value based on data
          tickAmount: 7, // Always show 7 ticks
          forceNiceScale: true,
          labels: {
            align: 'left',
            style: {
              colors: '#9ca3af',
              fontSize: '13px',
              fontFamily: 'Inter, ui-sans-serif',
              fontWeight: 400
            },
            formatter: (value) => Math.round(value), // Ensure only whole numbers are shown
          }
        },
        tooltip: {
          x: { format: 'dd MMM yyyy' },
          y: { formatter: (value) => value >= 1000 ? `${value / 1000}k` : value }
        },
        responsive: [{
          breakpoint: 568,
          options: {
            chart: { height: 300 },
            labels: {
              style: {
                colors: '#9ca3af',
                fontSize: '11px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400
              },
              offsetX: -2,
              formatter: (title) => title.slice(0, 3)
            },
            yaxis: {
              labels: {
                align: 'left',
                style: {
                  colors: '#9ca3af',
                  fontSize: '11px',
                  fontFamily: 'Inter, ui-sans-serif',
                  fontWeight: 400
                },
                formatter: (value) => value >= 1000 ? `${value / 1000}k` : value
              }
            },
          },
        }]
      }).render();
    }
  };

  return (
    <div className="container-fluid flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        <h1 className="text-2xl font-semibold mb-4">Grafik Penjualan dan Service UD Mojopahit</h1>
        <div className="mb-4">
          <div className="filter-buttons">
            <button
              className={`py-1 px-4 rounded-lg ${selectedRange === '7d' ? 'bg-[#1450A3] text-white border border-[#ffffff]' : 'bg-white text-[#1450A3] border border-[#1450A3]'}`}
              onClick={() => handleRangeChange('7d')}
            >
              7 Hari Terakhir
            </button>
            <button
              className={`ml-2 py-1 px-4 rounded-lg ${selectedRange === '1m' ? 'bg-[#1450A3] text-white border border-gray-600' : 'bg-white text-[#1450A3] border border-[#1450A3]'}`}
              onClick={() => handleRangeChange('1m')}
            >
              1 Bulan Terakhir
            </button>
            <button
              className={`ml-2 py-1 px-4 rounded-lg ${selectedRange === '12m' ? 'bg-[#1450A3] text-white border border-gray-600' : 'bg-white text-[#1450A3] border border-[#1450A3]'}`}
              onClick={() => handleRangeChange('12m')}
            >
              12 Bulan Terakhir
            </button>

          </div>
        </div>
        <div id="hs-single-area-chart" ref={chartRef}></div>
      </div>
    </div>
  );
};

export default DashboardPage;
