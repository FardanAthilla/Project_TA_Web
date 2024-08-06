import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../../../components/sidebar';
import { fetchSalesData } from '../../../service/fetchapi';

const DashboardPage = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ categories: [], seriesData: [] });

  useEffect(() => {
    const handleLoad = async () => {
      try {
        const data = await fetchSalesData();
        console.log('Fetched Data:', data);
        const processedData = processChartData(data);
        console.log('Processed Data:', processedData);
        setChartData(processedData);
        buildChart(processedData);
      } catch (error) {
        console.error('Error loading chart data:', error);
      }
    };

    const processChartData = (data) => {
      if (!Array.isArray(data) || data.length === 0) {
        return { categories: [], seriesData: [] };
      }
    
      // Get today's date and the last 7 days
      const today = new Date();
      const lastSevenDays = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - (6 - i));
        return date;
      });
    
      const categories = lastSevenDays.map(date => date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));
      const seriesData = Array(7).fill(0);
    
      data.forEach((entry) => {
        const entryDate = new Date(entry.date);
        const index = lastSevenDays.findIndex(date => date.toDateString() === entryDate.toDateString());
        if (index !== -1) {
          const totalQuantity = entry.SalesReportItems.reduce((sum, item) => sum + item.quantity, 0);
          seriesData[index] = totalQuantity;
        }
      });
    
      return { categories, seriesData };
    };
      
    

    const buildChart = ({ categories, seriesData }) => {
      console.log('Building chart with:', { categories, seriesData });
      if (chartRef.current) {
        window.ApexCharts && new window.ApexCharts(chartRef.current, {
          chart: {
            height: 600,
            type: 'area',
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            }
          },
          series: [
            {
              name: 'Penjualan',
              data: seriesData
            }
          ],
          legend: {
            show: false
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            width: 2
          },
          grid: {
            strokeDashArray: 6
          },
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
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            crosshairs: {
              stroke: {
                dashArray: 0
              },
              dropShadow: {
                show: false
              }
            },
            tooltip: {
              enabled: false
            },
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
              minWidth: 0,
              maxWidth: 140,
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
            x: {
              format: 'dd MMM yyyy'
            },
            y: {
              formatter: (value) => `${value >= 1000 ? `${value / 1000}k` : value}`
            }
          },
          responsive: [{
            breakpoint: 568,
            options: {
              chart: {
                height: 300
              },
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
                  minWidth: 0,
                  maxWidth: 140,
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

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div className="container-fluid flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        <div className="text-black"></div>
        <div id="hs-single-area-chart" ref={chartRef}></div>
      </div>
    </div>
  );
};

export default DashboardPage;
