import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../../../components/sidebar';
import { fetchSalesData, fetchServiceData } from '../../../service/fetchapi';

const DashboardPage = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ categories: [], salesData: [], serviceData: [] });
  const [selectedRange, setSelectedRange] = useState('7d');

  useEffect(() => {
    const handleLoad = async () => {
      try {
        console.log('Selected Range:', selectedRange);
        const { days, months, years } = getRangeParams(selectedRange);
        console.log('Params:', { days, months, years });
  
        const [salesData, serviceData] = await Promise.all([
          fetchSalesData(days, months, years),
          fetchServiceData(days, months, years),
        ]);
  
        console.log('Sales Data:', salesData);
        console.log('Service Data:', serviceData);
  
        const processedSalesData = processChartData(salesData, 'sales');
        const processedServiceData = processChartData(serviceData, 'service');
  
        setChartData({
          categories: processedSalesData.categories,
          salesData: processedSalesData.seriesData,
          serviceData: processedServiceData.seriesData,
        });
  
        buildChart(processedSalesData.categories, processedSalesData.seriesData, processedServiceData.seriesData);
      } catch (error) {
        console.error('Error loading chart data:', error);
      }
    };
  
    handleLoad();
  }, [selectedRange]);
  
  const getRangeParams = (range) => {
    switch (range) {
      case '7d': return { days: 7, months: 0, years: 0 };
      case '6m': return { days: 0, months: 6, years: 0 };
      case '12m': return { days: 0, months: 12, years: 0 };
      default: return { days: 7, months: 0, years: 0 };
    }
  };

  const handleRangeChange = (event) => {
    setSelectedRange(event.target.value);
  };

  const processChartData = (data, type) => {
    if (!Array.isArray(data) || data.length === 0) {
      return { categories: [], seriesData: [] };
    }
  
    let categories, seriesData;
  
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
          
          seriesData[index] = value;
        }
      });
    } else {
      const months = selectedRange === '6m' ? 6 : 12;
      const today = new Date();
      const lastMonths = Array.from({ length: months }).map((_, i) => {
        const date = new Date();
        date.setMonth(today.getMonth() - (months - 1 - i));
        return date;
      });
  
      categories = lastMonths.map(date => date.toLocaleDateString('id-ID', { month: 'short' }));
      seriesData = Array(months).fill(0);
  
      data.forEach((entry) => {
        const entryDate = new Date(entry.date);
        const index = lastMonths.findIndex(date => 
          date.getFullYear() === entryDate.getFullYear() && 
          date.getMonth() === entryDate.getMonth()
        );
  
        if (index !== -1) {
          const value = type === 'sales'
            ? Array.isArray(entry.SalesReportItems)
              ? entry.SalesReportItems.reduce((sum, item) => sum + item.quantity, 0)
              : 0
            : 1; // Replace with the relevant field for service data
          
          seriesData[index] += value;  // Sum up the values for each month
        }
      });
    }
  
    return { categories, seriesData };
  };
  

  const buildChart = (categories, salesData, serviceData) => {
    if (chartRef.current) {
      window.ApexCharts && new window.ApexCharts(chartRef.current, {
        chart: {
          height: 600,
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
          labels: {
            align: 'left',
            style: {
              colors: '#9ca3af',
              fontSize: '13px',
              fontFamily: 'Inter, ui-sans-serif',
              fontWeight: 400
            },
            formatter: (value) => value >= 1000 ? `${value / 1000}k` : value
          }
        },
        tooltip: {
          x: { format: 'dd MMM yyyy' },
          y: { formatter: (value) => `${value >= 1000 ? `${value / 1000}k` : value}` }
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
          <label htmlFor="dateRange" className="mr-2">Pilih Rentang Waktu:</label>
          <select id="dateRange" value={selectedRange} onChange={handleRangeChange} className="border p-2 rounded">
            <option value="7d">7 Hari Terakhir</option>
            <option value="6m">6 Bulan Terakhir</option>
            <option value="12m">12 Bulan Terakhir</option>
          </select>
        </div>
        <div id="hs-single-area-chart" ref={chartRef}></div>
      </div>
    </div>
  );
};

export default DashboardPage;
